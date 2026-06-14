export const runtime = "nodejs";

import connectToDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectToDB();
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Please fill in all fields" },
                { status: 400 },
            );
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "Email already in use" },
                { status: 400 },
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();

        return NextResponse.json(
            { success: true, userId: user._id },
            { status: 201 },
        );
    } catch (error) {
        console.error("Sign-up error details:", {
            message: error.message,
            stack: error.stack,
            name: error.name,
            code: error.code,
        });
        return NextResponse.json(
            { error: "Internal server error", details: error.message },
            { status: 500 },
        );
    }
}
