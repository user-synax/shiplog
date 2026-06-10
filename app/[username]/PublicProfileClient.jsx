"use client";

import { useEffect, useState } from "react";
import { getDefaultAvatarUrl } from "@/lib/utils";
import ActivityHeatmap from "./ActivityHeatmap";
import ThemeProvider from "@/components/ThemeProvider";
import StackIcon from "tech-stack-icons";
import Link from "next/link";

// Curated Tech Icon Library
const TECH_ICONS = [
    // Languages
    {
        id: "javascript",
        name: "JavaScript",
        category: "language",
        color: "#F7DF1E",
        icon: "js",
    },
    {
        id: "typescript",
        name: "TypeScript",
        category: "language",
        color: "#3178C6",
        icon: "ts",
    },
    {
        id: "python",
        name: "Python",
        category: "language",
        color: "#3776AB",
        icon: "py",
    },
    {
        id: "rust",
        name: "Rust",
        category: "language",
        color: "#000000",
        icon: "rs",
    },
    {
        id: "go",
        name: "Go",
        category: "language",
        color: "#00ADD8",
        icon: "go",
    },
    {
        id: "java",
        name: "Java",
        category: "language",
        color: "#007396",
        icon: "java",
    },
    {
        id: "csharp",
        name: "C#",
        category: "language",
        color: "#512BD4",
        icon: "cs",
    },
    {
        id: "cpp",
        name: "C++",
        category: "language",
        color: "#00599C",
        icon: "cpp",
    },
    { id: "c", name: "C", category: "language", color: "#A8B9CC", icon: "c" },
    {
        id: "php",
        name: "PHP",
        category: "language",
        color: "#777BB4",
        icon: "php",
    },
    {
        id: "ruby",
        name: "Ruby",
        category: "language",
        color: "#CC342D",
        icon: "rb",
    },
    {
        id: "kotlin",
        name: "Kotlin",
        category: "language",
        color: "#7F52FF",
        icon: "kt",
    },
    {
        id: "swift",
        name: "Swift",
        category: "language",
        color: "#F05138",
        icon: "swift",
    },
    {
        id: "dart",
        name: "Dart",
        category: "language",
        color: "#0175C2",
        icon: "dart",
    },

    // Frameworks
    {
        id: "react",
        name: "React",
        category: "framework",
        color: "#61DAFB",
        icon: "react",
    },
    {
        id: "nextjs",
        name: "Next.js",
        category: "framework",
        color: "#000000",
        icon: "next",
    },
    {
        id: "vuejs",
        name: "Vue.js",
        category: "framework",
        color: "#4FC08D",
        icon: "vue",
    },
    {
        id: "angular",
        name: "Angular",
        category: "framework",
        color: "#DD0031",
        icon: "ng",
    },
    {
        id: "svelte",
        name: "Svelte",
        category: "framework",
        color: "#FF3E00",
        icon: "svelte",
    },
    {
        id: "express",
        name: "Express",
        category: "framework",
        color: "#000000",
        icon: "express",
    },
    {
        id: "django",
        name: "Django",
        category: "framework",
        color: "#092E20",
        icon: "django",
    },
    {
        id: "flask",
        name: "Flask",
        category: "framework",
        color: "#000000",
        icon: "flask",
    },
    {
        id: "spring",
        name: "Spring",
        category: "framework",
        color: "#6DB33F",
        icon: "spring",
    },
    {
        id: "tailwind",
        name: "Tailwind CSS",
        category: "framework",
        color: "#06B6D4",
        icon: "tw",
    },
    {
        id: "bootstrap",
        name: "Bootstrap",
        category: "framework",
        color: "#7952B3",
        icon: "bs",
    },

    // Databases
    {
        id: "postgresql",
        name: "PostgreSQL",
        category: "database",
        color: "#4169E1",
        icon: "pg",
    },
    {
        id: "mongodb",
        name: "MongoDB",
        category: "database",
        color: "#47A248",
        icon: "mongo",
    },
    {
        id: "mysql",
        name: "MySQL",
        category: "database",
        color: "#4479A1",
        icon: "mysql",
    },
    {
        id: "sqlite",
        name: "SQLite",
        category: "database",
        color: "#003B57",
        icon: "sqlite",
    },
    {
        id: "redis",
        name: "Redis",
        category: "database",
        color: "#DC382D",
        icon: "redis",
    },
    {
        id: "supabase",
        name: "Supabase",
        category: "database",
        color: "#3ECF8E",
        icon: "supabase",
    },
    {
        id: "firebase",
        name: "Firebase",
        category: "database",
        color: "#FFCA28",
        icon: "firebase",
    },

    // Tools
    { id: "git", name: "Git", category: "tool", color: "#F05032", icon: "git" },
    {
        id: "github",
        name: "GitHub",
        category: "tool",
        color: "#181717",
        icon: "gh",
    },
    {
        id: "docker",
        name: "Docker",
        category: "tool",
        color: "#2496ED",
        icon: "docker",
    },
    {
        id: "kubernetes",
        name: "Kubernetes",
        category: "tool",
        color: "#326CE5",
        icon: "k8s",
    },
    { id: "aws", name: "AWS", category: "tool", color: "#FF9900", icon: "aws" },
    {
        id: "figma",
        name: "Figma",
        category: "tool",
        color: "#F24E1E",
        icon: "figma",
    },
    {
        id: "vscode",
        name: "VS Code",
        category: "tool",
        color: "#007ACC",
        icon: "vscode",
    },
    {
        id: "linux",
        name: "Linux",
        category: "tool",
        color: "#FCC624",
        icon: "linux",
    },
    {
        id: "windows",
        name: "Windows",
        category: "tool",
        color: "#0078D4",
        icon: "win",
    },
    {
        id: "macos",
        name: "macOS",
        category: "tool",
        color: "#000000",
        icon: "mac",
    },
    {
        id: "nodejs",
        name: "Node.js",
        category: "tool",
        color: "#5FA04E",
        icon: "node",
    },
    { id: "npm", name: "npm", category: "tool", color: "#CB3837", icon: "npm" },
    {
        id: "yarn",
        name: "Yarn",
        category: "tool",
        color: "#2C8EBB",
        icon: "yarn",
    },
    {
        id: "pnpm",
        name: "pnpm",
        category: "tool",
        color: "#F69220",
        icon: "pnpm",
    },
];

