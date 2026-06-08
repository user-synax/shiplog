"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Briefcase, ExternalLink } from "lucide-react";
import ActivityHeatmap from "../[username]/ActivityHeatmap";

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
    ? new Date().toDateString() === new Date(user.lastLogDate).toDateString()
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
  const completionPercentage = Math.round((completedFields / totalFields) * 100);

  return (
    <div className="space-y-6 md:space-y-8 max-w-6xl mx-auto mt-0 md:mt-14">
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div
          className="p-4 md:p-5 rounded-2xl"
          style={{ backgroundColor: "var(--color-surface-1)", border: "1px solid var(--color-hairline)" }}
        >
          <p
            className="text-xs md:text-sm mb-1"
            style={{ color: "var(--color-ink-muted)" }}
          >
            Current Streak
          </p>
          <p
            className="text-2xl md:text-3xl font-bold"
            style={{ color: "var(--color-ink)" }}
          >
            {user.currentStreak}
            {isToday ? " (Today)" : ""}
          </p>
        </div>
        <div
          className="p-4 md:p-5 rounded-2xl"
          style={{ backgroundColor: "var(--color-surface-1)", border: "1px solid var(--color-hairline)" }}
        >
          <p
            className="text-xs md:text-sm mb-1"
            style={{ color: "var(--color-ink-muted)" }}
          >
            Total Logs {isToday ? " (Today)" : ""}
          </p>
          <p
            className="text-2xl md:text-3xl font-bold"
            style={{ color: "var(--color-ink)" }}
          >
            {user.totalLogs || 0}
          </p>
        </div>
        <div
          className="p-4 md:p-5 rounded-2xl"
          style={{ backgroundColor: "var(--color-surface-1)", border: "1px solid var(--color-hairline)" }}
        >
          <p
            className="text-xs md:text-sm mb-1"
            style={{ color: "var(--color-ink-muted)" }}
          >
            Total Projects {isToday ? " (Today)" : ""}
          </p>
          <p
            className="text-2xl md:text-3xl font-bold"
            style={{ color: "var(--color-ink)" }}
          >
            {user.totalProjects || 0}
          </p>
        </div>
        <div
          className="p-4 md:p-5 rounded-2xl"
          style={{ backgroundColor: "var(--color-surface-1)", border: "1px solid var(--color-hairline)" }}
        >
          <p
            className="text-xs md:text-sm mb-1"
            style={{ color: "var(--color-ink-muted)" }}
          >
            Profile Views
          </p>
          <p
            className="text-2xl md:text-3xl font-bold"
            style={{ color: "var(--color-ink)" }}
          >
            {user.totalProfileViews || 0}
          </p>
        </div>
      </div>

      {/* Heatmap Card */}
      <div
        className="rounded-2xl"
        style={{
          backgroundColor: "var(--color-surface-1)",
          border: "1px solid var(--color-hairline)"
        }}
      >
        <ActivityHeatmap 
          username={user.username} 
          cellSize={14}
          tooltipPosition="top"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <button
          onClick={() => router.push("/dashboard/logs")}
          className="p-5 md:p-6 rounded-2xl hover:cursor-pointer text-left transition-all duration-200 hover:opacity-90 bg-[var(--color-surface-1)] hover:bg-[var(--color-gradient-coral)]"
          style={{
            color: "var(--color-ink)",
            border: "1px solid var(--color-hairline)"
          }}
        >
          <Plus className="w-5 h-5 md:w-6 md:h-6 mb-2" />
          <p className="font-bold text-base md:text-lg">Add Build Log</p>
          <p className="text-xs md:text-sm opacity-80 mt-1">
            Track your daily progress
          </p>
        </button>
        <button
          onClick={() => router.push("/dashboard/projects")}
          className="p-5 md:p-6 rounded-2xl hover:cursor-pointer text-left transition-all duration-200 hover:opacity-90 bg-[var(--color-surface-1)] hover:bg-[var(--color-gradient-coral)]"
          style={{
            color: "var(--color-ink)",
            border: "1px solid var(--color-hairline)"
          }}
        >
          <Briefcase className="w-5 h-5 md:w-6 md:h-6 mb-2" />
          <p className="font-bold text-base md:text-lg">Add Project</p>
          <p
            className="text-xs md:text-sm mt-1"
            style={{ color: "var(--color-ink-muted)" }}
          >
            Showcase your work
          </p>
        </button>
        {user.username && (
          <button
            onClick={() => router.push(`/${user.username}`)}
            className="p-5 md:p-6 rounded-2xl hover:cursor-pointer text-left transition-all duration-200 hover:opacity-90 bg-[var(--color-surface-1)] hover:bg-[var(--color-gradient-coral)]"
            style={{
              color: "var(--color-ink)",
              border: "1px solid var(--color-hairline)"
            }}
          >
            <ExternalLink className="w-5 h-5 md:w-6 md:h-6 mb-2" />
            <p className="font-bold text-base md:text-lg">View Profile</p>
            <p
              className="text-xs md:text-sm mt-1"
              style={{ color: "var(--color-ink-muted)" }}
            >
              Check your public page
            </p>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Recent Build Logs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-lg md:text-xl font-bold tracking-tight"
              style={{
                fontFamily: "var(--font-plus-jakarta-sans)",
                color: "var(--color-ink)",
              }}
            >
              Recent Build Logs
            </h2>
          </div>
          <div className="space-y-3 md:space-y-4">
            {(user.recentLogs || []).map((log) => (
              <div
                key={log._id}
                className="p-4 md:p-5 rounded-2xl"
                style={{
                  backgroundColor: "var(--color-surface-1)",
                  border: "1px solid var(--color-hairline)"
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg md:text-xl">
                    {getMoodEmoji(log.mood)}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "var(--color-ink-muted)" }}
                  >
                    {new Date(log.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p
                  className="text-sm"
                  style={{ color: "var(--color-ink)" }}
                >
                  {log.content}
                </p>
              </div>
            ))}
            {(!user.recentLogs || user.recentLogs.length === 0) && (
              <div
                className="p-6 md:p-8 rounded-2xl text-center"
                style={{
                  backgroundColor: "var(--color-surface-1)",
                  color: "var(--color-ink-muted)",
                  border: "1px solid var(--color-hairline)"
                }}
              >
                No logs yet! Start your first build log.
              </div>
            )}
          </div>
        </div>

        {/* Profile Completion Progress */}
        <div>
          <div
            className="p-5 md:p-6 rounded-2xl h-full"
            style={{ backgroundColor: "var(--color-surface-1)", border: "1px solid var(--color-hairline)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className="font-bold tracking-tight text-base md:text-lg"
                style={{ color: "var(--color-ink)" }}
              >
                Profile Completion
              </h3>
              <span
                className="text-base md:text-lg font-bold"
                style={{ color: "var(--color-ink-muted)" }}
              >
                {completionPercentage}%
              </span>
            </div>
            <div
              className="h-2 md:h-3 rounded-full overflow-hidden mb-4 md:mb-6"
              style={{ backgroundColor: "var(--color-surface-2)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${completionPercentage}%`,
                  backgroundColor: "var(--color-ink)"
                }}
              ></div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <span style={{color: user.username ? "var(--color-ink)" : "var(--color-ink-muted)"}}>
                ✓ Username
              </span>
              <span style={{color: user.name ? "var(--color-ink)" : "var(--color-ink-muted)"}}>
                ✓ Name
              </span>
              <span style={{color: user.tagline ? "var(--color-ink)" : "var(--color-ink-muted)"}}>
                ✓ Tagline
              </span>
              <span style={{color: user.bio ? "var(--color-ink)" : "var(--color-ink-muted)"}}>
                ✓ Bio
              </span>
              <span style={{color: (user.avatarUrl || user.image) ? "var(--color-ink)" : "var(--color-ink-muted)"}}>
                ✓ Avatar
              </span>
              <span style={{color: user.currentStreak > 0 ? "var(--color-ink)" : "var(--color-ink-muted)"}}>
                ✓ Streak
              </span>
              <span style={{color: user.totalProjects > 0 ? "var(--color-ink)" : "var(--color-ink-muted)"}}>
                ✓ Projects
              </span>
              <span style={{color: user.availability !== "not_available" ? "var(--color-ink)" : "var(--color-ink-muted)"}}>
                ✓ Availability
              </span>
            </div>
          </div>
        </div>
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
