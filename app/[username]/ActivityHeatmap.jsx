"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

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

export default function ActivityHeatmap({ 
    username, 
    tooltipPosition = 'left',
    minCellSize = 10,
    maxCellSize = 20,
    theme = {}
}) {
    const [dateCounts, setDateCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [cellSize, setCellSize] = useState(16);
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
        const startDate = new Date('2026-01-01');
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
                if (firstWeek.length === 7) {
                    weeks.push(firstWeek);
                }
                firstWeek = [new Date(currentDate)];
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        if (firstWeek.length > 0) {
            while (firstWeek.length < 7) {
                firstWeek.push(null);
            }
            weeks.push(firstWeek);
        }

        return weeks;
    }

    const weeks = generateWeeks();

    const calculateCellSize = useCallback(() => {
        if (!containerRef.current || weeks.length === 0) return;

        const width = containerRef.current.clientWidth;
        const gap = 4;
        const totalGapWidth = (weeks.length - 1) * gap;
        const availableWidth = width - totalGapWidth - 32;
        const calculatedSize = Math.floor(availableWidth / weeks.length);
        const newSize = Math.min(Math.max(calculatedSize, minCellSize), maxCellSize);
        
        setCellSize(newSize);
    }, [weeks.length, minCellSize, maxCellSize]);

    useEffect(() => {
        calculateCellSize();

        const handleResize = debounce(() => {
            calculateCellSize();
        }, 150);

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [calculateCellSize]);

    function getLogCount(date) {
        const dateStr = date.toISOString().split("T")[0];
        return dateCounts[dateStr] || 0;
    }

    if (loading) return null;

    return (
        <TooltipProvider>
            <div className="p-4 w-full" ref={containerRef}>
                <h3
                    className="text-sm font-bold mb-3"
                    style={{ color: theme.textColor }}
                >
                    Activity
                </h3>
                <div className="flex gap-1 w-full justify-center">
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                            {week.map((date, dayIndex) => {
                                if (!date) {
                                    return (
                                        <div
                                            key={dayIndex}
                                            className="rounded-sm"
                                            style={{ 
                                                width: `${cellSize}px`,
                                                height: `${cellSize}px`,
                                                visibility: 'hidden' 
                                            }}
                                        />
                                    );
                                }
                                const count = getLogCount(date);
                                return (
                                    <Tooltip key={dayIndex}>
                                        <TooltipTrigger asChild>
                                            <div
                                                className="rounded-sm"
                                                style={{
                                                    width: `${cellSize}px`,
                                                    height: `${cellSize}px`,
                                                    backgroundColor: count > 0
                                                        ? theme.borderColor || "#ccc"
                                                        : theme.cardColor || "#333"
                                                }}
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent 
                                            side={tooltipPosition}
                                            sideOffset={4}
                                        >
                                            {date.toLocaleDateString()} - {count === 0 ? "No logs" : `${count} log${count > 1 ? 's' : ''}`}
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </TooltipProvider>
    );
}
