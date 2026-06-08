import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import BuildLog from "@/models/BuildLog";
import Achievement from "@/models/Achievement";

export const runtime = "nodejs";

export async function GET(request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    const user = await User.findOne({ email: session.user.email });
    const logs = await BuildLog.find({ userId: user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    const totalLogs = await BuildLog.countDocuments({ userId: user._id });

    return NextResponse.json({
        logs,
        hasMore: totalLogs > page * limit,
    });
}

export async function POST(request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const data = await request.json();
    const { content, mood, tags } = data;

    if (!content) {
        return NextResponse.json(
            { error: "Content is required" },
            { status: 400 },
        );
    }

    const user = await User.findOne({ email: session.user.email });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastLogDate = user.lastLogDate ? new Date(user.lastLogDate) : null;
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastLogDate) {
        const normalizedLastLog = new Date(lastLogDate);
        normalizedLastLog.setHours(0, 0, 0, 0);
        if (normalizedLastLog.getTime() === today.getTime()) {
            return NextResponse.json(
                { error: "Already logged today" },
                { status: 409 },
            );
        }
    }

    let newStreak;
    if (lastLogDate) {
        const normalizedLastLog = new Date(lastLogDate);
        normalizedLastLog.setHours(0, 0, 0, 0);
        if (normalizedLastLog.getTime() === yesterday.getTime()) {
            newStreak = user.currentStreak + 1;
        } else {
            newStreak = 1;
        }
    } else {
        newStreak = 1;
    }

    const longestStreak = Math.max(newStreak, user.longestStreak);

    const log = await BuildLog.create({
        userId: user._id,
        content,
        mood,
        tags,
    });

    user.lastLogDate = new Date();
    user.currentStreak = newStreak;
    user.longestStreak = longestStreak;
    user.totalLogs = user.totalLogs + 1;

    const achievementsToCheck = [
        { type: "first_log", threshold: 1 },
        { type: "streak_7", threshold: 7 },
        { type: "streak_30", threshold: 30 },
        { type: "streak_100", threshold: 100 },
    ];

    for (const ach of achievementsToCheck) {
        const hasAchievement = await Achievement.findOne({
            userId: user._id,
            type: ach.type,
        });
        if (
            !hasAchievement &&
            (ach.type === "first_log" || newStreak >= ach.threshold)
        ) {
            await Achievement.create({
                userId: user._id,
                type: ach.type,
                title:
                    ach.type === "first_log"
                        ? "First Ship Log"
                        : ach.type === "streak_7"
                          ? "7 Day Streak"
                          : ach.type === "streak_30"
                            ? "30 Day Streak"
                            : "100 Day Streak",
            });
        }
    }

    await user.save();

    return NextResponse.json({ log, user });
}
