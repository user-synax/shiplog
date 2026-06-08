"use client";

import { useState } from "react";
import { PLANS } from "@/lib/constants.js";

function generateCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

export default function PromoManagerClient({ initialPromos }) {
    const [promos, setPromos] = useState(initialPromos);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        code: generateCode(),
        plan: "monthly",
        discountType: "percent",
        discountValue: 20,
        maxUses: 100,
        expiresAt: "",
    });
    const [submitting, setSubmitting] = useState(false);

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch("/api/admin/promo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const newPromo = await res.json();
            setPromos([newPromo, ...promos]);
            setShowForm(false);
            setFormData({
                code: generateCode(),
                plan: "monthly",
                discountType: "percent",
                discountValue: 20,
                maxUses: 100,
                expiresAt: "",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const toggleActive = async (promoId, currentStatus) => {
        const res = await fetch(`/api/admin/promo/${promoId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: !currentStatus }),
        });
        const updated = await res.json();
        setPromos(promos.map((p) => (p._id === promoId ? updated : p)));
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1
                    className="text-3xl font-bold"
                    style={{
                        color: "var(--color-ink)",
                        fontFamily: "var(--font-plus-jakarta-sans)",
                    }}
                >
                    Promo Codes
                </h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-6 py-3 rounded-full font-medium"
                    style={{
                        backgroundColor: showForm ? "var(--color-surface-2)" : "var(--color-ink)",
                        color: showForm ? "var(--color-ink)" : "var(--color-canvas)",
                    }}
                >
                    {showForm ? "Cancel" : "Create Promo Code"}
                </button>
            </div>
            {showForm && (
                <div
                    className="p-8 rounded-[20px] mb-8"
                    style={{ backgroundColor: "var(--color-surface-1)" }}
                >
                    <form
                        onSubmit={handleCreate}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        <div>
                            <label
                                className="block mb-2 text-sm font-medium"
                                style={{ color: "var(--color-ink-muted)" }}
                            >
                                Code
                            </label>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            code: e.target.value.toUpperCase(),
                                        })
                                    }
                                    className="flex-1 px-4 py-3 rounded-[10px] border"
                                    style={{
                                        borderColor: "var(--color-hairline)",
                                        color: "var(--color-ink)",
                                        backgroundColor: "var(--color-surface-1)",
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            code: generateCode(),
                                        })
                                    }
                                    className="px-4 py-3 rounded-full font-medium"
                                    style={{
                                        backgroundColor: "var(--color-surface-2)",
                                        color: "var(--color-ink)",
                                    }}
                                >
                                    Generate
                                </button>
                            </div>
                        </div>
                        <div>
                            <label
                                className="block mb-2 text-sm font-medium"
                                style={{ color: "var(--color-ink-muted)" }}
                            >
                                Plan
                            </label>
                            {/* Pricing Tabs for Plan Select */}
                            <div className="inline-flex gap-2 p-1 rounded-full w-full"
                                style={{ backgroundColor: "var(--color-surface-2)" }}>
                                {Object.entries(PLANS).map(([key, plan]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() =>
                                            setFormData({ ...formData, plan: key })
                                        }
                                        className="flex-1 px-3 py-2 rounded-full transition-all text-sm"
                                        style={{
                                            backgroundColor:
                                                formData.plan === key
                                                    ? "var(--color-surface-1)"
                                                    : "transparent",
                                            color:
                                                formData.plan === key
                                                    ? "var(--color-ink)"
                                                    : "var(--color-ink-muted)",
                                        }}
                                    >
                                        {plan.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label
                                className="block mb-2 text-sm font-medium"
                                style={{ color: "var(--color-ink-muted)" }}
                            >
                                Discount Type
                            </label>
                            <div className="inline-flex gap-2 p-1 rounded-full"
                                style={{ backgroundColor: "var(--color-surface-2)" }}>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, discountType: "percent" })}
                                    className="px-4 py-2 rounded-full transition-all text-sm"
                                    style={{
                                        backgroundColor: formData.discountType === "percent" ? "var(--color-surface-1)" : "transparent",
                                        color: formData.discountType === "percent" ? "var(--color-ink)" : "var(--color-ink-muted)",
                                    }}
                                >
                                    Percent (%)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, discountType: "fixed" })}
                                    className="px-4 py-2 rounded-full transition-all text-sm"
                                    style={{
                                        backgroundColor: formData.discountType === "fixed" ? "var(--color-surface-1)" : "transparent",
                                        color: formData.discountType === "fixed" ? "var(--color-ink)" : "var(--color-ink-muted)",
                                    }}
                                >
                                    Fixed (₹)
                                </button>
                            </div>
                        </div>
                        <div>
                            <label
                                className="block mb-2 text-sm font-medium"
                                style={{ color: "var(--color-ink-muted)" }}
                            >
                                Discount Value
                            </label>
                            <input
                                type="number"
                                value={formData.discountValue}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        discountValue: parseInt(e.target.value) || 0,
                                    })
                                }
                                className="w-full px-4 py-3 rounded-[10px] border"
                                style={{
                                    borderColor: "var(--color-hairline)",
                                    color: "var(--color-ink)",
                                    backgroundColor: "var(--color-surface-1)",
                                }}
                            />
                        </div>
                        <div>
                            <label
                                className="block mb-2 text-sm font-medium"
                                style={{ color: "var(--color-ink-muted)" }}
                            >
                                Max Uses
                            </label>
                            <input
                                type="number"
                                value={formData.maxUses}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        maxUses: parseInt(e.target.value) || 0,
                                    })
                                }
                                className="w-full px-4 py-3 rounded-[10px] border"
                                style={{
                                    borderColor: "var(--color-hairline)",
                                    color: "var(--color-ink)",
                                    backgroundColor: "var(--color-surface-1)",
                                }}
                            />
                        </div>
                        <div>
                            <label
                                className="block mb-2 text-sm font-medium"
                                style={{ color: "var(--color-ink-muted)" }}
                            >
                                Expires At (optional)
                            </label>
                            <input
                                type="date"
                                value={formData.expiresAt}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        expiresAt: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-3 rounded-[10px] border"
                                style={{
                                    borderColor: "var(--color-hairline)",
                                    color: "var(--color-ink)",
                                    backgroundColor: "var(--color-surface-1)",
                                }}
                            />
                        </div>
                        <div className="md:col-span-2 mt-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3 rounded-full font-semibold text-white"
                                style={{
                                    backgroundColor: "var(--color-ink)",
                                    color: "var(--color-canvas)",
                                    opacity: submitting ? 0.5 : 1,
                                    cursor: submitting ? "not-allowed" : "pointer",
                                }}
                            >
                                {submitting ? "Creating..." : "Create Promo Code"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
            <div
                className="overflow-hidden rounded-[20px]"
                style={{ backgroundColor: "var(--color-surface-1)" }}
            >
                <table className="w-full">
                    <thead>
                        <tr
                            style={{
                                borderBottom: "1px solid var(--color-hairline)",
                            }}
                        >
                            <th
                                className="text-left p-4 font-medium"
                                style={{ color: "var(--color-ink-muted)" }}
                            >
                                Code
                            </th>
                            <th
                                className="text-left p-4 font-medium"
                                style={{ color: "var(--color-ink-muted)" }}
                            >
                                Plan
                            </th>
                            <th
                                className="text-left p-4 font-medium"
                                style={{ color: "var(--color-ink-muted)" }}
                            >
                                Discount
                            </th>
                            <th
                                className="text-left p-4 font-medium"
                                style={{ color: "var(--color-ink-muted)" }}
                            >
                                Uses
                            </th>
                            <th
                                className="text-left p-4 font-medium"
                                style={{ color: "var(--color-ink-muted)" }}
                            >
                                Expires
                            </th>
                            <th
                                className="text-left p-4 font-medium"
                                style={{ color: "var(--color-ink-muted)" }}
                            >
                                Active
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {promos.map((promo) => (
                            <tr
                                key={promo._id}
                                style={{
                                    borderBottom: "1px solid var(--color-hairline)",
                                }}
                            >
                                <td
                                    className="p-4"
                                    style={{ color: "var(--color-ink)" }}
                                >
                                    <span className="font-mono font-bold">
                                        {promo.code}
                                    </span>
                                </td>
                                <td
                                    className="p-4"
                                    style={{ color: "var(--color-ink)" }}
                                >
                                    {promo.plan.charAt(0).toUpperCase() + promo.plan.slice(1)}
                                </td>
                                <td
                                    className="p-4"
                                    style={{ color: "var(--color-ink)" }}
                                >
                                    {promo.discountType === "percent"
                                        ? `${promo.discountValue}%`
                                        : `₹${promo.discountValue}`}
                                </td>
                                <td
                                    className="p-4"
                                    style={{ color: "var(--color-ink)" }}
                                >
                                    {promo.usedCount} / {promo.maxUses || "∞"}
                                </td>
                                <td
                                    className="p-4"
                                    style={{ color: "var(--color-ink)" }}
                                >
                                    {promo.expiresAt
                                        ? new Date(promo.expiresAt).toLocaleDateString()
                                        : "Never"}
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => toggleActive(promo._id, promo.isActive)}
                                        className="px-4 py-1 rounded-full text-xs font-medium"
                                        style={{
                                            backgroundColor: promo.isActive ? "#22c55e" : "var(--color-surface-2)",
                                            color: promo.isActive ? "white" : "var(--color-ink-muted)",
                                        }}
                                    >
                                        {promo.isActive ? "Active" : "Inactive"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
