"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toPng } from "html-to-image";
import {
    Download,
    Share2,
    Palette,
    Folder,
    Zap,
    Edit3,
    Sparkles,
} from "lucide-react";
import { getDefaultAvatarUrl } from "@/lib/utils";

// Pre-built themes
const THEMES = [
    {
        id: "classic",
        name: "Classic",
        accentColor: "#000000",
        bgColor: "#ffffff",
        textColor: "#000000",
        textMutedColor: "#666666",
    },
    {
        id: "warm",
        name: "Warm",
        accentColor: "#ff6b6b",
        bgColor: "#fff5f5",
        textColor: "#2d3436",
        textMutedColor: "#636e72",
    },
    {
        id: "cool",
        name: "Cool",
        accentColor: "#4dabf7",
        bgColor: "#f0f9ff",
        textColor: "#2d3436",
        textMutedColor: "#636e72",
    },
    {
        id: "dark",
        name: "Dark",
        accentColor: "#ffffff",
        bgColor: "#1a1a1a",
        textColor: "#ffffff",
        textMutedColor: "#a0a0a0",
    },
    {
        id: "gradient",
        name: "Gradient",
        accentColor: "#8b5cf6",
        bgColor: "#f5f3ff",
        textColor: "#2d3436",
        textMutedColor: "#636e72",
    },
    {
        id: "sunset",
        name: "Sunset",
        accentColor: "#fd79a8",
        bgColor: "#fff0f5",
        textColor: "#2d3436",
        textMutedColor: "#636e72",
    },
    {
        id: "ocean",
        name: "Ocean",
        accentColor: "#00b894",
        bgColor: "#e8f8f5",
        textColor: "#2d3436",
        textMutedColor: "#636e72",
    },
    {
        id: "royal",
        name: "Royal",
        accentColor: "#6c5ce7",
        bgColor: "#f0eef6",
        textColor: "#2d3436",
        textMutedColor: "#636e72",
    },
];

// Animation options
const ANIMATIONS = [
    { id: "pulse", name: "Pulse" },
    { id: "float", name: "Float" },
    { id: "glow", name: "Glow" },
    { id: "none", name: "None" },
];

