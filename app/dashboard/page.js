"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Briefcase, ExternalLink } from "lucide-react";
import ActivityHeatmap from "../[username]/ActivityHeatmap";
import Link from "next/link";

export default function Overview() {
    const { data: session } = useSession();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            if (session) {
                const res = await fetch("/api/user/me");
                const data = await res.json();
                if (!data.user?.username) {
                    router.push("/onboarding");
                    return;
                }
                setUser(data.user);
                setLoading(false);
            }
        };
        fetchData();
    }, [session, router]);

    if (loading || !session || !user) {
        return (
            <div
                className="flex items-center justify-center min-h-[60vh]"
                style={{ color: "var(--color-ink-muted)" }}
            >
                Loading...
            </div>
        );
    }

    const isToday = user.lastLogDate
        ? new Date().toDateString() ===
          new Date(user.lastLogDate).toDateString()
        : false;

    // Calculate profile completion percentage
    let completedFields = 0;
    const totalFields = 8;
    if (user.username) completedFields++;
    if (user.name) completedFields++;
    if (user.tagline) completedFields++;
    if (user.bio) completedFields++;
    if (user.avatarUrl || user.image) completedFields++;
    if (user.currentStreak > 0) completedFields++;
    if (user.totalProjects > 0) completedFields++;
    if (user.availability !== "not_available") completedFields++;
    const completionPercentage = Math.round(
        (completedFields / totalFields) * 100,
    );

    return (
        <div className="space-y-4 mt-14 md:space-y-6 max-w-6xl mx-auto mt-0 md:mt-14 px-4 md:px-0">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h1
                    className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight"
                    style={{
                        fontFamily: "var(--font-plus-jakarta-sans)",
                        color: "var(--color-ink)",
                    }}
                >
                    Welcome back, {user.name?.split(" ")[0]}!
                </h1>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div
                    className="p-4 md:p-5 rounded-2xl flex flex-col gap-1"
                    style={{
                        backgroundColor: "var(--color-surface-1)",
                        border: "1px solid var(--color-hairline)",
                    }}
                >
                    <p
                        className="text-xs uppercase tracking-widest"
                        style={{ color: "var(--color-ink-muted)" }}
                    >
                        Current Streak
                    </p>
                    <p
                        className="text-2xl md:text-3xl font-bold leading-none"
                        style={{ color: "var(--color-ink)" }}
                    >
                        {user.currentStreak}
                    </p>
                    {isToday && (
                        <span
                            className="text-xs mt-1"
                            style={{ color: "var(--color-gradient-coral)" }}
                        >
                            ↑ Active today
                        </span>
                    )}
                </div>

                <div
                    className="p-4 md:p-5 rounded-2xl flex flex-col gap-1"
                    style={{
                        backgroundColor: "var(--color-surface-1)",
                        border: "1px solid var(--color-hairline)",
                    }}
                >
                    <p
                        className="text-xs uppercase tracking-widest"
                        style={{ color: "var(--color-ink-muted)" }}
                    >
                        Total Logs
                    </p>
                    <p
                        className="text-2xl md:text-3xl font-bold leading-none"
                        style={{ color: "var(--color-ink)" }}
                    >
                        {user.totalLogs || 0}
                    </p>
                    {isToday && (
                        <span
                            className="text-xs mt-1"
                            style={{ color: "var(--color-ink-muted)" }}
                        >
                            Updated today
                        </span>
                    )}
                </div>

                <div
                    className="p-4 md:p-5 rounded-2xl flex flex-col gap-1"
                    style={{
                        backgroundColor: "var(--color-surface-1)",
                        border: "1px solid var(--color-hairline)",
                    }}
                >
                    <p
                        className="text-xs uppercase tracking-widest"
                        style={{ color: "var(--color-ink-muted)" }}
                    >
                        Total Projects
                    </p>
                    <p
                        className="text-2xl md:text-3xl font-bold leading-none"
                        style={{ color: "var(--color-ink)" }}
                    >
                        {user.totalProjects || 0}
                    </p>
                    {isToday && (
                        <span
                            className="text-xs mt-1"
                            style={{ color: "var(--color-ink-muted)" }}
                        >
                            Updated today
                        </span>
                    )}
                </div>

                <div
                    className="p-4 md:p-5 rounded-2xl flex flex-col gap-1"
                    style={{
                        backgroundColor: "var(--color-surface-1)",
                        border: "1px solid var(--color-hairline)",
                    }}
                >
                    <p
                        className="text-xs uppercase tracking-widest"
                        style={{ color: "var(--color-ink-muted)" }}
                    >
                        Profile Views
                    </p>
                    <p
                        className="text-2xl md:text-3xl font-bold leading-none"
                        style={{ color: "var(--color-ink)" }}
                    >
                        {user.totalProfileViews || 0}
                    </p>
                </div>
            </div>

            {/* Heatmap Card */}
            <div
                className="rounded-2xl overflow-hidden"
                style={{
                    backgroundColor: "var(--color-surface-1)",
                    border: "1px solid var(--color-hairline)",
                }}
            >
                <ActivityHeatmap
                    username={user.username}
                    cellSize={14}
                    tooltipPosition="top"
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                    onClick={() => router.push("/dashboard/logs")}
                    className="p-5 rounded-2xl text-left transition-all duration-200 group"
                    style={{
                        backgroundColor: "var(--color-surface-1)",
                        border: "1px solid var(--color-hairline)",
                        color: "var(--color-ink)",
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.borderColor =
                            "var(--color-gradient-coral)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.borderColor =
                            "var(--color-hairline)")
                    }
                >
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                        style={{ backgroundColor: "rgba(244,63,94,0.12)" }}
                    >
                        <Plus
                            className="w-4 h-4"
                            style={{ color: "var(--color-gradient-coral)" }}
                        />
                    </div>
                    <p
                        className="font-bold text-sm md:text-base"
                        style={{ color: "var(--color-ink)" }}
                    >
                        Add Build Log
                    </p>
                    <p
                        className="text-xs md:text-sm mt-1"
                        style={{ color: "var(--color-ink-muted)" }}
                    >
                        Track your daily progress
                    </p>
                </button>

                <button
                    onClick={() => router.push("/dashboard/projects")}
                    className="p-5 rounded-2xl text-left transition-all duration-200"
                    style={{
                        backgroundColor: "var(--color-surface-1)",
                        border: "1px solid var(--color-hairline)",
                        color: "var(--color-ink)",
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.borderColor =
                            "var(--color-gradient-violet)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.borderColor =
                            "var(--color-hairline)")
                    }
                >
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                        style={{ backgroundColor: "rgba(139,92,246,0.12)" }}
                    >
                        <Briefcase
                            className="w-4 h-4"
                            style={{ color: "var(--color-gradient-violet)" }}
                        />
                    </div>
                    <p
                        className="font-bold text-sm md:text-base"
                        style={{ color: "var(--color-ink)" }}
                    >
                        Add Project
                    </p>
                    <p
                        className="text-xs md:text-sm mt-1"
                        style={{ color: "var(--color-ink-muted)" }}
                    >
                        Showcase your work
                    </p>
                </button>

                {user.username && (
                    <Link
                        href={`/${user.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-5 rounded-2xl text-left transition-all duration-200 block"
                        style={{
                            backgroundColor: "var(--color-surface-1)",
                            border: "1px solid var(--color-hairline)",
                            color: "var(--color-ink)",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.borderColor =
                                "var(--color-gradient-orange)")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.borderColor =
                                "var(--color-hairline)")
                        }
                    >
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                            style={{ backgroundColor: "rgba(249,115,22,0.12)" }}
                        >
                            <ExternalLink
                                className="w-4 h-4"
                                style={{
                                    color: "var(--color-gradient-orange)",
                                }}
                            />
                        </div>
                        <p
                            className="font-bold text-sm md:text-base"
                            style={{ color: "var(--color-ink)" }}
                        >
                            View Profile
                        </p>
                        <p
                            className="text-xs md:text-sm mt-1"
                            style={{ color: "var(--color-ink-muted)" }}
                        >
                            Check your public page
                        </p>
                    </Link>
                )}
            </div>

            {/* Bottom: Logs (and Profile Completion if not 100%) */}
            <div className="space-y-4 md:space-y-6">
                {/* Recent Build Logs - Full Width */}
                <div className="flex flex-col gap-3">
                    <h2
                        className="text-base md:text-lg font-bold tracking-tight"
                        style={{
                            fontFamily: "var(--font-plus-jakarta-sans)",
                            color: "var(--color-ink)",
                        }}
                    >
                        Recent Build Logs
                    </h2>

                    {(user.recentLogs || []).map((log) => (
                        <div
                            key={log._id}
                            className="p-4 rounded-2xl"
                            style={{
                                backgroundColor: "var(--color-surface-1)",
                                border: "1px solid var(--color-hairline)",
                            }}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-base">
                                    {getMoodEmoji(log.mood)}
                                </span>
                                <span
                                    className="text-xs"
                                    style={{ color: "var(--color-ink-muted)" }}
                                >
                                    {new Date(
                                        log.createdAt,
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                            <p
                                className="text-sm leading-relaxed"
                                style={{ color: "var(--color-ink)" }}
                            >
                                {log.content}
                            </p>
                        </div>
                    ))}

                    {(!user.recentLogs || user.recentLogs.length === 0) && (
                        <div
                            className="p-8 rounded-2xl text-center text-sm"
                            style={{
                                backgroundColor: "var(--color-surface-1)",
                                color: "var(--color-ink-muted)",
                                border: "1px solid var(--color-hairline)",
                            }}
                        >
                            No logs yet. Start your first build log.
                        </div>
                    )}
                </div>

                {/* Profile Completion - Only show if not 100% */}
                {completionPercentage < 100 && (
                    <div
                        className="p-5 md:p-6 rounded-2xl"
                        style={{
                            backgroundColor: "var(--color-surface-1)",
                            border: "1px solid var(--color-hairline)",
                        }}
                    >
                        <div className="flex items-baseline justify-between mb-3">
                            <h3
                                className="font-bold text-base md:text-lg tracking-tight"
                                style={{ color: "var(--color-ink)" }}
                            >
                                Profile Completion
                            </h3>
                            <span
                                className="text-lg font-bold"
                                style={{ color: "var(--color-ink-muted)" }}
                            >
                                {completionPercentage}%
                            </span>
                        </div>

                        {/* Progress bar */}
                        <div
                            className="h-1.5 rounded-full overflow-hidden mb-5"
                            style={{ backgroundColor: "var(--color-surface-2)" }}
                        >
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${completionPercentage}%`,
                                    background:
                                        "linear-gradient(90deg, var(--color-gradient-violet), var(--color-gradient-coral))",
                                }}
                            />
                        </div>

                        {/* Checklist */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                            {[
                                { label: "Username", done: !!user.username },
                                { label: "Name", done: !!user.name },
                                { label: "Tagline", done: !!user.tagline },
                                { label: "Bio", done: !!user.bio },
                                {
                                    label: "Avatar",
                                    done: !!(user.avatarUrl || user.image),
                                },
                                { label: "Streak", done: user.currentStreak > 0 },
                                { label: "Projects", done: user.totalProjects > 0 },
                                {
                                    label: "Availability",
                                    done: user.availability !== "not_available",
                                },
                            ].map(({ label, done }) => (
                                <div
                                    key={label}
                                    className="flex items-center gap-2"
                                >
                                    <span
                                        className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-xs"
                                        style={{
                                            backgroundColor: done
                                                ? "rgba(74,222,128,0.15)"
                                                : "var(--color-surface-2)",
                                            border: done
                                                ? "none"
                                                : "1px solid var(--color-hairline)",
                                            color: done
                                                ? "var(--color-semantic-success)"
                                                : "transparent",
                                        }}
                                    >
                                        {done ? "✓" : ""}
                                    </span>
                                    <span
                                        className="text-xs"
                                        style={{
                                            color: done
                                                ? "var(--color-ink)"
                                                : "var(--color-ink-muted)",
                                        }}
                                    >
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function getMoodEmoji(mood) {
    const emojis = {
        productive: "🚀",
        stuck: "😵",
        learning: "📚",
        shipping: "🎉",
        grinding: "💪",
    };
    return emojis[mood] || "📝";
}
