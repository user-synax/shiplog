import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import BuildLog from "@/models/BuildLog";

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

    let newStreak;
    if (lastLogDate) {
        const normalizedLastLog = new Date(lastLogDate);
        normalizedLastLog.setHours(0, 0, 0, 0);
        if (normalizedLastLog.getTime() === yesterday.getTime()) {
            newStreak = (user.currentStreak || 0) + 1;
        } else if (normalizedLastLog.getTime() === today.getTime()) {
            // Already logged today - keep current streak
            newStreak = user.currentStreak;
        } else {
            newStreak = 1;
        }
    } else {
        newStreak = 1;
    }

    const longestStreak = Math.max(newStreak, user.longestStreak || 0);

    const log = await BuildLog.create({
        userId: user._id,
        content,
        mood,
        tags,
    });

    // Only update lastLogDate and streak if not logged before today
    const lastLogNorm = lastLogDate ? new Date(lastLogDate) : null;
    if (lastLogNorm) {
        lastLogNorm.setHours(0, 0, 0, 0);
    }
    if (!lastLogDate || lastLogNorm.getTime() !== today.getTime()) {
        user.lastLogDate = new Date();
        user.currentStreak = newStreak;
        user.longestStreak = longestStreak;
    }
    user.totalLogs = (user.totalLogs || 0) + 1;

    await user.save();

    return NextResponse.json({ log, user });
}
