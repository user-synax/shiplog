"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
} from "@/components/ui/tooltip";

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const MONTH_LABELS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function getCellColor(count, theme) {
    if (count === 0) return theme?.surfaceColor || "var(--color-surface-2)";
    if (count === 1) return theme?.heatmapColor1 || "rgba(244, 63, 94, 0.25)";
    if (count === 2) return theme?.heatmapColor2 || "rgba(244, 63, 94, 0.50)";
    if (count === 3) return theme?.heatmapColor3 || "rgba(244, 63, 94, 0.75)";
    return theme?.heatmapColor4 || theme?.accentColor || "var(--color-gradient-coral)";
}

function getCellBorder(count, theme) {
    return count === 0 ? `1px solid ${theme?.borderColor || "var(--color-hairline-soft)"}` : "none";
}

export default function ActivityHeatmap({
    username,
    tooltipPosition = "top",
    minCellSize = 10,
    maxCellSize = 18,
    theme = {},
}) {
    const [dateCounts, setDateCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [cellSize, setCellSize] = useState(14);
    const [gap, setGap] = useState(3);
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(
                    `/api/public/heatmap?username=${username}`,
                );
                const data = await res.json();
                setDateCounts(data.dateCounts || {});
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [username]);

    function generateWeeks() {
        const weeks = [];
        const startDate = new Date("2025-06-01");
        const today = new Date();

        const startDayOfWeek = startDate.getDay();

        let firstWeek = [];
        for (let i = 0; i < startDayOfWeek; i++) {
            firstWeek.push(null);
        }

        let currentDate = new Date(startDate);
        while (currentDate <= today) {
            if (firstWeek.length < 7) {
                firstWeek.push(new Date(currentDate));
            } else {
                if (firstWeek.length === 7) weeks.push(firstWeek);
                firstWeek = [new Date(currentDate)];
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        if (firstWeek.length > 0) {
            while (firstWeek.length < 7) firstWeek.push(null);
            weeks.push(firstWeek);
        }

        return weeks;
    }

    const weeks = generateWeeks();

    const calculateCellSize = useCallback(() => {
        if (!containerRef.current || weeks.length === 0) return;
        const containerWidth = containerRef.current.clientWidth;
        const mobile = containerWidth < 480;
        setIsMobile(mobile);

        // On mobile we fix the cell size and let the grid scroll instead
        if (mobile) {
            setCellSize(13);
            setGap(3);
            return;
        }

        const reserved = 24 + 32;
        const g = 3;
        const totalGap = (weeks.length - 1) * g;
        const available = containerWidth - reserved - totalGap;
        const calculated = Math.floor(available / weeks.length);
        const newSize = Math.min(
            Math.max(calculated, minCellSize),
            maxCellSize,
        );
        setCellSize(newSize);
        setGap(g);
    }, [weeks.length, minCellSize, maxCellSize]);

    useEffect(() => {
        calculateCellSize();
        const handleResize = debounce(calculateCellSize, 150);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [calculateCellSize]);

    function getLogCount(date) {
        const dateStr = date.toISOString().split("T")[0];
        return dateCounts[dateStr] || 0;
    }

    function getMonthLabels() {
        const labels = [];
        let lastMonth = -1;
        weeks.forEach((week, weekIndex) => {
            const firstReal = week.find((d) => d !== null);
            if (!firstReal) return;
            const month = firstReal.getMonth();
            if (month !== lastMonth) {
                labels.push({ weekIndex, label: MONTH_LABELS[month] });
                lastMonth = month;
            }
        });
        return labels;
    }

    const monthLabels = getMonthLabels();
    const totalWidth = weeks.length * (cellSize + gap) - gap;

    if (loading) {
        return (
            <div
                className="p-4 md:p-5 w-full rounded-2xl"
                ref={containerRef}
                style={{
                    backgroundColor: theme.cardColor || "var(--color-surface-1)",
                    borderColor: theme.borderColor || "var(--color-hairline)",
                    borderWidth: 1,
                    borderStyle: "solid",
                }}
            >
                <div
                    className="h-4 w-24 rounded mb-4 animate-pulse"
                    style={{ backgroundColor: theme?.surfaceColor || "var(--color-surface-2)" }}
                />
                <div
                    className="h-20 w-full rounded-lg animate-pulse"
                    style={{ backgroundColor: theme?.surfaceColor || "var(--color-surface-2)" }}
                />
            </div>
        );
    }

    const cellGrid = (
        <div className="flex gap-2" style={{ width: "max-content" }}>
            {/* Day-of-week labels */}
            <div
                className="flex flex-col flex-shrink-0 justify-around"
                style={{
                    gap: `${gap}px`,
                    paddingTop: 18,
                    width: 16,
                }}
            >
                {DAY_LABELS.map((label, i) => (
                    <div
                        key={i}
                        style={{
                            height: cellSize,
                            fontSize: 9,
                            lineHeight: `${cellSize}px`,
                            color: theme?.mutedColor || "var(--color-ink-muted)",
                            visibility:
                                i === 1 || i === 3 || i === 5
                                    ? "visible"
                                    : "hidden",
                        }}
                    >
                        {label}
                    </div>
                ))}
            </div>

            {/* Month labels + cell columns */}
            <div className="flex flex-col">
                {/* Month labels row */}
                <div
                    className="relative mb-1"
                    style={{ height: 16, width: totalWidth }}
                >
                    {monthLabels.map(({ weekIndex, label }) => (
                        <span
                            key={label + weekIndex}
                            className="absolute text-xs"
                            style={{
                                left: weekIndex * (cellSize + gap),
                                color: theme?.mutedColor || "var(--color-ink-muted)",
                                fontSize: 10,
                                lineHeight: "16px",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {label}
                        </span>
                    ))}
                </div>

                {/* Cell grid */}
                <div className="flex" style={{ gap: `${gap}px` }}>
                    {weeks.map((week, weekIndex) => (
                        <div
                            key={weekIndex}
                            className="flex flex-col flex-shrink-0"
                            style={{ gap: `${gap}px` }}
                        >
                            {week.map((date, dayIndex) => {
                                if (!date) {
                                    return (
                                        <div
                                            key={dayIndex}
                                            className="rounded-sm"
                                            style={{
                                                width: cellSize,
                                                height: cellSize,
                                                visibility: "hidden",
                                                flexShrink: 0,
                                            }}
                                        />
                                    );
                                }

                                const count = getLogCount(date);
                                const isToday =
                                    date.toDateString() ===
                                    new Date().toDateString();

                                return (
                                    <Tooltip key={dayIndex}>
                                        <TooltipTrigger asChild>
                                            <div
                                                className="rounded-sm flex-shrink-0 transition-opacity duration-150 hover:opacity-75"
                                                style={{
                                                    width: cellSize,
                                                    height: cellSize,
                                                    backgroundColor:
                                                        getCellColor(count, theme),
                                                    border: isToday
                                                        ? `1px solid ${theme?.accentColor || "var(--color-gradient-coral)"}`
                                                        : getCellBorder(count, theme),
                                                    cursor: "default",
                                                }}
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent
                                            side={tooltipPosition}
                                            sideOffset={4}
                                        >
                                            <span style={{ fontWeight: 500 }}>
                                                {date.toLocaleDateString(
                                                    "en-US",
                                                    {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    },
                                                )}
                                            </span>
                                            {" — "}
                                            {count === 0
                                                ? "No logs"
                                                : `${count} log${count > 1 ? "s" : ""}`}
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <TooltipProvider>
            <div
                className="p-4 md:p-5 w-full rounded-2xl"
                ref={containerRef}
                style={{
                    backgroundColor: theme.cardColor || "var(--color-surface-1)",
                    borderColor: theme.borderColor || "var(--color-hairline)",
                    borderWidth: 1,
                    borderStyle: "solid",
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3
                        className="text-sm font-bold tracking-tight"
                        style={{ color: theme.textColor || "var(--color-ink)" }}
                    >
                        Activity
                    </h3>

                    {/* Legend */}
                    <div className="flex items-center gap-1.5">
                        <span
                            className="text-xs"
                            style={{ color: theme.mutedColor || "var(--color-ink-muted)" }}
                        >
                            Less
                        </span>
                        {[0, 1, 2, 3, 4].map((level) => (
                            <div
                                key={level}
                                className="rounded-sm flex-shrink-0"
                                style={{
                                    width: 10,
                                    height: 10,
                                    backgroundColor: getCellColor(level, theme),
                                    border: getCellBorder(level, theme),
                                }}
                            />
                        ))}
                        <span
                            className="text-xs"
                            style={{ color: theme.mutedColor || "var(--color-ink-muted)" }}
                        >
                            More
                        </span>
                    </div>
                </div>

                {/* Scrollable on mobile, normal on desktop */}
                {isMobile ? (
                    <div
                        style={{
                            overflowX: "auto",
                            overflowY: "hidden",
                            WebkitOverflowScrolling: "touch",
                            // Fade out left edge to hint at scrollability
                            maskImage:
                                "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
                            WebkitMaskImage:
                                "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
                            paddingBottom: 4,
                        }}
                    >
                        {cellGrid}
                    </div>
                ) : (
                    <div className="flex overflow-hidden">{cellGrid}</div>
                )}
            </div>
        </TooltipProvider>
    );
}