// SVG icon components for each tech
const TechIcon = ({ id, size = 32 }) => {
    const icons = {
        js: (
            <svg
                viewBox="0 0 24 24"
                width={size}
                height={size}
                fill="currentColor"
            >
                <path d="M12.173 17.722c-.376.627-.789 1.114-1.601 1.114-.812 0-1.27-.41-1.27-1.053 0-.718.573-1.045 1.45-1.51l.366-.196c2.128-1.114 3.553-2.267 3.553-4.635 0-2.318-1.842-4.045-4.912-4.045-2.094 0-3.427.846-4.374 2.254l1.98 1.255c.441-.718.965-1.27 1.98-1.27.812 0 1.332.47 1.332 1.066 0 .683-.376 1.008-1.332 1.51l-.366.196c-2.365 1.24-3.692 2.443-3.692 4.66 0 2.618 2.052 4.213 5.013 4.213 2.268 0 3.603-.86 4.55-2.491l-2.139-1.341zM24 0H0v24h24V0z" />
            </svg>
        ),
        ts: (
            <svg
                viewBox="0 0 24 24"
                width={size}
                height={size}
                fill="currentColor"
            >
                <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.649-.304 5.527 5.527 0 0 0-.85-.11 9.762 9.762 0 0 0-.782.03v2.538a21.41 21.41 0 0 1.782.03 5.527 5.527 0 0 0.85-.11 3.95 3.95 0 0 0.649-.304v2.522a6.239 6.239 0 0 1-1.306.341c-.473.075-1.015.112-1.627.112V9.75zm-7.5 0c.539 0 1.03.036 1.474.11a5.899 5.899 0 0 1 1.199.341v2.458a4.2 4.2 0 0 0-.593-.304 5.07 5.07 0 0 0-.777-.11 8.701 8.701 0 0 0-.708.03v7.59h-2.55V12.274a8.44 8.44 0 0 0-.707-.03 5.07 5.07 0 0 0-.778.11 4.199 4.199 0 0 0-.592.304v-2.522a5.899 5.899 0 0 1 1.199-.341c.444-.074.935-.11 1.474-.11z" />
            </svg>
        ),
        py: (
            <svg
                viewBox="0 0 24 24"
                width={size}
                height={size}
                fill="currentColor"
            >
                <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.07.07-.07-.17.06-.07h.17h8.15l.69-.05.59-.14.5-.21.4-.27.3-.32.2-.35.1-.35.06-.2.02-.1V3.17h.83v.01l2.75.02.37.03-.05.37-.11.34-.17.31-.25.29-.31.25-.38.22-.44.18-.5.15-.57.13-.63.1-.7.07-.76.04-.83.01z" />
            </svg>
        ),
        react: (
            <svg
                viewBox="0 0 24 24"
                width={size}
                height={size}
                fill="currentColor"
            >
                <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89S13.03 13.89 12 13.89s-1.87-.84-1.87-1.89.84-1.89 1.87-1.89M6.37 20c1.73 0 3.31-1.36 4.5-3.24-.56-.57-1.1-1.21-1.6-1.89-.75 1.37-1.6 2.58-2.5 3.13A1.6 1.6 0 016.37 20m0-16a1.6 1.6 0 011.4 1c.9.56 1.75 1.77 2.5 3.14.5-.68 1.04-1.32 1.6-1.89C10.54 4.64 8.96 4 7.25 4h-.88m12 16a1.6 1.6 0 01-1.4-1c-.9-.56-1.75-1.77-2.5-3.14.5-.68 1.04-1.32 1.6-1.89C18.96 15.36 20.54 16 22.25 16h.88m0-12h-.88c-1.73 0-3.31 1.36-4.5 3.24.56.57 1.1 1.21 1.6 1.89.75-1.37 1.6-2.58 2.5-3.13A1.6 1.6 0 0123.5 4m-23.5 8c0-4.09 3.56-7.44 8-8 4.44.56 8 3.91 8 8-.56 4.44-3.56 8-8 8-4.44-.56-8-3.91-8-8m20.5 8c4.44-.56 8-3.91 8-8-.56-4.44-3.56-8-8-8-4.44.56-8 3.91-8 8 .56 4.44 3.56 8 8 8" />
            </svg>
        ),
        next: (
            <svg
                viewBox="0 0 24 24"
                width={size}
                height={size}
                fill="currentColor"
            >
                <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 01-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 00-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.918-2.592-2.404-3.558a338.739 338.739 0 00-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 01-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 01-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 01.174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 004.735 7.17l1.902 2.795.096-.063a12.317 12.317 0 002.466-2.163 11.944 11.944 0 002.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 00-2.499-.523A33.119 33.119 0 0011.572 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 01.237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 01.233-.296c.096-.05.13-.054.5-.054z" />
            </svg>
        ),
        vue: (
            <svg
                viewBox="0 0 24 24"
                width={size}
                height={size}
                fill="currentColor"
            >
                <path d="M24 1.61h-9.94L12 5.16 9.94 1.61H0l12 20.78L24 1.61zM12 14.08L5.16 2.23h4.43L12 6.41l2.41-4.18h4.43L12 14.08z" />
            </svg>
        ),
        node: (
            <svg
                viewBox="0 0 24 24"
                width={size}
                height={size}
                fill="currentColor"
            >
                <path d="M12 1.85c-.27 0-.55.07-.78.2l-7.44 4.3c-.48.28-.78.8-.78 1.36v8.58c0 .56.3 1.08.78 1.36l1.95 1.12.02-.01 5.5-3.18c.21-.12.46-.18.72-.18.26 0 .51.06.72.18l5.5 3.18.02.01 1.93-1.12c.48-.28.78-.8.78-1.36V7.71c0-.56-.3-1.08-.78-1.36l-7.44-4.3a1.66 1.66 0 00-.73-.2zm.05 1.83l6.67 3.85v7.94l-6.67-3.85V3.68zM5.28 7.53l6.67 3.85v7.94l-6.67-3.85V7.53z" />
            </svg>
        ),
        default: (
            <svg
                viewBox="0 0 24 24"
                width={size}
                height={size}
                fill="currentColor"
            >
                <circle cx="12" cy="12" r="10" />
            </svg>
        ),
    };
    // Fallback to default if icon not found
    const IconComponent = icons[id] || icons.default;
    return IconComponent;
};

