import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import BuildLog from "@/models/BuildLog";

export const runtime = "nodejs";

export async function DELETE(request, { params }) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const user = await User.findOne({ email: session.user.email });
    const log = await BuildLog.findOne({ _id: id, userId: user._id });
    if (!log) {
        return NextResponse.json({ error: "Log not found" }, { status: 404 });
    }

    await BuildLog.deleteOne({ _id: id, userId: user._id });

    const isMostRecent =
        log.createdAt.toISOString() === user.lastLogDate?.toISOString();
    if (isMostRecent) {
        const newMostRecent = await BuildLog.findOne({ userId: user._id }).sort(
            { createdAt: -1 },
        );
        if (!newMostRecent) {
            user.lastLogDate = null;
            user.currentStreak = 0;
        } else {
            user.lastLogDate = newMostRecent.createdAt;
            let streak = 1;
            let currentDate = new Date(newMostRecent.createdAt);
            currentDate.setHours(0, 0, 0, 0);
            while (true) {
                const prevDate = new Date(currentDate);
                prevDate.setDate(prevDate.getDate() - 1);
                const prevLog = await BuildLog.findOne({
                    userId: user._id,
                    createdAt: { $gte: prevDate, $lt: currentDate },
                });
                if (prevLog) {
                    streak++;
                    currentDate = prevDate;
                } else {
                    break;
                }
            }
            user.currentStreak = streak;
            if (streak > user.longestStreak) {
                user.longestStreak = streak;
            }
        }
    }

    user.totalLogs = Math.max(0, user.totalLogs - 1);
    await user.save();

    return NextResponse.json({ success: true, user });
}
