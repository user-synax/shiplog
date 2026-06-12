"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { toPng, toSvg } from "html-to-image";
import {
    Download,
    Share2,
    Palette,
    Layers,
    Image as ImageIcon,
} from "lucide-react";
import { getDefaultAvatarUrl } from "@/lib/utils";

// Pre-built themes
const THEMES = [
    {
        id: "classic",
        name: "Classic",
        fgColor: "#000000",
        bgColor: "#ffffff",
    },
    {
        id: "warm",
        name: "Warm",
        fgColor: "#ff6b6b",
        bgColor: "#fff5f5",
    },
    {
        id: "cool",
        name: "Cool",
        fgColor: "#4dabf7",
        bgColor: "#f0f9ff",
    },
    {
        id: "dark",
        name: "Dark",
        fgColor: "#ffffff",
        bgColor: "#1a1a1a",
    },
    {
        id: "gradient",
        name: "Gradient",
        fgColor: "#8b5cf6",
        bgColor: "#f5f3ff",
    },
];

// QR styles (UI only - qrcode.react doesn't support custom shapes)
const QR_STYLES = [{ id: "squares", name: "Squares" }];

export default function QRCodePage() {
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const qrRef = useRef(null);

    // QR code customizations
    const [selectedTheme, setSelectedTheme] = useState("classic");
    const [fgColor, setFgColor] = useState("#000000");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [qrStyle, setQrStyle] = useState("squares");
    const [includeLogo, setIncludeLogo] = useState(true);
    const [logoSize, setLogoSize] = useState(0.2);
    const [qrSize, setQrSize] = useState(300);

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

    useEffect(() => {
        // Apply selected theme
        const theme = THEMES.find((t) => t.id === selectedTheme);
        if (theme) {
            setFgColor(theme.fgColor);
            setBgColor(theme.bgColor);
        }
    }, [selectedTheme]);

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
                        Premium QR Code Builder
                    </h1>
                    <p
                        className="text-lg"
                        style={{ color: "var(--color-ink-muted)" }}
                    >
                        Unlock the ability to create beautiful, custom QR codes
                        for your profile by upgrading to Pro!
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
    const logoUrl =
        userData.avatarUrl ||
        userData.image ||
        getDefaultAvatarUrl(userData.username);
    const logoPixelSize = qrSize * logoSize;

    const handleDownload = async (format) => {
        if (!qrRef.current) return;
        try {
            let dataUrl;
            if (format === "png") {
                dataUrl = await toPng(qrRef.current, {
                    quality: 1.0,
                    pixelRatio: 3,
                });
            } else {
                dataUrl = await toSvg(qrRef.current);
            }
            const link = document.createElement("a");
            link.download = `shiplog-${userData.username}-qr-code.${format}`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error("Failed to download QR code:", error);
        }
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(profileUrl);
            alert("Profile URL copied to clipboard!");
        } catch (error) {
            console.error("Failed to share QR code:", error);
        }
    };

    const getQRProps = () => {
        return {
            value: profileUrl,
            size: qrSize,
            level: "H",
            fgColor: fgColor,
            bgColor: bgColor,
            includeMargin: true,
        };
    };

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                <h1
                    className="text-3xl font-bold mb-8"
                    style={{ color: "var(--color-ink)" }}
                >
                    Premium QR Code Builder
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* QR Code Preview */}
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
                                ref={qrRef}
                                className="relative p-6 rounded-2xl inline-block"
                                style={{ backgroundColor: bgColor }}
                            >
                                <QRCodeSVG {...getQRProps()} />
                                {includeLogo && (
                                    <div
                                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden"
                                        style={{
                                            width: logoPixelSize,
                                            height: logoPixelSize,
                                            border: `2px solid ${bgColor}`,
                                        }}
                                    >
                                        <img
                                            src={logoUrl}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-4 justify-center">
                            <button
                                onClick={() => handleDownload("png")}
                                className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all hover:opacity-90"
                                style={{
                                    backgroundColor: "var(--color-primary)",
                                    color: "var(--color-canvas)",
                                }}
                            >
                                <Download className="w-5 h-5" />
                                Download PNG
                            </button>
                            <button
                                onClick={() => handleDownload("svg")}
                                className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all hover:opacity-90"
                                style={{
                                    backgroundColor: "var(--color-surface-2)",
                                    color: "var(--color-ink)",
                                }}
                            >
                                <Download className="w-5 h-5" />
                                Download SVG
                            </button>
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all hover:opacity-90"
                                style={{
                                    backgroundColor: "var(--color-surface-2)",
                                    color: "var(--color-ink)",
                                }}
                            >
                                <Share2 className="w-5 h-5" />
                                Share Link
                            </button>
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
                                {THEMES.map((theme) => (
                                    <button
                                        key={theme.id}
                                        onClick={() =>
                                            setSelectedTheme(theme.id)
                                        }
                                        className={`w-12 h-12 rounded-full border-2 transition-all ${
                                            selectedTheme === theme.id
                                                ? "scale-110 ring-2 ring-offset-2"
                                                : "hover:scale-105"
                                        }`}
                                        style={{
                                            backgroundColor: theme.bgColor,
                                            borderColor: theme.fgColor,
                                            outlineColor:
                                                "var(--color-primary)",
                                        }}
                                        aria-label={theme.name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Custom Colors */}
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
                                Custom Colors
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        style={{
                                            color: "var(--color-ink-muted)",
                                        }}
                                    >
                                        Foreground
                                    </label>
                                    <input
                                        type="color"
                                        value={fgColor}
                                        onChange={(e) => {
                                            setFgColor(e.target.value);
                                            setSelectedTheme("custom");
                                        }}
                                        className="w-full h-12 rounded-lg border-2"
                                        style={{
                                            borderColor:
                                                "var(--color-hairline)",
                                        }}
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        style={{
                                            color: "var(--color-ink-muted)",
                                        }}
                                    >
                                        Background
                                    </label>
                                    <input
                                        type="color"
                                        value={bgColor}
                                        onChange={(e) => {
                                            setBgColor(e.target.value);
                                            setSelectedTheme("custom");
                                        }}
                                        className="w-full h-12 rounded-lg border-2"
                                        style={{
                                            borderColor:
                                                "var(--color-hairline)",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Logo Settings */}
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
                                <ImageIcon className="w-5 h-5" />
                                Logo
                            </h3>
                            <div className="flex items-center gap-2 mb-4">
                                <input
                                    type="checkbox"
                                    id="includeLogo"
                                    checked={includeLogo}
                                    onChange={(e) =>
                                        setIncludeLogo(e.target.checked)
                                    }
                                />
                                <label
                                    htmlFor="includeLogo"
                                    style={{ color: "var(--color-ink)" }}
                                >
                                    Include Avatar
                                </label>
                            </div>
                            {includeLogo && (
                                <div>
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        style={{
                                            color: "var(--color-ink-muted)",
                                        }}
                                    >
                                        Logo Size
                                    </label>
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="0.35"
                                        step="0.01"
                                        value={logoSize}
                                        onChange={(e) =>
                                            setLogoSize(
                                                parseFloat(e.target.value),
                                            )
                                        }
                                        className="w-full"
                                    />
                                </div>
                            )}
                        </div>

                        {/* QR Size */}
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
                                QR Size
                            </h3>
                            <div>
                                <input
                                    type="range"
                                    min="200"
                                    max="500"
                                    step="10"
                                    value={qrSize}
                                    onChange={(e) =>
                                        setQrSize(parseInt(e.target.value))
                                    }
                                    className="w-full"
                                />
                                <p
                                    className="text-sm mt-2"
                                    style={{ color: "var(--color-ink-muted)" }}
                                >
                                    {qrSize}px
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