const ACHIEVEMENTS = {
    first_log: { name: "First Log" },
    streak_7: { name: "7-Day Streak" },
    streak_30: { name: "30-Day Streak" },
    streak_100: { name: "100-Day Streak" },
    first_project: { name: "First Project" },
    profile_complete: { name: "Profile Complete" },
};

export default function PublicProfileClient({
    user,
    theme,
    pinnedProjects,
    activeProjects,
    logs,
    techStack,
    goals,
    learning,
    achievements,
    guestbook: initialGuestbook,
}) {
    const [guestbook, setGuestbook] = useState(initialGuestbook);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        async function trackView() {
            try {
                await fetch("/api/profile-view", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ profileUsername: user.username }),
                });
            } catch (error) {
                console.error(error);
            }
        }
        trackView();
    }, [user.username]);

    async function handleProjectClick(projectId, type) {
        try {
            await fetch("/api/project-click", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ projectId, type }),
            });
        } catch (error) {
            console.error(error);
        }
    }

    async function handleGuestbookSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch("/api/guestbook", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    profileUsername: user.username,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                setGuestbook([data.guestbook, ...guestbook]);
                setFormData({ name: "", email: "", message: "" });
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    }

    const availabilityColors = {
        open: "bg-green-500",
        internship: "bg-blue-500",
        freelance: "bg-yellow-500",
        fulltime: "bg-purple-500",
        collaboration: "bg-pink-500",
        not_available: "bg-gray-500",
    };

    const groupedTechStack = techStack.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {});

    const currentProject =
        pinnedProjects.find((p) => p.status !== "archived") ||
        activeProjects[0];

    return (
        <ThemeProvider theme={theme}>
            <div
                className="min-h-screen"
                style={{
                    background: theme.bgPattern
                        ? `${theme.bgPattern}, ${theme.bgGradient}`
                        : theme.bgGradient,
                    backgroundSize: theme.bgPatternSize
                        ? `${theme.bgPatternSize}, cover`
                        : "cover",
                    backgroundRepeat: "repeat",
                    transition: "all 0.3s ease",
                }}
            >
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <section className="text-center mb-12">
                        <div className="relative inline-block mb-6">
                            <div
                                className="w-32 h-32 rounded-full flex items-center justify-center text-5xl"
                                style={{
                                    background: theme.accentGradient,
                                    padding: "4px",
                                }}
                            >
                                <img
                                    src={
                                        user.avatarUrl ||
                                        user.image ||
                                        getDefaultAvatarUrl(user.username)
                                    }
                                    alt={user.name}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                        </div>
                        <h1
                            className="text-4xl font-bold mb-2"
                            style={{ color: theme.textColor }}
                        >
                            {user.name}
                        </h1>
                        <p
                            className="text-xl mb-4"
                            style={{ color: theme.mutedColor }}
                        >
                            @{user.username}
                        </p>
                        {user.tagline && (
                            <p
                                className="text-lg mb-4"
                                style={{ color: theme.textColor }}
                            >
                                {user.tagline}
                            </p>
                        )}
                        {user.availability && (
                            <div
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                                style={{
                                    backgroundColor: theme.cardColor,
                                    borderColor: theme.borderColor,
                                    borderStyle: "solid",
                                    borderWidth: 1,
                                }}
                            >
                                <span style={{ color: theme.textColor }}>
                                    Looking For{" "}
                                    {user.availability.replace("_", " ")}
                                </span>
                            </div>
                        )}
                        {user.bio && (
                            <p
                                className="text-lg max-w-2xl mx-auto mb-6"
                                style={{ color: theme.mutedColor }}
                            >
                                {user.bio}
                            </p>
                        )}
                        <div className="flex items-center justify-center gap-4 mb-6">
                            {user.socials?.github && (
                                <a
                                    href={user.socials.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-full flex items-center justify-center"
                                    style={{
                                        backgroundColor:
                                            "var(--color-surface-1)",
                                        color: theme.textColor,
                                    }}
                                    aria-label="GitHub"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                </a>
                            )}
                            {user.socials?.linkedin && (
                                <a
                                    href={user.socials.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-full flex items-center justify-center"
                                    style={{
                                        backgroundColor:
                                            "var(--color-surface-1)",
                                        color: theme.textColor,
                                    }}
                                    aria-label="LinkedIn"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                </a>
                            )}
                            {user.socials?.x && (
                                <a
                                    href={user.socials.x}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-full flex items-center justify-center"
                                    style={{
                                        backgroundColor:
                                            "var(--color-surface-1)",
                                        color: theme.textColor,
                                    }}
                                    aria-label="X"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </a>
                            )}
                            {user.socials?.instagram && (
                                <a
                                    href={user.socials.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-full flex items-center justify-center"
                                    style={{
                                        backgroundColor:
                                            "var(--color-surface-1)",
                                        color: theme.textColor,
                                    }}
                                    aria-label="Instagram"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                            )}
                            {user.socials?.website && (
                                <a
                                    href={user.socials.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-full flex items-center justify-center"
                                    style={{
                                        backgroundColor:
                                            "var(--color-surface-1)",
                                        color: theme.textColor,
                                    }}
                                    aria-label="Website"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                        />
                                    </svg>
                                </a>
                            )}
                        </div>
                        {user.resumeUrl && (
                            <a
                                href={user.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all"
                                style={{
                                    background: theme.buttonBg,
                                    color: theme.buttonText,
                                }}
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                Download Resume
                            </a>
                        )}
                    </section>

                    <section
                        className="rounded-2xl p-6 mb-8"
                        style={{
                            backgroundColor: theme.cardColor,
                            borderColor: theme.borderColor,
                            borderWidth: 1,
                            borderStyle: "solid",
                        }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <svg
                                    className="w-10 h-10"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    style={{
                                        color: theme.textColor,
                                    }}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                                    />
                                </svg>
                                <div>
                                    <p
                                        className="text-3xl font-bold"
                                        style={{ color: theme.textColor }}
                                    >
                                        {user.currentStreak || 0}
                                    </p>
                                    <p
                                        style={{
                                            color: theme.mutedColor,
                                        }}
                                    >
                                        day streak
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-center">
                                    <p
                                        className="text-2xl font-bold"
                                        style={{ color: theme.textColor }}
                                    >
                                        {new Date(user.createdAt).getFullYear()}
                                    </p>
                                    <p
                                        style={{
                                            color: theme.mutedColor,
                                        }}
                                    >
                                        building since
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p
                                        className="text-2xl font-bold"
                                        style={{ color: theme.textColor }}
                                    >
                                        {user.totalLogs || 0}
                                    </p>
                                    <p
                                        style={{
                                            color: theme.mutedColor,
                                        }}
                                    >
                                        total logs
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {currentProject && (
                        <section
                            className="rounded-2xl p-6 mb-8"
                            style={{
                                backgroundColor: theme.cardColor,
                                borderColor: theme.borderColor,
                                borderStyle: "solid",
                                borderWidth: 1,
                            }}
                        >
                            <h3
                                className="text-lg font-medium mb-4"
                                style={{ color: theme.textColor }}
                            >
                                Currently Building
                            </h3>
                            <div className="flex flex-col md:flex-row gap-6">
                                {currentProject.coverImage && (
                                    <img
                                        src={currentProject.coverImage}
                                        alt={currentProject.title}
                                        className="w-full md:w-64 h-40 object-cover rounded-xl"
                                    />
                                )}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4
                                            className="text-xl font-bold"
                                            style={{
                                                color: theme.textColor,
                                            }}
                                        >
                                            {currentProject.title}
                                        </h4>
                                        <span
                                            className="px-3 py-1 rounded-full text-xs font-medium"
                                            style={{
                                                backgroundColor:
                                                    "var(--color-surface-2)",
                                                color: theme.textColor,
                                            }}
                                        >
                                            {currentProject.status}
                                        </span>
                                    </div>
                                    {currentProject.description && (
                                        <p
                                            className="mb-4"
                                            style={{
                                                color: theme.mutedColor,
                                            }}
                                        >
                                            {currentProject.description}
                                        </p>
                                    )}
                                    {currentProject.techStack?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {currentProject.techStack.map(
                                                (tech, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-3 py-1 rounded-full text-xs"
                                                        style={{
                                                            backgroundColor:
                                                                "var(--color-surface-2)",
                                                            color: theme.mutedColor,
                                                        }}
                                                    >
                                                        {tech}
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    )}
                                    <div className="flex gap-3">
                                        {currentProject.demoUrl && (
                                            <a
                                                href={currentProject.demoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={() =>
                                                    handleProjectClick(
                                                        currentProject._id,
                                                        "demo",
                                                    )
                                                }
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
                                                style={{
                                                    background: theme.buttonBg,
                                                    color: theme.buttonText,
                                                }}
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                    />
                                                </svg>
                                                Demo
                                            </a>
                                        )}
                                        {currentProject.repoUrl && (
                                            <a
                                                href={currentProject.repoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={() =>
                                                    handleProjectClick(
                                                        currentProject._id,
                                                        "repo",
                                                    )
                                                }
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                                                style={{
                                                    backgroundColor:
                                                        "var(--color-surface-2)",
                                                    color: theme.textColor,
                                                }}
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                </svg>
                                                Repo
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {pinnedProjects.length > 0 && (
                        <section
                            className="rounded-2xl p-6 mb-8"
                            style={{
                                backgroundColor: theme.cardColor,
                                borderColor: theme.borderColor,
                                borderStyle: "solid",
                                borderWidth: 1,
                            }}
                        >
                            <h3
                                className="text-lg font-medium mb-4"
                                style={{ color: theme.textColor }}
                            >
                                Pinned Projects
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {pinnedProjects.map((project) => (
                                    <div
                                        key={project._id}
                                        className="rounded-xl p-4 border"
                                        style={{
                                            backgroundColor: theme.cardColor,
                                            borderColor: theme.borderColor,
                                            borderStyle: "solid",
                                            borderWidth: 1,
                                        }}
                                    >
                                        <h4
                                            className="font-bold mb-2"
                                            style={{
                                                color: theme.textColor,
                                            }}
                                        >
                                            {project.title}
                                        </h4>
                                        {project.description && (
                                            <p
                                                className="text-sm mb-3"
                                                style={{
                                                    color: theme.mutedColor,
                                                }}
                                            >
                                                {project.description}
                                            </p>
                                        )}
                                        <div className="flex gap-2">
                                            {project.demoUrl && (
                                                <Link
                                                    href={project.demoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm px-3 py-2 rounded-lg border-2"
                                                    style={{
                                                        borderColor:
                                                            theme.borderColor,
                                                    }}
                                                >
                                                    Demo
                                                </Link>
                                            )}
                                            {project.repoUrl && (
                                                <a
                                                    href={project.repoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm px-3 py-2 rounded-lg underline"
                                                >
                                                    Repo
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {Object.keys(groupedTechStack).length > 0 && (
                        <section
                            className="rounded-2xl p-6 mb-8"
                            style={{
                                backgroundColor: theme.cardColor,
                                borderColor: theme.borderColor,
                                borderStyle: "solid",
                                borderWidth: 1,
                            }}
                        >
                            <h3
                                className="text-lg font-medium mb-4"
                                style={{ color: theme.textColor }}
                            >
                                <span className="text-primary">Tech Stack</span>
                            </h3>
                            {Object.entries(groupedTechStack).map(
                                ([category, items]) => (
                                    <div
                                        key={category}
                                        className="mb-6 last:mb-0"
                                    >
                                        <h4
                                            className="text-sm font-medium mb-3"
                                            style={{
                                                color: theme.mutedColor,
                                            }}
                                        >
                                            {category}
                                        </h4>
                                        <div className="flex flex-wrap gap-3">
                                            {items.map((item) => {
                                                return (
                                                    <div
                                                        key={item._id}
                                                        className="flex items-center"
                                                    >
                                                        <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7">
                                                            <StackIcon
                                                                name={item.name}
                                                                dark
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ),
                            )}
                        </section>
                    )}

                    {goals.length > 0 && (
                        <section
                            className="rounded-2xl p-6 mb-8"
                            style={{
                                backgroundColor: theme.cardColor,
                                borderColor: theme.borderColor,
                                borderStyle: "solid",
                                borderWidth: 1,
                            }}
                        >
                            <h3
                                className="text-lg font-medium mb-4"
                                style={{ color: theme.textColor }}
                            >
                                Goals
                            </h3>
                            <div className="space-y-3">
                                {goals.map((goal) => (
                                    <div
                                        key={goal._id}
                                        className="flex items-center gap-3"
                                    >
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    "var(--color-surface-2)",
                                            }}
                                        />
                                        <span
                                            style={{
                                                color: theme.textColor,
                                            }}
                                        >
                                            {goal.title}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {learning.length > 0 && (
                        <section
                            className="rounded-2xl p-6 mb-8"
                            style={{
                                backgroundColor: theme.cardColor,
                                borderColor: theme.borderColor,
                                borderStyle: "solid",
                                borderWidth: 1,
                            }}
                        >
                            <h3
                                className="text-lg font-medium mb-4"
                                style={{ color: theme.textColor }}
                            >
                                Learning
                            </h3>
                            <div className="space-y-3">
                                {learning.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex items-center gap-3"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            style={{
                                                color: theme.mutedColor,
                                            }}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                            />
                                        </svg>
                                        <span
                                            style={{
                                                color: theme.textColor,
                                            }}
                                        >
                                            {item.title}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {logs.length > 0 && (
                        <section
                            className="rounded-2xl p-6 mb-8"
                            style={{
                                backgroundColor: theme.cardColor,
                                borderColor: theme.borderColor,
                                borderStyle: "solid",
                                borderWidth: 1,
                            }}
                        >
                            <h3
                                className="text-lg font-medium mb-4"
                                style={{ color: theme.textColor }}
                            >
                                Recent Build Logs
                            </h3>
                            <div className="space-y-4">
                                {logs.map((log) => (
                                    <div
                                        key={log._id}
                                        className="pb-4 border-b last:border-b-0 last:pb-0"
                                        style={{
                                            borderColor:
                                                "var(--color-hairline)",
                                        }}
                                    >
                                        <p
                                            className="font-medium"
                                            style={{
                                                color: theme.textColor,
                                            }}
                                        >
                                            {log.content}
                                        </p>
                                        <p
                                            className="text-xs mt-2"
                                            style={{
                                                color: theme.mutedColor,
                                            }}
                                        >
                                            {new Date(
                                                log.createdAt,
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section
                        className="rounded-2xl p-6 mb-8"
                        style={{
                            backgroundColor: theme.cardColor,
                            borderColor: theme.borderColor,
                            borderWidth: 1,
                            borderStyle: "solid",
                        }}
                    >
                        <h3
                            className="text-lg font-medium mb-4"
                            style={{ color: theme.textColor }}
                        >
                            Guestbook
                        </h3>
                        {success && (
                            <p
                                className="mb-4"
                                style={{ color: "var(--color-accent-red)" }}
                            >
                                Message sent!
                            </p>
                        )}
                        <form
                            onSubmit={handleGuestbookSubmit}
                            className="space-y-4 mb-8"
                        >
                            <div>
                                <label
                                    className="block text-sm font-medium mb-2"
                                    style={{ color: theme.textColor }}
                                >
                                    Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 rounded-lg"
                                    style={{
                                        backgroundColor:
                                            "var(--color-surface-2)",
                                        color: theme.textColor,
                                        borderColor: theme.borderColor,
                                        borderStyle: "solid",
                                        borderWidth: 1,
                                    }}
                                />
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-medium mb-2"
                                    style={{ color: theme.textColor }}
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 rounded-lg"
                                    style={{
                                        backgroundColor:
                                            "var(--color-surface-2)",
                                        color: theme.textColor,
                                        borderColor: theme.borderColor,
                                        borderStyle: "solid",
                                        borderWidth: 1,
                                    }}
                                />
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-medium mb-2"
                                    style={{ color: theme.textColor }}
                                >
                                    Message
                                </label>
                                <textarea
                                    required
                                    value={formData.message}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            message: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 rounded-lg"
                                    rows={4}
                                    style={{
                                        backgroundColor:
                                            "var(--color-surface-2)",
                                        color: theme.textColor,
                                        borderColor: theme.borderColor,
                                        borderStyle: "solid",
                                        borderWidth: 1,
                                    }}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium disabled:opacity-50"
                                style={{
                                    background: theme.buttonBg,
                                    color: theme.buttonText,
                                }}
                            >
                                {submitting ? "Sending..." : "Sign Guestbook"}
                            </button>
                        </form>

                        {guestbook.length > 0 && (
                            <div className="space-y-4">
                                {guestbook.map((entry) => (
                                    <div
                                        key={entry._id}
                                        className="pb-4 border-b last:border-b-0 last:pb-0"
                                        style={{
                                            borderColor:
                                                "var(--color-hairline)",
                                        }}
                                    >
                                        <p
                                            className="font-medium"
                                            style={{
                                                color: theme.textColor,
                                            }}
                                        >
                                            {entry.name}
                                        </p>
                                        <p
                                            className="text-sm mt-1"
                                            style={{
                                                color: theme.mutedColor,
                                            }}
                                        >
                                            {entry.message}
                                        </p>
                                        <p
                                            className="text-xs mt-2"
                                            style={{
                                                color: theme.mutedColor,
                                            }}
                                        >
                                            {new Date(
                                                entry.createdAt,
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </ThemeProvider>
    );
}
