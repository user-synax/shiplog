"use client";

import { useState, useRef, useEffect } from "react";
import { signIn } from "next-auth/react";

export default function SettingsForm({ initialUser }) {
    const [isProfilePublic, setIsProfilePublic] = useState(
        initialUser.isProfilePublic || true,
    );
    const [avatarUrl, setAvatarUrl] = useState(
        initialUser.avatarUrl || initialUser.image || "",
    );
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [githubStatus, setGithubStatus] = useState({
        connected: false,
        username: null,
        avatarUrl: null,
        lastSync: null,
    });
    const [isLoadingGithub, setIsLoadingGithub] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const debounceTimerRef = useRef();
    const canvasRef = useRef(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        fetchGithubStatus();
    }, []);

    // Confetti effect
    useEffect(() => {
        if (!showConfetti || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const colors = [
            "#ff0000",
            "#00ff00",
            "#0000ff",
            "#ffff00",
            "#ff00ff",
            "#00ffff",
        ];
        const confettiPieces = [];

        for (let i = 0; i < 150; i++) {
            confettiPieces.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                size: Math.random() * 10 + 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: Math.random() * 3 + 1,
                wobble: Math.random() * 10 - 5,
                wobbleSpeed: Math.random() * 0.1,
            });
        }

        let frames = 0;
        const maxFrames = 200;

        const animate = () => {
            if (frames > maxFrames) {
                setShowConfetti(false);
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            confettiPieces.forEach((piece, index) => {
                piece.y += piece.speed;
                piece.wobble += piece.wobbleSpeed;
                piece.x += Math.sin(piece.wobble) * 2;

                ctx.save();
                ctx.translate(piece.x, piece.y);
                ctx.rotate(Math.sin(piece.wobble) * 0.5);
                ctx.fillStyle = piece.color;
                ctx.fillRect(
                    -piece.size / 2,
                    -piece.size / 2,
                    piece.size,
                    piece.size,
                );
                ctx.restore();
            });

            frames++;
            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [showConfetti]);

    const fetchGithubStatus = async () => {
        try {
            const res = await fetch("/api/github/status");
            const data = await res.json();
            setGithubStatus(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleGithubDisconnect = async () => {
        if (
            !confirm("Are you sure you want to disconnect your GitHub account?")
        )
            return;

        setIsLoadingGithub(true);
        try {
            const res = await fetch("/api/github/disconnect", {
                method: "POST",
            });
            const data = await res.json();
            if (data.success) {
                setGithubStatus({
                    connected: false,
                    username: null,
                    avatarUrl: null,
                    lastSync: null,
                });
                setToast({ type: "success", message: "GitHub disconnected!" });
                setTimeout(() => setToast(null), 3000);
            }
        } catch (err) {
            console.error(err);
            setToast({ type: "error", message: "Failed to disconnect GitHub" });
            setTimeout(() => setToast(null), 3000);
        } finally {
            setIsLoadingGithub(false);
        }
    };

    const handleSyncCommits = async () => {
        setIsSyncing(true);
        try {
            const res = await fetch("/api/github/sync", { method: "POST" });
            const data = await res.json();
            if (data.success) {
                setShowConfetti(true);
                setToast({
                    type: "success",
                    message: `Synced ${data.newCommits} new commits! Created ${data.newLogs} new logs.`,
                });
                // Refresh GitHub status
                await fetchGithubStatus();
                setTimeout(() => setToast(null), 5000);
            } else {
                setToast({
                    type: "error",
                    message: data.error || "Failed to sync commits",
                });
                setTimeout(() => setToast(null), 3000);
            }
        } catch (err) {
            console.error(err);
            setToast({ type: "error", message: "Failed to sync commits" });
            setTimeout(() => setToast(null), 3000);
        } finally {
            setIsSyncing(false);
        }
    };

    const saveSettings = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/user/update", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    isProfilePublic,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setToast({ type: "success", message: "Settings saved!" });
                setTimeout(() => setToast(null), 3000);
            }
        } catch (err) {
            console.error(err);
            setToast({ type: "error", message: "Failed to save settings" });
            setTimeout(() => setToast(null), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    const debouncedSave = () => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
            saveSettings();
        }, 500);
    };

    useEffect(() => {
        debouncedSave();
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [isProfilePublic]);

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch("/api/user/avatar", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                setAvatarUrl(data.avatarUrl);
                setToast({ type: "success", message: "Avatar uploaded!" });
                setTimeout(() => setToast(null), 3000);
            }
        } catch (err) {
            console.error(err);
            setToast({ type: "error", message: "Failed to upload avatar" });
            setTimeout(() => setToast(null), 3000);
        }
    };

    return (
        <>
            {showConfetti && (
                <canvas
                    ref={canvasRef}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                        zIndex: 9999,
                    }}
                />
            )}
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 mt-14">
                <div className="flex items-center justify-between">
                    <h1
                        className="text-2xl font-bold"
                        style={{
                            fontFamily: "var(--font-plus-jakarta-sans)",
                            color: "var(--color-ink)",
                        }}
                    >
                        Settings
                    </h1>
                    {isSaving && (
                        <span style={{ color: "var(--color-ink-muted)" }}>
                            Saving...
                        </span>
                    )}
                </div>

                {toast && (
                    <div
                        className="p-4 rounded-lg"
                        style={{
                            backgroundColor:
                                toast.type === "success"
                                    ? "rgba(74,222,128,0.1)"
                                    : "rgba(248,113,113,0.1)",
                            border: "1px solid",
                            borderColor:
                                toast.type === "success"
                                    ? "rgba(74,222,128,0.3)"
                                    : "rgba(248,113,113,0.3)",
                            color:
                                toast.type === "success"
                                    ? "#4ade80"
                                    : "#f87171",
                        }}
                    >
                        {toast.message}
                    </div>
                )}

                <div className="space-y-8">
                    {/* GitHub Integration */}
                    <div
                        className="p-6 rounded-2xl"
                        style={{ backgroundColor: "var(--color-surface-1)" }}
                    >
                        <h2
                            className="font-bold mb-4 text-lg"
                            style={{ color: "var(--color-ink)" }}
                        >
                            GitHub Integration
                        </h2>
                        {githubStatus.connected ? (
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        {githubStatus.avatarUrl && (
                                            <img
                                                src={githubStatus.avatarUrl}
                                                alt=""
                                                className="w-10 h-10 rounded-full flex-shrink-0"
                                            />
                                        )}
                                        <div>
                                            <p
                                                style={{
                                                    color: "var(--color-ink)",
                                                }}
                                            >
                                                Connected as @
                                                {githubStatus.username}
                                            </p>
                                            {githubStatus.lastSync && (
                                                <p
                                                    className="text-sm"
                                                    style={{
                                                        color: "var(--color-ink-muted)",
                                                    }}
                                                >
                                                    Last synced:{" "}
                                                    {new Date(
                                                        githubStatus.lastSync,
                                                    ).toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <button
                                            onClick={handleSyncCommits}
                                            disabled={isSyncing}
                                            className="px-4 py-2 rounded-full transition-all w-full sm:w-auto"
                                            style={{
                                                backgroundColor:
                                                    "var(--color-primary)",
                                                color: "var(--color-canvas)",
                                            }}
                                        >
                                            {isSyncing
                                                ? "Syncing..."
                                                : "Sync Commits"}
                                        </button>
                                        <button
                                            onClick={handleGithubDisconnect}
                                            disabled={isLoadingGithub}
                                            className="px-4 py-2 rounded-full transition-all w-full sm:w-auto"
                                            style={{
                                                backgroundColor:
                                                    "rgba(248,113,113,0.1)",
                                                color: "#f87171",
                                                border: "1px solid rgba(248,113,113,0.3)",
                                            }}
                                        >
                                            {isLoadingGithub
                                                ? "Disconnecting..."
                                                : "Disconnect"}
                                        </button>
                                    </div>
                                </div>
                                <p
                                    className="text-sm"
                                    style={{
                                        color: "var(--color-ink-muted)",
                                    }}
                                >
                                    Sync Commits to import your recent GitHub
                                    commits. We automatically create build logs
                                    for them.
                                </p>
                            </div>
                        ) : (
                            <div>
                                <p
                                    className="mb-4"
                                    style={{ color: "var(--color-ink-muted)" }}
                                >
                                    Connect your GitHub account to automatically
                                    log your commits.
                                </p>
                                <button
                                    onClick={() =>
                                        signIn("github", {
                                            callbackUrl: "/dashboard/settings",
                                        })
                                    }
                                    className="px-4 py-2 rounded-full transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                                    style={{
                                        backgroundColor: "#333",
                                        color: "#fff",
                                    }}
                                >
                                    <svg
                                        className="w-5 h-5 flex-shrink-0"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                    Connect GitHub
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Avatar Upload */}
                    <div
                        className="p-6 rounded-2xl"
                        style={{ backgroundColor: "var(--color-surface-1)" }}
                    >
                        <h2
                            className="font-bold mb-4 text-lg"
                            style={{ color: "var(--color-ink)" }}
                        >
                            Avatar
                        </h2>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            <div
                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden flex-shrink-0"
                                style={{
                                    backgroundColor: "var(--color-surface-2)",
                                }}
                            >
                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div
                                        className="w-full h-full flex items-center justify-center text-2xl sm:text-3xl"
                                        style={{
                                            color: "var(--color-ink-muted)",
                                        }}
                                    >
                                        {initialUser.name
                                            ?.charAt(0)
                                            .toUpperCase() || "U"}
                                    </div>
                                )}
                            </div>
                            <div className="w-full sm:w-auto">
                                <label
                                    className="inline-block px-4 py-2 rounded-full cursor-pointer transition-all text-center w-full sm:w-auto"
                                    style={{
                                        backgroundColor:
                                            "var(--color-surface-2)",
                                        color: "var(--color-ink)",
                                    }}
                                >
                                    Upload Avatar
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Profile Visibility */}
                    <div
                        className="p-6 rounded-2xl"
                        style={{ backgroundColor: "var(--color-surface-1)" }}
                    >
                        <h2
                            className="font-bold mb-4 text-lg"
                            style={{ color: "var(--color-ink)" }}
                        >
                            Profile Visibility
                        </h2>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isProfilePublic}
                                onChange={(e) =>
                                    setIsProfilePublic(e.target.checked)
                                }
                                className="w-5 h-5 flex-shrink-0"
                            />
                            <span style={{ color: "var(--color-ink)" }}>
                                Make profile public
                            </span>
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
}
