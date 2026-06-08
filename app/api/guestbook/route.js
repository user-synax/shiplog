export const runtime = "nodejs";

import connectToDB from "@/lib/db";
import User from "@/models/User";
import Guestbook from "@/models/Guestbook";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectToDB();
        const { profileUsername, name, email, message } = await request.json();
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 },
            );
        }
        if (message.length > 300) {
            return NextResponse.json(
                { error: "Message too long (max 300 characters)" },
                { status: 400 },
            );
        }
        const user = await User.findOne({ username: profileUsername });
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 },
            );
        }
        const guestbook = new Guestbook({
            profileUserId: user._id,
            authorName: name,
            authorEmail: email,
            message,
            isApproved: true,
        });
        await guestbook.save();
        return NextResponse.json(
            { success: true, guestbook },
            { status: 201 },
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to leave message" },
            { status: 500 },
        );
    }
}

export async function GET(request) {
    try {
        await connectToDB();
        const { searchParams } = new URL(request.url);
        const username = searchParams.get("username");
        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 },
            );
        }
        const messages = await Guestbook.find({
            profileUserId: user._id,
            isApproved: true,
        })
            .sort({ createdAt: -1 })
            .limit(10);
        return NextResponse.json(
            { messages },
            { status: 200 },
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to get guestbook" },
            { status: 500 },
        );
    }
}
