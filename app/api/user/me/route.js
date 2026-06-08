export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import { getDefaultAvatarUrl, isAdminEmail } from "@/lib/utils";
import User from "@/models/User";
import Project from "@/models/Project";
import BuildLog from "@/models/BuildLog";
import ProfileView from "@/models/ProfileView";

export async function GET(request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email }).lean();
    const totalProjects = await Project.countDocuments({ userId: user._id });
    const totalProfileViews = await ProfileView.countDocuments({
        profileUserId: user._id,
    });
    const recentLogs = await BuildLog.find({ userId: user._id })
        .sort({ createdAt: -1 })
        .limit(3)
        .lean();

    return NextResponse.json({
        user: {
            ...user,
            avatarUrl: user.avatarUrl || user.image || getDefaultAvatarUrl(user.username),
            totalProjects,
            totalProfileViews,
            recentLogs,
            isAdmin: isAdminEmail(session.user.email),
        },
    });
}
