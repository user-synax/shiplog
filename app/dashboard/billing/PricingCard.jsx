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
        } catch (error) {
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
        } catch (error) {
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
        <div className="w-full max-w-2xl mx-auto">
            <div
                className="p-6 md:p-8 lg:p-10 rounded-3xl relative overflow-hidden"
                style={{
                    background: "var(--color-surface-1)",
                    border: "1px solid var(--color-hairline)",
                }}
            >
                {/* Decorative gradient elements */}
                <div
                    className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-20"
                    style={{
                        background:
                            "radial-gradient(circle, var(--color-gradient-violet) 0%, transparent 70%)",
                    }}
                />
                <div
                    className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-20"
                    style={{
                        background:
                            "radial-gradient(circle, var(--color-gradient-magenta) 0%, transparent 70%)",
                    }}
                />

                <div className="space-y-6 md:space-y-8 relative z-10">
                    <div className="text-center md:text-left">
                        <h2
                            className="text-2xl md:text-3xl font-bold mb-3"
                            style={{
                                color: "var(--color-ink)",
                                fontFamily: "var(--font-plus-jakarta-sans)",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Upgrade to Pro
                        </h2>
                        <p
                            className="text-sm md:text-base"
                            style={{ color: "var(--color-ink-muted)" }}
                        >
                            Unlock all features and take your shiplog to the
                            next level
                        </p>
                    </div>

                    {/* Plan Selector */}
                    <div className="flex justify-center md:justify-start">
                        <div
                            className="inline-flex gap-1 p-1 rounded-full"
                            style={{ backgroundColor: "var(--color-canvas)" }}
                        >
                            {Object.entries(PLANS).map(([key, plan]) => (
                                <button
                                    key={key}
                                    onClick={() => {
                                        setSelectedPlan(key);
                                        setPromoResult(null);
                                    }}
                                    className="px-4 md:px-6 py-2 md:py-2.5 rounded-full transition-all duration-200 text-sm md:text-base"
                                    style={{
                                        backgroundColor:
                                            selectedPlan === key
                                                ? "var(--color-surface-2)"
                                                : "transparent",
                                        color:
                                            selectedPlan === key
                                                ? "var(--color-ink)"
                                                : "var(--color-ink-muted)",
                                        fontFamily: "var(--font-sans)",
                                    }}
                                >
                                    {plan.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-3 md:space-y-4">
                        {[
                            "Unlimited projects",
                            "All themes",
                            "Full analytics",
                            "Remove branding",
                            "Custom domain (coming soon)",
                        ].map((feature, idx) => (
                            <li
                                key={idx}
                                className="flex items-center gap-3 md:gap-4"
                                style={{ color: "var(--color-ink)" }}
                            >
                                <span
                                    className="text-lg md:text-xl flex-shrink-0"
                                    style={{
                                        color: "var(--color-semantic-success)",
                                    }}
                                >
                                    ✓
                                </span>
                                <span className="text-sm md:text-base">
                                    {feature}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Promo Code Section */}
                    <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <input
                                type="text"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                placeholder="Enter promo code"
                                className="flex-1 px-4 py-3 rounded-xl bg-transparent border focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all"
                                style={{
                                    borderColor: "var(--color-hairline)",
                                    color: "var(--color-ink)",
                                    backgroundColor: "var(--color-surface-1)",
                                    "--tw-ring-color": "rgba(0, 153, 255, 0.3)",
                                    "--tw-ring-offset-color":
                                        "var(--color-surface-1)",
                                }}
                            />
                            <button
                                onClick={validatePromoCode}
                                disabled={loadingPromo}
                                className="px-6 py-3 rounded-full font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{
                                    backgroundColor: "var(--color-surface-2)",
                                    color: "var(--color-ink)",
                                    fontFamily: "var(--font-sans)",
                                }}
                            >
                                {loadingPromo ? "..." : "Validate"}
                            </button>
                        </div>
                        {promoResult && (
                            <div
                                className="text-sm md:text-base"
                                style={{
                                    color: promoResult.valid
                                        ? "var(--color-semantic-success)"
                                        : "var(--color-accent-red)",
                                }}
                            >
                                {promoResult.valid
                                    ? `${promoResult.discountType === "percent" ? `${promoResult.discountValue}% off` : `${planData.currency}${promoResult.discountValue} off`} → ${planData.currency}${finalPrice}`
                                    : promoResult.error}
                            </div>
                        )}
                    </div>

                    {/* Price and CTA */}
                    <div className="text-center space-y-4 md:space-y-6">
                        <div
                            className="text-4xl md:text-5xl font-bold"
                            style={{
                                color: "var(--color-ink)",
                                fontFamily: "var(--font-plus-jakarta-sans)",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            {planData.currency}
                            {finalPrice}
                            <span
                                className="text-lg md:text-xl font-normal ml-1"
                                style={{ color: "var(--color-ink-muted)" }}
                            >
                                /{selectedPlan.slice(0, -2)}
                            </span>
                        </div>
                        <button
                            onClick={applyAndActivate}
                            disabled={applying || !promoResult?.valid}
                            className="w-full py-4 md:py-5 rounded-full font-semibold text-base md:text-lg transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                backgroundColor: "var(--color-primary)",
                                color: "var(--color-primary-text)",
                                fontFamily: "var(--font-sans)",
                            }}
                        >
                            {applying
                                ? "Activating..."
                                : "Unlock with Promo Code"}
                        </button>
                        <a
                            href="https://wa.me/+918826343179?text=Hello%20Shiplog!%20I%20need%20a%20promo%20code."
                            className="inline-block mt-4 md:mt-6 text-sm md:text-base underline"
                            style={{ color: "var(--color-ink-muted)" }}
                        >
                            Get a promo code
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
