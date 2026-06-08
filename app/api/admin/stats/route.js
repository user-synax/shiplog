export const runtime = "nodejs";

import { auth } from "../../../../auth.js";
import dbConnect from "../../../../lib/db.js";
import User from "../../../../models/User.js";
import BuildLog from "../../../../models/BuildLog.js";
import ProfileView from "../../../../models/ProfileView.js";
import { isAdminEmail } from "../../../../lib/utils.js";

export async function GET(req) {
    const session = await auth();
    const isAdmin = isAdminEmail(session?.user?.email);
    if (!isAdmin) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();
    const totalUsers = await User.countDocuments();
    const totalProUsers = await User.countDocuments({ isPro: true });
    const totalBuildLogs = await BuildLog.countDocuments();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const totalProfileViewsToday = await ProfileView.countDocuments({
        createdAt: { $gte: today, $lt: tomorrow },
    });

    return Response.json({
        totalUsers,
        totalProUsers,
        totalBuildLogs,
        totalProfileViewsToday,
    });
}
