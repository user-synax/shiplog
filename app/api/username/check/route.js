export const runtime = "nodejs";

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");

    if (!q) {
        return NextResponse.json({ available: false });
    }

    // Validate username format
    const regex = /^[a-z0-9_]{3,20}$/;
    if (!regex.test(q)) {
        return NextResponse.json({ available: false });
    }

    await dbConnect();

    const user = await User.findOne({ username: q });

    return NextResponse.json({ available: !user });
}
