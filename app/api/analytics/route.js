import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import ProfileView from "@/models/ProfileView";
import Click from "@/models/Click";
import Guestbook from "@/models/Guestbook";
import Project from "@/models/Project";

export const runtime = "nodejs";

export async function GET(request) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const user = await User.findOne({ email: session.user.email });
        if (!user?.isPro) {
            return NextResponse.json({ error: "Pro only" }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const range = searchParams.get("range") || "7d";

        // Calculate date range
        const now = new Date();
        let startDate;

        switch (range) {
            case "7d":
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case "30d":
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case "all":
                startDate = new Date(0);
                break;
            default:
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        }

        // 1. Total profile views (all time)
        const totalProfileViews = await ProfileView.countDocuments({
            profileUserId: user._id,
        });

        // 2. Views by day for the range
        const viewsByDay = await ProfileView.aggregate([
            {
                $match: {
                    profileUserId: user._id,
                    createdAt: { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // 3. Views by country
        const viewsByCountry = await ProfileView.aggregate([
            {
                $match: {
                    profileUserId: user._id,
                    createdAt: { $gte: startDate },
                    country: { $ne: null },
                },
            },
            {
                $group: {
                    _id: "$country",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
        ]);

        // 4. Top projects (demo + repo clicks)
        const topProjects = await Click.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                },
            },
            {
                $lookup: {
                    from: "projects",
                    localField: "projectId",
                    foreignField: "_id",
                    as: "project",
                },
            },
            { $unwind: "$project" },
            {
                $match: {
                    "project.userId": user._id,
                },
            },
            {
                $group: {
                    _id: "$projectId",
                    title: { $first: "$project.title" },
                    demoClicks: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "demo"] }, 1, 0],
                        },
                    },
                    repoClicks: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "repo"] }, 1, 0],
                        },
                    },
                },
            },
            {
                $addFields: {
                    totalClicks: { $add: ["$demoClicks", "$repoClicks"] },
                },
            },
            { $sort: { totalClicks: -1 } },
            { $limit: 5 },
        ]);

        // 5. Streak stats and total logs
        const { currentStreak, longestStreak, totalLogs } = user;

        // 6. Guestbook count
        const guestbookCount = await Guestbook.countDocuments({
            profileUserId: user._id,
        });

        return NextResponse.json({
            totalProfileViews,
            viewsByDay: viewsByDay.map((d) => ({
                date: d._id,
                count: d.count,
            })),
            viewsByCountry: viewsByCountry.map((c) => ({
                country: c._id,
                count: c.count,
            })),
            topProjects: topProjects.map((p) => ({
                projectId: p._id,
                title: p.title,
                demoClicks: p.demoClicks,
                repoClicks: p.repoClicks,
            })),
            currentStreak,
            longestStreak,
            totalLogs,
            guestbookCount,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
