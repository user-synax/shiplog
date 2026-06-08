export const runtime = "nodejs";

import connectToDB from "@/lib/db";
import User from "@/models/User";
import BuildLog from "@/models/BuildLog";
import { NextResponse } from "next/server";

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
        const logs = await BuildLog.find({ userId: user._id }).select(
            "createdAt",
        );
        const dateCounts = {};
        logs.forEach((log) => {
            const date = new Date(log.createdAt).toISOString().split("T")[0];
            dateCounts[date] = (dateCounts[date] || 0) + 1;
        });
        return NextResponse.json({ dateCounts });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to get heatmap data" },
            { status: 500 },
        );
    }
}
