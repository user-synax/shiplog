export const runtime = "nodejs";

import connectToDB from "@/lib/db";
import User from "@/models/User";
import ProfileView from "@/models/ProfileView";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectToDB();
        const { profileUsername } = await request.json();
        const user = await User.findOne({ username: profileUsername });
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 },
            );
        }
        const ip =
            request.headers.get("x-forwarded-for") || request.ip || "unknown";
        const country = request.headers.get("x-vercel-ip-country") || "unknown";
        const city = request.headers.get("x-vercel-ip-city") || "unknown";
        const referrer = request.headers.get("referer") || "unknown";
        const userAgent = request.headers.get("user-agent") || "unknown";
        const profileView = new ProfileView({
            profileUserId: user._id,
            visitorIp: ip,
            country,
            city,
            referrer,
            userAgent,
        });
        await profileView.save();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to track profile view" },
            { status: 500 },
        );
    }
}