export default function MiniCardPage() {
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const cardRef = useRef(null);

    // Customization state
    const [selectedTheme, setSelectedTheme] = useState("classic");
    const [showProjects, setShowProjects] = useState(true);
    const [showStreak, setShowStreak] = useState(true);
    const [customCta, setCustomCta] = useState("");
    const [selectedAnimation, setSelectedAnimation] = useState("float");

    // Derived theme
    const theme = THEMES.find((t) => t.id === selectedTheme) || THEMES[0];

    useEffect(() => {
        const fetchUserData = async () => {
            if (!session?.user?.email) return;

            try {
                const res = await fetch("/api/user/me");
                const data = await res.json();
                setUserData(data.user);
            } catch (err) {
                console.error("Failed to fetch user data:", err);
            } finally {
                setLoading(false);
            }
        };

        if (status === "authenticated") {
            fetchUserData();
        }
    }, [session, status]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p style={{ color: "var(--color-ink-muted)" }}>Loading...</p>
            </div>
        );
    }

    if (!userData?.isPro) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8">
                <div className="text-center max-w-md space-y-6">
                    <h1
                        className="text-4xl font-bold"
                        style={{ color: "var(--color-ink)" }}
                    >
                        Premium Mini Card
                    </h1>
                    <p
                        className="text-lg"
                        style={{ color: "var(--color-ink-muted)" }}
                    >
                        Unlock the ability to create beautiful, floating mini
                        profile cards to share on social media by upgrading to
                        Pro!
                    </p>
                    <Link
                        href="/dashboard/billing"
                        className="inline-block px-8 py-4 rounded-full font-bold text-lg transition-all hover:opacity-90"
                        style={{
                            backgroundColor: "var(--color-primary)",
                            color: "var(--color-canvas)",
                        }}
                    >
                        Upgrade to Pro
                    </Link>
                </div>
            </div>
        );
    }

    const profileUrl = `https://shiplog.usersynax.dev/${userData.username}`;
    const avatarUrl =
        userData.avatarUrl ||
        userData.image ||
        getDefaultAvatarUrl(userData.username);
    const ctaText = customCta || "Follow Me";
    const bio = userData.bio
        ? userData.bio.length > 100
            ? userData.bio.substring(0, 97) + "..."
            : userData.bio
        : "";

    const handleDownload = async () => {
        if (!cardRef.current) return;
        try {
            const dataUrl = await toPng(cardRef.current, {
                quality: 1.0,
                pixelRatio: 3,
            });
            const link = document.createElement("a");
            link.download = `shiplog-${userData.username}-mini-card.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error("Failed to download mini card:", error);
        }
    };

    const handleShare = async (platform) => {
        try {
            const shareText = `Check out my Shiplog profile! ${profileUrl}`;
            let shareUrl;

            switch (platform) {
                case "twitter":
                    shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
                    break;
                case "facebook":
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`;
                    break;
                case "whatsapp":
                    shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
                    break;
                default:
                    await navigator.clipboard.writeText(profileUrl);
                    alert("Profile URL copied to clipboard!");
                    return;
            }

            window.open(shareUrl, "_blank", "width=600,height=400");
        } catch (error) {
            console.error("Failed to share mini card:", error);
        }
    };

    const getAnimationClass = () => {
        switch (selectedAnimation) {
            case "pulse":
                return "animate-pulse";
            case "float":
                return "animate-float";
            case "glow":
                return "animate-glow";
            default:
                return "";
        }
    };

    return (
        <div className="min-h-screen p-8">
            <style jsx global>{`
                @keyframes float {
                    0%,
                    100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
                @keyframes glow {
                    0%,
                    100% {
                        box-shadow: 0 0 20px ${theme.accentColor}40;
                    }
                    50% {
                        box-shadow: 0 0 40px ${theme.accentColor}80;
                    }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                .animate-glow {
                    animation: glow 2s ease-in-out infinite;
                }
            `}</style>

            <div className="max-w-6xl mx-auto">
                <h1
                    className="text-3xl font-bold mb-8"
                    style={{ color: "var(--color-ink)" }}
                >
                    Premium Mini Card Builder
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Mini Card Preview */}
                    <div
                        className="rounded-2xl p-8"
                        style={{
                            backgroundColor: "var(--color-surface-1)",
                            borderColor: "var(--color-hairline)",
                            borderWidth: 1,
                            borderStyle: "solid",
                        }}
                    >
                        <h2
                            className="text-xl font-semibold mb-6"
                            style={{ color: "var(--color-ink)" }}
                        >
                            Preview
                        </h2>
                        <div className="flex justify-center">
                            <div
                                ref={cardRef}
                                className={`relative rounded-3xl p-8 w-full max-w-md ${getAnimationClass()}`}
                                style={{
                                    backgroundColor: theme.bgColor,
                                    aspectRatio: "1.91/1",
                                    boxShadow:
                                        "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                                }}
                            >
                                {/* Avatar with animated ring */}
                                <div className="relative inline-block">
                                    <div
                                        className="absolute -inset-1 rounded-full animate-spin"
                                        style={{
                                            background: `conic-gradient(from 0deg, ${theme.accentColor}, transparent, ${theme.accentColor})`,
                                        }}
                                    />
                                    <div
                                        className="relative w-20 h-20 rounded-full overflow-hidden border-4"
                                        style={{
                                            borderColor: theme.bgColor,
                                        }}
                                    >
                                        <img
                                            src={avatarUrl}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Name and Username */}
                                <div className="mt-4">
                                    <h3
                                        className="text-2xl font-bold"
                                        style={{ color: theme.textColor }}
                                    >
                                        {userData.name || userData.username}
                                    </h3>
                                    <p
                                        className="text-sm"
                                        style={{ color: theme.textMutedColor }}
                                    >
                                        @{userData.username}
                                    </p>
                                </div>

                                {/* Bio */}
                                {bio && (
                                    <p
                                        className="mt-3 text-sm leading-relaxed"
                                        style={{ color: theme.textColor }}
                                    >
                                        {bio}
                                    </p>
                                )}

                                {/* Metrics */}
                                <div className="mt-4 flex gap-6">
                                    {showProjects && (
                                        <div>
                                            <p
                                                className="text-2xl font-bold"
                                                style={{
                                                    color: theme.accentColor,
                                                }}
                                            >
                                                {userData.projectCount || 0}
                                            </p>
                                            <p
                                                className="text-xs"
                                                style={{
                                                    color: theme.textMutedColor,
                                                }}
                                            >
                                                Projects
                                            </p>
                                        </div>
                                    )}
                                    {showStreak && (
                                        <div>
                                            <p
                                                className="text-2xl font-bold"
                                                style={{
                                                    color: theme.accentColor,
                                                }}
                                            >
                                                {userData.currentStreak || 0}
                                            </p>
                                            <p
                                                className="text-xs"
                                                style={{
                                                    color: theme.textMutedColor,
                                                }}
                                            >
                                                Day Streak
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* CTA Button */}
                                <div className="mt-6">
                                    <a
                                        href={profileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block px-6 py-3 rounded-full font-semibold transition-all hover:opacity-90"
                                        style={{
                                            backgroundColor: theme.accentColor,
                                            color:
                                                theme.id === "dark"
                                                    ? "#000000"
                                                    : "#ffffff",
                                        }}
                                    >
                                        {ctaText}
                                    </a>
                                </div>

                                {/* Branding Watermark */}
                                <div
                                    className="absolute bottom-4 right-4 text-xs font-bold"
                                    style={{ color: theme.textMutedColor }}
                                >
                                    Shiplog
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="flex flex-wrap gap-4 justify-center">
                                <button
                                    onClick={handleDownload}
                                    className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all hover:opacity-90"
                                    style={{
                                        backgroundColor: "var(--color-primary)",
                                        color: "var(--color-canvas)",
                                    }}
                                >
                                    <Download className="w-5 h-5" />
                                    Download PNG
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-3 justify-center">
                                <button
                                    onClick={() => handleShare("twitter")}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all hover:opacity-90"
                                    style={{
                                        backgroundColor:
                                            "var(--color-surface-2)",
                                        color: "var(--color-ink)",
                                    }}
                                >
                                    <Share2 className="w-4 h-4" />
                                    Twitter/X
                                </button>
                                <button
                                    onClick={() => handleShare("facebook")}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all hover:opacity-90"
                                    style={{
                                        backgroundColor:
                                            "var(--color-surface-2)",
                                        color: "var(--color-ink)",
                                    }}
                                >
                                    <Share2 className="w-4 h-4" />
                                    Facebook
                                </button>
                                <button
                                    onClick={() => handleShare("whatsapp")}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all hover:opacity-90"
                                    style={{
                                        backgroundColor:
                                            "var(--color-surface-2)",
                                        color: "var(--color-ink)",
                                    }}
                                >
                                    <Share2 className="w-4 h-4" />
                                    WhatsApp
                                </button>
                                <button
                                    onClick={() => handleShare("copy")}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all hover:opacity-90"
                                    style={{
                                        backgroundColor:
                                            "var(--color-surface-2)",
                                        color: "var(--color-ink)",
                                    }}
                                >
                                    <Share2 className="w-4 h-4" />
                                    Copy Link
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Customization Controls */}
                    <div className="space-y-6">
                        {/* Themes */}
                        <div
                            className="rounded-2xl p-6"
                            style={{
                                backgroundColor: "var(--color-surface-1)",
                                borderColor: "var(--color-hairline)",
                                borderWidth: 1,
                                borderStyle: "solid",
                            }}
                        >
                            <h3
                                className="text-lg font-semibold mb-4 flex items-center gap-2"
                                style={{ color: "var(--color-ink)" }}
                            >
                                <Palette className="w-5 h-5" />
                                Themes
                            </h3>
                            <div className="flex gap-3 flex-wrap">
                                {THEMES.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setSelectedTheme(t.id)}
                                        className={`w-12 h-12 rounded-full border-2 transition-all ${
                                            selectedTheme === t.id
                                                ? "scale-110 ring-2 ring-offset-2"
                                                : "hover:scale-105"
                                        }`}
                                        style={{
                                            backgroundColor: t.bgColor,
                                            borderColor: t.accentColor,
                                            outlineColor:
                                                "var(--color-primary)",
                                        }}
                                        aria-label={t.name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Metrics Toggle */}
                        <div
                            className="rounded-2xl p-6"
                            style={{
                                backgroundColor: "var(--color-surface-1)",
                                borderColor: "var(--color-hairline)",
                                borderWidth: 1,
                                borderStyle: "solid",
                            }}
                        >
                            <h3
                                className="text-lg font-semibold mb-4"
                                style={{ color: "var(--color-ink)" }}
                            >
                                Show Metrics
                            </h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={showProjects}
                                        onChange={(e) => setShowProjects(e.target.checked)}
                                        className="w-4 h-4"
                                    />
                                    <span
                                        className="flex items-center gap-2"
                                        style={{ color: "var(--color-ink)" }}
                                    >
                                        <Folder className="w-4 h-4" />
                                        Total Projects
                                    </span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={showStreak}
                                        onChange={(e) => setShowStreak(e.target.checked)}
                                        className="w-4 h-4"
                                    />
                                    <span
                                        className="flex items-center gap-2"
                                        style={{ color: "var(--color-ink)" }}
                                    >
                                        <Zap className="w-4 h-4" />
                                        Current Streak
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Custom CTA */}
                        <div
                            className="rounded-2xl p-6"
                            style={{
                                backgroundColor: "var(--color-surface-1)",
                                borderColor: "var(--color-hairline)",
                                borderWidth: 1,
                                borderStyle: "solid",
                            }}
                        >
                            <h3
                                className="text-lg font-semibold mb-4 flex items-center gap-2"
                                style={{ color: "var(--color-ink)" }}
                            >
                                <Edit3 className="w-5 h-5" />
                                Custom CTA
                            </h3>
                            <input
                                type="text"
                                placeholder="Follow Me"
                                value={customCta}
                                onChange={(e) => setCustomCta(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border-2"
                                style={{
                                    backgroundColor: "var(--color-surface-2)",
                                    borderColor: "var(--color-hairline)",
                                    color: "var(--color-ink)",
                                }}
                            />
                        </div>

                        {/* Animation */}
                        <div
                            className="rounded-2xl p-6"
                            style={{
                                backgroundColor: "var(--color-surface-1)",
                                borderColor: "var(--color-hairline)",
                                borderWidth: 1,
                                borderStyle: "solid",
                            }}
                        >
                            <h3
                                className="text-lg font-semibold mb-4 flex items-center gap-2"
                                style={{ color: "var(--color-ink)" }}
                            >
                                <Sparkles className="w-5 h-5" />
                                Animation
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {ANIMATIONS.map((anim) => (
                                    <button
                                        key={anim.id}
                                        onClick={() =>
                                            setSelectedAnimation(anim.id)
                                        }
                                        className={`px-4 py-3 rounded-lg border-2 transition-all ${
                                            selectedAnimation === anim.id
                                                ? "border-primary"
                                                : "border-hairline"
                                        }`}
                                        style={{
                                            backgroundColor:
                                                selectedAnimation === anim.id
                                                    ? "var(--color-surface-2)"
                                                    : "transparent",
                                            borderColor:
                                                selectedAnimation === anim.id
                                                    ? "var(--color-primary)"
                                                    : "var(--color-hairline)",
                                            color: "var(--color-ink)",
                                        }}
                                    >
                                        {anim.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
