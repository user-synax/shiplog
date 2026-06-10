"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { THEMES } from "@/lib/themes";

export default function BuilderForm({ initialUser }) {
    const router = useRouter();
    const [username, setUsername] = useState(initialUser.username || "");
    const [name, setName] = useState(initialUser.name || "");
    const [tagline, setTagline] = useState(initialUser.tagline || "");
    const [bio, setBio] = useState(initialUser.bio || "");
    const [availability, setAvailability] = useState(
        initialUser.availability || "not_available",
    );
    const [resumeUrl, setResumeUrl] = useState(initialUser.resumeUrl || "");
    const [socials, setSocials] = useState(
        initialUser.socials || { github: "", linkedin: "", x: "", instagram: "", website: "" },
    );
    const [theme, setTheme] = useState(initialUser.theme || "default");
    const [usernameStatus, setUsernameStatus] = useState("idle");
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const debounceTimerRef = useRef();

    const saveSettings = async () => {
        if (usernameStatus === "checking" || usernameStatus === "taken" || usernameStatus === "invalid") {
            return;
        }
        setIsSaving(true);
        try {
            const res = await fetch("/api/user/update", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    name,
                    tagline,
                    bio,
                    availability,
                    socials,
                    theme,
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
    }, [username, name, tagline, bio, availability, socials, theme]);

    const checkUsername = async (newUsername) => {
        if (newUsername === initialUser.username) {
            setUsernameStatus("available");
            return;
        }
        if (!newUsername) {
            setUsernameStatus("idle");
            return;
        }
        const regex = /^[a-z0-9_]{3,20}$/;
        if (!regex.test(newUsername)) {
            setUsernameStatus("invalid");
            return;
        }
        setUsernameStatus("checking");
        try {
            const res = await fetch(
                `/api/username/check?q=${encodeURIComponent(newUsername)}`,
            );
            const data = await res.json();
            setUsernameStatus(data.available ? "available" : "taken");
        } catch (err) {
            setUsernameStatus("error");
        }
    };

    const handleUsernameChange = (e) => {
        const newUsername = e.target.value.toLowerCase();
        setUsername(newUsername);
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = setTimeout(
            () => checkUsername(newUsername),
            500,
        );
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch("/api/user/resume", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                setResumeUrl(data.resumeUrl);
                setToast({ type: "success", message: "Resume uploaded!" });
                setTimeout(() => setToast(null), 3000);
            }
        } catch (err) {
            console.error(err);
            setToast({ type: "error", message: "Failed to upload resume" });
            setTimeout(() => setToast(null), 3000);
        }
    };

    return (
        <div className="max-w-2xl mt-14 mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <h1
                    className="text-2xl font-bold"
                    style={{
                        fontFamily: "var(--font-plus-jakarta-sans)",
                        color: "var(--color-ink)",
                    }}
                >
                    Profile Builder
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
                {/* Personal Info */}
                <div
                    className="p-6 rounded-2xl"
                    style={{ backgroundColor: "var(--color-surface-1)" }}
                >
                    <h2
                        className="font-bold mb-4"
                        style={{ color: "var(--color-ink)" }}
                    >
                        Personal Info
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label
                                className="block mb-2 text-sm"
                                style={{ color: "var(--color-ink-muted)" }}
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-transparent border focus:outline-none"
                                style={{
                                    borderColor: "var(--color-hairline)",
                                    color: "var(--color-ink)",
                                }}
                            />
                        </div>
                        <div>
                            <label
                                className="block mb-2 text-sm"
                                style={{ color: "var(--color-ink-muted)" }}
                            >
                                Username
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={username}
                                    onChange={handleUsernameChange}
                                    className="w-full px-4 py-3 rounded-lg bg-transparent border focus:outline-none"
                                    style={{
                                        borderColor:
                                            usernameStatus === "available"
                                                ? "#4ade80"
                                                : usernameStatus === "taken" ||
                                                  usernameStatus === "invalid"
                                                  ? "#f87171"
                                                  : "var(--color-hairline)",
                                        color: "var(--color-ink)",
                                    }}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    {usernameStatus === "checking" && (
                                        <span
                                            style={{
                                                color: "var(--color-ink-muted)",
                                            }}
                                        >
                                            ...
                                        </span>
                                    )}
                                    {usernameStatus === "available" && (
                                        <span className="text-green-500">
                                            ✓
                                        </span>
                                    )}
                                    {(usernameStatus === "taken" ||
                                        usernameStatus === "invalid") && (
                                        <span className="text-red-500">✗</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label
                                className="block mb-2 text-sm"
                                style={{ color: "var(--color-ink-muted)" }}
                            >
                                Tagline
                            </label>
                            <input
                                type="text"
                                value={tagline}
                                onChange={(e) => setTagline(e.target.value)}
                                maxLength={80}
                                className="w-full px-4 py-3 rounded-lg bg-transparent border focus:outline-none"
                                style={{
                                    borderColor: "var(--color-hairline)",
                                    color: "var(--color-ink)",
                                }}
                            />
                        </div>
                        <div>
                            <label
                                className="block mb-2 text-sm"
                                style={{ color: "var(--color-ink-muted)" }}
                            >
                                Bio ({bio.length}/200)
                            </label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                maxLength={200}
                                rows={3}
                                className="w-full px-4 py-3 rounded-lg bg-transparent border focus:outline-none resize-none"
                                style={{
                                    borderColor: "var(--color-hairline)",
                                    color: "var(--color-ink)",
                                }}
                            />
                        </div>
                        <div>
                            <label
                                className="block mb-2 text-sm"
                                style={{ color: "var(--color-ink-muted)" }}
                            >
                                Availability
                            </label>
                            <select
                                value={availability}
                                onChange={(e) =>
                                    setAvailability(e.target.value)
                                }
                                className="w-full px-4 py-3 rounded-lg bg-transparent border focus:outline-none"
                                style={{
                                    borderColor: "var(--color-hairline)",
                                    color: "var(--color-ink)",
                                }}
                            >
                                <option value="open">Open to work</option>
                                <option value="internship">
                                    Looking for internship
                                </option>
                                <option value="freelance">
                                    Freelance available
                                </option>
                                <option value="fulltime">
                                    Looking for full-time
                                </option>
                                <option value="collaboration">
                                    Open to collaboration
                                </option>
                                <option value="not_available">
                                    Not available
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Resume Upload */}
                <div
                    className="p-6 rounded-2xl"
                    style={{ backgroundColor: "var(--color-surface-1)" }}
                >
                    <h2
                        className="font-bold mb-4"
                        style={{ color: "var(--color-ink)" }}
                    >
                        Resume
                    </h2>
                    <div>
                        {resumeUrl && (
                            <a
                                href={resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block mb-3 text-sm underline"
                                style={{ color: "var(--color-accent-blue)" }}
                            >
                                View current resume
                            </a>
                        )}
                        <label
                            className="inline-block px-4 py-2 rounded-full cursor-pointer transition-all"
                            style={{
                                backgroundColor: "var(--color-surface-2)",
                                color: "var(--color-ink)",
                            }}
                        >
                            Upload PDF Resume
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleResumeUpload}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                {/* Social Links */}
                <div
                    className="p-6 rounded-2xl"
                    style={{ backgroundColor: "var(--color-surface-1)" }}
                >
                    <h2
                        className="font-bold mb-4"
                        style={{ color: "var(--color-ink)" }}
                    >
                        Social Links
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label
                                className="block mb-2 text-sm"
                                style={{ color: "var(--color-ink-muted)" }}
                            >
                                GitHub
                            </label>
                            <input
                                type="text"
                                value={socials.github || ""}
                                onChange={(e) =>
                                    setSocials({
                                        ...socials,
                                        github: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-3 rounded-lg bg-transparent border focus:outline-none"
                                style={{
                                    borderColor: "var(--color-hairline)",
                                    color: "var(--color-ink)",
                                }}
                            />
                        </div>
                        <div>
                            <label
                                className="block mb-2 text-sm"
                                style={{ color: "var(--color-ink-muted)" }}
                            >
                                LinkedIn
                            </label>
                            <input
                                type="text"
                                value={socials.linkedin || ""}
                                onChange={(e) =>
                                    setSocials({
                                        ...socials,
                                        linkedin: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-3 rounded-lg bg-transparent border focus:outline-none"
                                style={{
                                    borderColor: "var(--color-hairline)",
                                    color: "var(--color-ink)",
                                }}
                            />
                        </div>
                        <div>
                            <label
                                className="block mb-2 text-sm"
                                style={{ color: "var(--color-ink-muted)" }}
                            >
                                X (Twitter)
                            </label>
                            <input
                                type="text"
                                value={socials.x || ""}
                                onChange={(e) =>
                                    setSocials({
                                        ...socials,
                                        x: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-3 rounded-lg bg-transparent border focus:outline-none"
                                style={{
                                    borderColor: "var(--color-hairline)",
                                    color: "var(--color-ink)",
                                }}
                            />
                        </div>
                        <div>
                            <label
                                className="block mb-2 text-sm"
                                style={{ color: "var(--color-ink-muted)" }}
                            >
                                Instagram
                            </label>
                            <input
                                type="text"
                                value={socials.instagram || ""}
                                onChange={(e) =>
                                    setSocials({
                                        ...socials,
                                        instagram: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-3 rounded-lg bg-transparent border focus:outline-none"
                                style={{
                                    borderColor: "var(--color-hairline)",
                                    color: "var(--color-ink)",
                                }}
                            />
                        </div>
                        <div>
                            <label
                                className="block mb-2 text-sm"
                                style={{ color: "var(--color-ink-muted)" }}
                            >
                                Website
                            </label>
                            <input
                                type="text"
                                value={socials.website || ""}
                                onChange={(e) =>
                                    setSocials({
                                        ...socials,
                                        website: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-3 rounded-lg bg-transparent border focus:outline-none"
                                style={{
                                    borderColor: "var(--color-hairline)",
                                    color: "var(--color-ink)",
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Theme Selector */}
                <div
                    className="p-6 rounded-2xl"
                    style={{ backgroundColor: "var(--color-surface-1)" }}
                >
                    <h2
                        className="font-bold mb-4"
                        style={{ color: "var(--color-ink)" }}
                    >
                        Theme
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {THEMES.map((t) => {
                            const isSelected = theme === t.id;
                            const isLocked = t.isPro && !initialUser.isPro;
                            return (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => {
                                        if (isLocked) {
                                            router.push("/dashboard/billing");
                                        } else {
                                            setTheme(t.id);
                                        }
                                    }}
                                    className={`p-4 rounded-xl text-left transition-all relative ${isSelected ? 'ring-2' : ''} ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    style={{
                                        background: t.bgGradient,
                                        borderColor: t.borderColor,
                                        borderWidth: 1,
                                        ringColor: t.accentGradient,
                                    }}
                                >
                                    {isLocked && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Lock className="w-6 h-6" style={{ color: t.textColor }} />
                                        </div>
                                    )}
                                    <div className={`${isLocked ? 'opacity-0' : ''}`}>
                                        <div 
                                            className="font-bold text-sm mb-1"
                                            style={{ color: t.textColor }}
                                        >
                                            {t.name}
                                        </div>
                                        <div 
                                            className="text-xs"
                                            style={{ color: t.mutedColor }}
                                        >
                                            {t.isPro ? 'Pro' : 'Free'}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
