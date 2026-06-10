export const runtime = "nodejs";

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import BuildLog from "@/models/BuildLog";
import { auth } from "@/auth";

export async function POST(request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const data = await request.json();
    const { username, tagline, availability, logContent, logMood } = data;

    // Validate username
    const usernameRegex = /^[a-z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
        return NextResponse.json(
            { error: "Invalid username" },
            { status: 400 },
        );
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if username is taken
    const existingUsername = await User.findOne({ username });
    if (
        existingUsername &&
        existingUsername._id.toString() !== user._id.toString()
    ) {
        return NextResponse.json(
            { error: "Username already taken" },
            { status: 400 },
        );
    }

    // Update user
    user.username = username;
    user.tagline = tagline;
    user.availability = availability;

    // Handle build log and streak
    let logCreated = false;
    if (logContent) {
        const log = await BuildLog.create({
            userId: user._id,
            content: logContent,
            mood: logMood,
        });
        logCreated = true;

        // Update streak and totalLogs
        user.currentStreak = 1;
        user.longestStreak = 1;
        user.lastLogDate = new Date();
        user.totalLogs = 1;

        // Unlock first_log achievement
        await Achievement.create({
            userId: user._id,
            type: "first_log",
            title: "First Ship Log",
        });
    }

    await user.save();

    return NextResponse.json({ success: true });
}
