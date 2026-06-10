"use client";

import { useState, useRef, useEffect } from "react";

export default function SettingsForm({ initialUser }) {
    const [isProfilePublic, setIsProfilePublic] = useState(
        initialUser.isProfilePublic || true,
    );
    const [avatarUrl, setAvatarUrl] = useState(
        initialUser.avatarUrl || initialUser.image || "",
    );
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const debounceTimerRef = useRef();

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
        <div className="max-w-2xl mx-auto space-y-8">
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
                        color: toast.type === "success" ? "#4ade80" : "#f87171",
                    }}
                >
                    {toast.message}
                </div>
            )}

            <div className="space-y-8">
                {/* Avatar Upload */}
                <div
                    className="p-6 rounded-2xl"
                    style={{ backgroundColor: "var(--color-surface-1)" }}
                >
                    <h2
                        className="font-bold mb-4"
                        style={{ color: "var(--color-ink)" }}
                    >
                        Avatar
                    </h2>
                    <div className="flex items-center gap-6">
                        <div
                            className="w-24 h-24 rounded-full overflow-hidden"
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
                                    className="w-full h-full flex items-center justify-center text-2xl"
                                    style={{ color: "var(--color-ink-muted)" }}
                                >
                                    {initialUser.name?.charAt(0).toUpperCase() || "U"}
                                </div>
                            )}
                        </div>
                        <div>
                            <label
                                className="inline-block px-4 py-2 rounded-full cursor-pointer transition-all"
                                style={{
                                    backgroundColor: "var(--color-surface-2)",
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
                        className="font-bold mb-4"
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
                            className="w-4 h-4"
                        />
                        <span style={{ color: "var(--color-ink)" }}>
                            Make profile public
                        </span>
                    </label>
                </div>
            </div>
        </div>
    );
}
