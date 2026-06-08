export const runtime = "nodejs";

import { auth } from "../../auth.js";
import dbConnect from "../../lib/db.js";
import User from "../../models/User.js";
import BuildLog from "../../models/BuildLog.js";
import ProfileView from "../../models/ProfileView.js";

export default async function AdminDashboard() {
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

    const stats = [
        { label: "Total Users", value: totalUsers },
        { label: "Total Pro Users", value: totalProUsers },
        { label: "Total Build Logs", value: totalBuildLogs },
        { label: "Profile Views Today", value: totalProfileViewsToday },
    ];

    return (
        <div>
            <h1
                className="text-3xl font-bold mb-8"
                style={{ color: "var(--color-ink)" }}
            >
                Admin Dashboard
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <div
                        key={idx}
                        className="p-6 rounded-2xl"
                        style={{ backgroundColor: "var(--color-surface-1)" }}
                    >
                        <div
                            className="text-sm mb-2"
                            style={{ color: "var(--color-ink-muted)" }}
                        >
                            {stat.label}
                        </div>
                        <div
                            className="text-3xl font-bold"
                            style={{ color: "var(--color-ink)" }}
                        >
                            {stat.value}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
