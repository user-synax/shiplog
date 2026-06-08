export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { checkAndUnlock, isProfileComplete } from "@/lib/achievements";

export async function PATCH(request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const data = await request.json();
    const {
        username,
        name,
        tagline,
        bio,
        availability,
        socials,
        isProfilePublic,
        theme,
    } = data;

    const user = await User.findOne({ email: session.user.email });

    // Validate and update username if changed
    if (username && username !== user.username) {
        const regex = /^[a-z0-9_]{3,20}$/;
        if (!regex.test(username)) {
            return NextResponse.json(
                { error: "Invalid username" },
                { status: 400 },
            );
        }
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return NextResponse.json(
                { error: "Username already taken" },
                { status: 400 },
            );
        }
        user.username = username;
    }

    if (name !== undefined) user.name = name;
    if (tagline !== undefined) user.tagline = tagline;
    if (bio !== undefined) user.bio = bio;
    if (availability !== undefined) user.availability = availability;
    if (isProfilePublic !== undefined) user.isProfilePublic = isProfilePublic;
    if (socials) user.socials = { ...user.socials, ...socials };
    if (theme !== undefined) user.theme = theme;

    await user.save();

    // Check if profile is complete and unlock achievement
    const complete = await isProfileComplete(user._id);
    if (complete) {
        await checkAndUnlock(user._id, "profile_complete");
    }

    return NextResponse.json({ success: true, user });
}
