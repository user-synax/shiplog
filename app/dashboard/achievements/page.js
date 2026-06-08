import { redirect } from "next/navigation";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Achievement from "@/models/Achievement";
import { ACHIEVEMENTS } from "@/lib/achievements";

export default async function AchievementsPage() {
    const session = await auth();
    if (!session) redirect("/auth/signin");

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    const achievements = await Achievement.find({ userId: user._id }).lean();
    const earnedTypes = new Set(achievements.map((a) => a.type));

    const achievementIcons = {
        first_log: "📝",
        streak_7: "🔥",
        streak_30: "🚀",
        streak_100: "🏆",
        first_project: "🎉",
        profile_complete: "✨",
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1
                    className="text-2xl font-bold"
                    style={{
                        fontFamily: "var(--font-plus-jakarta-sans)",
                        color: "var(--color-ink)",
                    }}
                >
                    Achievements
                </h1>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(ACHIEVEMENTS).map(([type, info]) => {
                    const earned = earnedTypes.has(type);
                    const achievement = achievements.find(
                        (a) => a.type === type,
                    );

                    return (
                        <div
                            key={type}
                            className="p-6 rounded-2xl"
                            style={{
                                backgroundColor: earned
                                    ? "var(--color-surface-1)"
                                    : "var(--color-surface-2)",
                                opacity: earned ? 1 : 0.5,
                            }}
                        >
                            <div className="flex items-start gap-4">
                                <div
                                    className="text-4xl"
                                    style={{
                                        filter: earned
                                            ? "none"
                                            : "grayscale(100%)",
                                    }}
                                >
                                    {achievementIcons[type]}
                                </div>
                                <div>
                                    <h3
                                        className="text-lg font-semibold"
                                        style={{ color: "var(--color-ink)" }}
                                    >
                                        {info.title}
                                    </h3>
                                    {earned && achievement && (
                                        <p
                                            className="text-sm mt-1"
                                            style={{
                                                color: "var(--color-ink-muted)",
                                            }}
                                        >
                                            Earned on{" "}
                                            {new Date(
                                                achievement.earnedAt,
                                            ).toLocaleDateString()}
                                        </p>
                                    )}
                                    {!earned && (
                                        <p
                                            className="text-sm mt-1"
                                            style={{
                                                color: "var(--color-ink-muted)",
                                            }}
                                        >
                                            Locked
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
