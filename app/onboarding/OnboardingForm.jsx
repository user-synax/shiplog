"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

const moodOptions = [
    { value: "productive", emoji: "🚀", label: "Productive" },
    { value: "stuck", emoji: "😵", label: "Stuck" },
    { value: "learning", emoji: "📚", label: "Learning" },
    { value: "shipping", emoji: "🎉", label: "Shipping" },
    { value: "grinding", emoji: "💪", label: "Grinding" },
];

export default function OnboardingForm() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        username: "",
        tagline: "",
        availability: "not_available",
        avatarUrl: "",
        logContent: "",
        logMood: "productive",
    });
    const [usernameStatus, setUsernameStatus] = useState("idle");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const debounceTimerRef = useRef();

    const checkUsername = useCallback(async (username) => {
        if (!username) {
            setUsernameStatus("idle");
            return;
        }
        const regex = /^[a-z0-9_]{3,20}$/;
        if (!regex.test(username)) {
            setUsernameStatus("invalid");
            return;
        }
        setUsernameStatus("checking");
        try {
            const res = await fetch(
                `/api/username/check?q=${encodeURIComponent(username)}`,
            );
            const data = await res.json();
            if (data.available) {
                setUsernameStatus("available");
            } else {
                setUsernameStatus("taken");
            }
        } catch (err) {
            setUsernameStatus("error");
        }
    }, []);

    const handleUsernameChange = (e) => {
        const value = e.target.value.toLowerCase();
        setFormData({ ...formData, username: value });
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
            checkUsername(value);
        }, 500);
    };

    const handleNext = () => {
        if (step === 1 && usernameStatus !== "available") return;
        setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/user/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                router.push("/dashboard");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{ backgroundColor: "var(--color-canvas)" }}
        >
            <div
                className="w-full max-w-md rounded-2xl p-8"
                style={{ backgroundColor: "var(--color-surface-1)" }}
            >
                <h1
                    className="text-3xl font-bold text-center mb-8"
                    style={{
                        fontFamily: "var(--font-plus-jakarta-sans)",
                        color: "var(--color-ink)",
                    }}
                >
                    Start your Shiplog
                </h1>

                {/* Step Indicators */}
                <div className="flex justify-center gap-3 mb-8">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`w-3 h-3 rounded-full ${s < step ? "bg-green-500" : s === step ? "bg-white" : "bg-gray-600"}`}
                        />
                    ))}
                </div>

                {/* Step 1: Username */}
                {step === 1 && (
                    <div className="space-y-6">
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
                                    value={formData.username}
                                    onChange={handleUsernameChange}
                                    placeholder="yourusername"
                                    className="w-full px-4 py-3 rounded-lg bg-transparent border focus:outline-none focus:ring-2"
                                    style={{
                                        borderColor:
                                            usernameStatus === "available"
                                                ? "#4ade80"
                                                : usernameStatus === "taken" ||
                                                    usernameStatus === "invalid"
                                                  ? "#ef4444"
                                                  : "var(--color-hairline)",
                                        color: "var(--color-ink)",
                                    }}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    {usernameStatus === "checking" && (
                                        <span className="text-gray-400">
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
                            <p
                                className="text-xs mt-2"
                                style={{ color: "var(--color-ink-muted)" }}
                            >
                                3–20 chars, lowercase,
                                letters/numbers/underscores
                            </p>
                        </div>
                        <button
                            onClick={handleNext}
                            disabled={usernameStatus !== "available"}
                            className="w-full py-3 rounded-full font-medium transition-opacity bg-[#ff4d4f] text-white hover:cursor-pointer"
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* Step 2: Identity */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div>
                            <label
                                className="block mb-2 text-sm"
                                style={{ color: "var(--color-ink-muted)" }}
                            >
                                Tagline (optional)
                            </label>
                            <input
                                type="text"
                                value={formData.tagline}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        tagline: e.target.value,
                                    })
                                }
                                placeholder="Building cool things"
                                maxLength={80}
                                className="w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border focus:outline-none focus:ring-2"
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
                                value={formData.availability}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        availability: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border focus:outline-none focus:ring-2"
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

                        <div>
                            <label
                                className="block mb-2 text-sm"
                                style={{ color: "var(--color-ink-muted)" }}
                            >
                                Avatar URL (optional)
                            </label>
                            <input
                                type="text"
                                value={formData.avatarUrl}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        avatarUrl: e.target.value,
                                    })
                                }
                                placeholder="https://example.com/avatar.jpg"
                                className="w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border focus:outline-none focus:ring-2"
                                style={{
                                    borderColor: "var(--color-hairline)",
                                    color: "var(--color-ink)",
                                }}
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleBack}
                                className="flex-1 py-3 rounded-full font-medium"
                                style={{
                                    backgroundColor: "var(--color-surface-2)",
                                    color: "var(--color-ink)",
                                }}
                            >
                                Back
                            </button>
                            <button
                                onClick={handleNext}
                                className="flex-1 py-3 rounded-full font-medium"
                                style={{
                                    background:
                                        "#ff4d4f",
                                    color: "white",
                                }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: First Build Log */}
                {step === 3 && (
                    <div className="space-y-6">
                        <div>
                            <label
                                className="block mb-2 text-sm"
                                style={{ color: "var(--color-ink-muted)" }}
                            >
                                What are you building right now? (optional)
                            </label>
                            <textarea
                                value={formData.logContent}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        logContent: e.target.value,
                                    })
                                }
                                placeholder="I'm building a cool new app..."
                                maxLength={500}
                                rows={4}
                                className="w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border focus:outline-none focus:ring-2 resize-none"
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
                                Mood
                            </label>
                            <div className="flex gap-2">
                                {moodOptions.map((mood) => (
                                    <button
                                        key={mood.value}
                                        onClick={() =>
                                            setFormData({
                                                ...formData,
                                                logMood: mood.value,
                                            })
                                        }
                                        className={`flex-1 py-3 rounded-lg border-2 text-center ${formData.logMood === mood.value ? "border-white" : "border-transparent"}`}
                                        style={{
                                            backgroundColor:
                                                "var(--color-surface-2)",
                                            color: "var(--color-ink)",
                                        }}
                                    >
                                        {mood.emoji}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleBack}
                                className="flex-1 py-3 rounded-full font-medium"
                                style={{
                                    backgroundColor: "var(--color-surface-2)",
                                    color: "var(--color-ink)",
                                }}
                            >
                                Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex-1 py-3 rounded-full font-medium"
                                style={{
                                    background:
                                        "#ff4d4f",
                                    color: "white",
                                    opacity: isSubmitting ? 0.5 : 1,
                                }}
                            >
                                {isSubmitting
                                    ? "Finishing..."
                                    : "Finish"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
