"use client";

import { useState } from "react";
import { PLANS } from "@/lib/constants.js";
import { useRouter } from "next/navigation";

export default function PricingCard() {
    const router = useRouter();
    const [selectedPlan, setSelectedPlan] = useState("monthly");
    const [promoCode, setPromoCode] = useState("");
    const [promoResult, setPromoResult] = useState(null);
    const [loadingPromo, setLoadingPromo] = useState(false);
    const [applying, setApplying] = useState(false);

    const validatePromoCode = async () => {
        if (!promoCode.trim()) return;
        setLoadingPromo(true);
        try {
            const res = await fetch(
                `/api/promo/validate?code=${promoCode.trim()}&plan=${selectedPlan}`,
            );
            const data = await res.json();
            setPromoResult(data);
        } catch (e) {
            setPromoResult({
                valid: false,
                error: "Failed to validate promo code",
            });
        } finally {
            setLoadingPromo(false);
        }
    };

    const applyAndActivate = async () => {
        if (!promoResult?.valid) return;
        setApplying(true);
        try {
            const res = await fetch("/api/billing/apply-promo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code: promoCode.trim(),
                    plan: selectedPlan,
                }),
            });
            if (res.ok) {
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || "Something went wrong");
            }
        } catch (e) {
            alert("Failed to activate subscription");
        } finally {
            setApplying(false);
        }
    };

    const getFinalPrice = () => {
        const planData = PLANS[selectedPlan];
        if (promoResult?.valid) {
            return promoResult.finalAmount;
        }
        return planData.price;
    };

    const planData = PLANS[selectedPlan];
    const finalPrice = getFinalPrice();

    return (
        <div
            className="p-8 rounded-[30px] relative overflow-hidden"
            style={{
                background:
                    "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.1))",
                border: "1px solid rgba(139, 92, 246, 0.3)",
            }}
        >
            <div
                className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-30"
                style={{
                    background:
                        "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
                }}
            />
            <div className="space-y-6 relative z-10">
                <div>
                    <h2
                        className="text-3xl font-bold mb-2"
                        style={{
                            color: "var(--color-ink)",
                            fontFamily: "var(--font-plus-jakarta-sans)",
                        }}
                    >
                        Upgrade to Pro
                    </h2>
                    <p style={{ color: "var(--color-ink-muted)" }}>
                        Unlock all features and take your shiplog to the next
                        level
                    </p>
                </div>

                {/* Plan Selector (Pricing Tabs style from DESIGN.md) */}
                <div className="inline-flex gap-2 p-1 rounded-full"
                    style={{ backgroundColor: "var(--color-surface-1)" }}>
                    {Object.entries(PLANS).map(([key, plan]) => (
                        <button
                            key={key}
                            onClick={() => {
                                setSelectedPlan(key);
                                setPromoResult(null);
                            }}
                            className="px-4 py-2 rounded-full transition-all"
                            style={{
                                backgroundColor:
                                    selectedPlan === key
                                        ? "var(--color-surface-2)"
                                        : "transparent",
                                color:
                                    selectedPlan === key
                                        ? "var(--color-ink)"
                                        : "var(--color-ink-muted)",
                            }}
                        >
                            {plan.name}
                        </button>
                    ))}
                </div>

                <ul className="space-y-3">
                    {[
                        "Unlimited projects",
                        "All themes",
                        "Full analytics",
                        "Remove branding",
                        "Custom domain (coming soon)",
                    ].map((feature, idx) => (
                        <li
                            key={idx}
                            className="flex items-center gap-3"
                            style={{ color: "var(--color-ink)" }}
                        >
                            <span style={{ color: "#22c55e" }}>✓</span>
                            {feature}
                        </li>
                    ))}
                </ul>

                <div className="space-y-3">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            placeholder="Enter promo code"
                            className="flex-1 px-4 py-3 rounded-[10px] bg-transparent border"
                            style={{
                                borderColor: "var(--color-hairline)",
                                color: "var(--color-ink)",
                                backgroundColor: "var(--color-surface-1)",
                            }}
                        />
                        <button
                            onClick={validatePromoCode}
                            disabled={loadingPromo}
                            className="px-5 py-3 rounded-full font-medium"
                            style={{
                                backgroundColor: "var(--color-surface-2)",
                                color: "var(--color-ink)",
                            }}
                        >
                            {loadingPromo ? "..." : "Validate"}
                        </button>
                    </div>
                    {promoResult && (
                        <div
                            className="text-sm"
                            style={{
                                color: promoResult.valid
                                    ? "#22c55e"
                                    : "#ef4444",
                            }}
                        >
                            {promoResult.valid
                                ? `${promoResult.discountType === "percent" ? `${promoResult.discountValue}% off` : `${planData.currency}${promoResult.discountValue} off`} → ${planData.currency}${finalPrice}`
                                : promoResult.error}
                        </div>
                    )}
                </div>

                <div className="text-center">
                    <div
                        className="text-4xl font-bold mb-4"
                        style={{
                            color: "var(--color-ink)",
                            fontFamily: "var(--font-plus-jakarta-sans)",
                        }}
                    >
                        {planData.currency}
                        {finalPrice}
                        <span
                            className="text-lg font-normal"
                            style={{ color: "var(--color-ink-muted)" }}
                        >
                            /{selectedPlan.slice(0, -2)}
                        </span>
                    </div>
                    <button
                        onClick={applyAndActivate}
                        disabled={applying || !promoResult?.valid}
                        className="w-full py-4 rounded-full font-semibold text-white text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            backgroundColor: "var(--color-ink)",
                            color: "var(--color-canvas)",
                        }}
                    >
                        {applying ? "Activating..." : "Unlock with Promo Code"}
                    </button>
                </div>
            </div>
        </div>
    );
}
