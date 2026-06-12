"use client";

import { useState, useEffect } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";
import { Users, TrendingUp, Star, MessageSquare } from "lucide-react";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div
                className="p-3 rounded-xl"
                style={{ backgroundColor: "var(--color-surface-2)" }}
            >
                <p
                    className="text-sm font-medium mb-1"
                    style={{ color: "var(--color-ink)" }}
                >
                    {label}
                </p>
                <p
                    className="text-sm"
                    style={{ color: "var(--color-ink-muted)" }}
                >
                    {payload[0].value} views
                </p>
            </div>
        );
    }
    return null;
};

const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div
                className="p-3 rounded-xl"
                style={{ backgroundColor: "var(--color-surface-2)" }}
            >
                <p
                    className="text-sm font-medium mb-1"
                    style={{ color: "var(--color-ink)" }}
                >
                    {label}
                </p>
                {payload.map((entry, index) => (
                    <p
                        key={index}
                        className="text-sm"
                        style={{ color: "var(--color-ink-muted)" }}
                    >
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function AnalyticsDashboard() {
    const [range, setRange] = useState("7d");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [range]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/analytics?range=${range}`);
            if (res.ok) {
                const data = await res.json();
                setData(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div
                className="min-h-full flex items-center justify-center"
                style={{ color: "var(--color-ink-muted)" }}
            >
                Loading analytics...
            </div>
        );
    }

    const ranges = [
        { label: "7 Days", value: "7d" },
        { label: "30 Days", value: "30d" },
        { label: "All Time", value: "all" },
    ];

    const topProject = data?.topProjects?.[0];

    return (
        <div className="space-y-4 mt-14 md:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1
                        className={`${plusJakarta.className} text-2xl font-semibold tracking-[-0.03em]`}
                        style={{ color: "var(--color-ink)" }}
                    >
                        Analytics
                    </h1>
                    <p
                        className="mt-1 text-sm"
                        style={{ color: "var(--color-ink-muted)" }}
                    >
                        Track your profile performance
                    </p>
                </div>
                <div
                    className="inline-flex rounded-full p-1"
                    style={{ backgroundColor: "var(--color-surface-1)" }}
                >
                    {ranges.map((r) => (
                        <button
                            key={r.value}
                            onClick={() => setRange(r.value)}
                            className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                            style={{
                                backgroundColor:
                                    range === r.value
                                        ? "var(--color-surface-2)"
                                        : "transparent",
                                color:
                                    range === r.value
                                        ? "var(--color-ink)"
                                        : "var(--color-ink-muted)",
                            }}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                    className="p-5 rounded-2xl"
                    style={{ backgroundColor: "var(--color-surface-1)" }}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div
                            className="p-2 rounded-xl"
                            style={{ backgroundColor: "var(--color-surface-2)" }}
                        >
                            <Users
                                className="w-5 h-5"
                                style={{ color: "var(--color-ink)" }}
                            />
                        </div>
                        <span
                            className="text-sm"
                            style={{ color: "var(--color-ink-muted)" }}
                        >
                            Total Profile Views
                        </span>
                    </div>
                    <p
                        className={`${plusJakarta.className} text-3xl font-semibold tracking-[-0.03em]`}
                        style={{ color: "var(--color-ink)" }}
                    >
                        {data?.totalProfileViews || 0}
                    </p>
                </div>

                <div
                    className="p-5 rounded-2xl"
                    style={{ backgroundColor: "var(--color-surface-1)" }}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div
                            className="p-2 rounded-xl"
                            style={{ backgroundColor: "var(--color-surface-2)" }}
                        >
                            <TrendingUp
                                className="w-5 h-5"
                                style={{ color: "var(--color-ink)" }}
                            />
                        </div>
                        <span
                            className="text-sm"
                            style={{ color: "var(--color-ink-muted)" }}
                        >
                            Current Streak
                        </span>
                    </div>
                    <p
                        className={`${plusJakarta.className} text-3xl font-semibold tracking-[-0.03em]`}
                        style={{ color: "var(--color-ink)" }}
                    >
                        {data?.currentStreak || 0} days
                    </p>
                </div>

                <div
                    className="p-5 rounded-2xl"
                    style={{ backgroundColor: "var(--color-surface-1)" }}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div
                            className="p-2 rounded-xl"
                            style={{ backgroundColor: "var(--color-surface-2)" }}
                        >
                            <Star
                                className="w-5 h-5"
                                style={{ color: "var(--color-ink)" }}
                            />
                        </div>
                        <span
                            className="text-sm"
                            style={{ color: "var(--color-ink-muted)" }}
                        >
                            Top Project
                        </span>
                    </div>
                    <p
                        className={`${plusJakarta.className} text-lg font-semibold tracking-[-0.03em] truncate`}
                        style={{ color: "var(--color-ink)" }}
                    >
                        {topProject?.title || "-"}
                    </p>
                    {topProject && (
                        <p
                            className="text-xs mt-1"
                            style={{ color: "var(--color-ink-muted)" }}
                        >
                            {topProject.demoClicks + topProject.repoClicks} clicks
                        </p>
                    )}
                </div>

                <div
                    className="p-5 rounded-2xl"
                    style={{ backgroundColor: "var(--color-surface-1)" }}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div
                            className="p-2 rounded-xl"
                            style={{ backgroundColor: "var(--color-surface-2)" }}
                        >
                            <MessageSquare
                                className="w-5 h-5"
                                style={{ color: "var(--color-ink)" }}
                            />
                        </div>
                        <span
                            className="text-sm"
                            style={{ color: "var(--color-ink-muted)" }}
                        >
                            Guestbook Messages
                        </span>
                    </div>
                    <p
                        className={`${plusJakarta.className} text-3xl font-semibold tracking-[-0.03em]`}
                        style={{ color: "var(--color-ink)" }}
                    >
                        {data?.guestbookCount || 0}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Views Chart */}
                <div
                    className="p-6 rounded-2xl"
                    style={{ backgroundColor: "var(--color-surface-1)" }}
                >
                    <h2
                        className={`${plusJakarta.className} text-lg font-semibold tracking-[-0.03em] mb-4`}
                        style={{ color: "var(--color-ink)" }}
                    >
                        Profile Views Over Time
                    </h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={data?.viewsByDay || []}
                                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="rgba(255,255,255,0.05)"
                                />
                                <XAxis
                                    dataKey="date"
                                    stroke="rgba(255,255,255,0.3)"
                                    tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="rgba(255,255,255,0.3)"
                                    tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#8b5cf6"
                                    strokeWidth={2}
                                    dot={{ r: 4, fill: "#8b5cf6" }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Projects Bar Chart */}
                <div
                    className="p-6 rounded-2xl"
                    style={{ backgroundColor: "var(--color-surface-1)" }}
                >
                    <h2
                        className={`${plusJakarta.className} text-lg font-semibold tracking-[-0.03em] mb-4`}
                        style={{ color: "var(--color-ink)" }}
                    >
                        Top Projects by Clicks
                    </h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data?.topProjects || []}
                                layout="vertical"
                                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="rgba(255,255,255,0.05)"
                                    horizontal={false}
                                />
                                <XAxis
                                    type="number"
                                    stroke="rgba(255,255,255,0.3)"
                                    tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    dataKey="title"
                                    type="category"
                                    stroke="rgba(255,255,255,0.3)"
                                    tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                    width={100}
                                />
                                <Tooltip content={<CustomBarTooltip />} />
                                <Bar
                                    dataKey="demoClicks"
                                    stackId="a"
                                    fill="#8b5cf6"
                                    radius={[0, 4, 4, 0]}
                                />
                                <Bar
                                    dataKey="repoClicks"
                                    stackId="a"
                                    fill="#ec4899"
                                    radius={[0, 4, 4, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Views by Country Table */}
                <div
                    className="p-6 rounded-2xl"
                    style={{ backgroundColor: "var(--color-surface-1)" }}
                >
                    <h2
                        className={`${plusJakarta.className} text-lg font-semibold tracking-[-0.03em] mb-4`}
                        style={{ color: "var(--color-ink)" }}
                    >
                        Views by Country
                    </h2>
                    {data?.viewsByCountry?.length > 0 ? (
                        <div className="space-y-2">
                            {data.viewsByCountry.map((c, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 rounded-xl"
                                    style={{ backgroundColor: "var(--color-surface-2)" }}
                                >
                                    <span style={{ color: "var(--color-ink)" }}>
                                        {c.country}
                                    </span>
                                    <span style={{ color: "var(--color-ink-muted)" }}>
                                        {c.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p
                            className="text-sm"
                            style={{ color: "var(--color-ink-muted)" }}
                        >
                            No data yet
                        </p>
                    )}
                </div>

                {/* Streak Comparison */}
                <div
                    className="p-6 rounded-2xl"
                    style={{ backgroundColor: "var(--color-surface-1)" }}
                >
                    <h2
                        className={`${plusJakarta.className} text-lg font-semibold tracking-[-0.03em] mb-4`}
                        style={{ color: "var(--color-ink)" }}
                    >
                        Streak Stats
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div
                            className="p-4 rounded-xl text-center"
                            style={{ backgroundColor: "var(--color-surface-2)" }}
                        >
                            <p
                                className="text-xs mb-1"
                                style={{ color: "var(--color-ink-muted)" }}
                            >
                                Current
                            </p>
                            <p
                                className={`${plusJakarta.className} text-2xl font-semibold tracking-[-0.03em]`}
                                style={{ color: "var(--color-ink)" }}
                            >
                                {data?.currentStreak || 0}
                            </p>
                            <p
                                className="text-xs mt-1"
                                style={{ color: "var(--color-ink-muted)" }}
                            >
                                days
                            </p>
                        </div>
                        <div
                            className="p-4 rounded-xl text-center"
                            style={{ backgroundColor: "var(--color-surface-2)" }}
                        >
                            <p
                                className="text-xs mb-1"
                                style={{ color: "var(--color-ink-muted)" }}
                            >
                                Longest
                            </p>
                            <p
                                className={`${plusJakarta.className} text-2xl font-semibold tracking-[-0.03em]`}
                                style={{ color: "var(--color-ink)" }}
                            >
                                {data?.longestStreak || 0}
                            </p>
                            <p
                                className="text-xs mt-1"
                                style={{ color: "var(--color-ink-muted)" }}
                            >
                                days
                            </p>
                        </div>
                    </div>
                    <div
                        className="mt-4 p-4 rounded-xl"
                        style={{ backgroundColor: "var(--color-surface-2)" }}
                    >
                        <p
                            className="text-xs mb-1"
                            style={{ color: "var(--color-ink-muted)" }}
                        >
                            Total Logs
                        </p>
                        <p
                            className={`${plusJakarta.className} text-2xl font-semibold tracking-[-0.03em]`}
                            style={{ color: "var(--color-ink)" }}
                        >
                            {data?.totalLogs || 0}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
