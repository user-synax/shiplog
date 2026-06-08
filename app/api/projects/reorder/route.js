import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Project from "@/models/Project";

export const runtime = "nodejs";

export async function PATCH(request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { updates } = await request.json();
    const user = await User.findOne({ email: session.user.email });

    for (const { id, order } of updates) {
        await Project.updateOne({ _id: id, userId: user._id }, { order });
    }

    return NextResponse.json({ success: true });
}
