export const runtime = "nodejs";

import { auth } from "../../../auth.js";
import dbConnect from "@/lib/db.js";
import User from "@/models/User.js";
import Subscription from "@/models/Subscription.js";
import PricingCard from "./PricingCard.jsx";
import { checkAndUpdateExpiredPro } from "@/lib/server-utils.js";

export default async function BillingPage() {
    const session = await auth();
    await dbConnect();
    let user = await User.findOne({ email: session.user.email });
    user = await checkAndUpdateExpiredPro(user);
    const subscription = await Subscription.findOne({
        userId: user._id,
        status: "active",
    });

    // Check if user has pro (either via subscription or admin grant)
    const hasPro = subscription || user.isPro;

    return (
        <div className="max-w-3xl mt-14 mx-auto space-y-6">
            <h1
                className="text-2xl font-bold"
                style={{
                    fontFamily: "var(--font-plus-jakarta-sans)",
                    color: "var(--color-ink)",
                }}
            >
                Billing & Plan
            </h1>
            {hasPro ? (
                <div
                    className="p-6 rounded-2xl border"
                    style={{
                        backgroundColor: "var(--color-surface-1)",
                        borderColor: "var(--color-hairline)",
                    }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <span
                            className="px-3 py-1 text-xs rounded-full"
                            style={{
                                backgroundColor: "var(--color-surface-2)",
                                color: "#22c55e",
                            }}
                        >
                            Active
                        </span>
                        <h2
                            className="text-xl font-semibold"
                            style={{ color: "var(--color-ink)" }}
                        >
                            Shiplog Pro
                        </h2>
                    </div>
                    
                    {/* Show if granted by admin */}
                    {user.proSubscription?.grantedBy === "admin" && (
                        <div
                            className="mb-4 p-4 rounded-xl"
                            style={{
                                backgroundColor: "rgba(139, 92, 246, 0.1)",
                                border: "1px solid rgba(139, 92, 246, 0.3)",
                            }}
                        >
                            <p style={{ color: "var(--color-gradient-violet)" }}>
                                Pro subscription granted by admin
                            </p>
                        </div>
                    )}
                    
                    {subscription ? (
                        <>
                            <p style={{ color: "var(--color-ink-muted)" }}>
                                Plan:{" "}
                                {subscription.plan.charAt(0).toUpperCase() +
                                    subscription.plan.slice(1)}
                            </p>
                            <p style={{ color: "var(--color-ink-muted)" }}>
                                Start date:{" "}
                                {new Date(subscription.startDate).toLocaleDateString()}
                            </p>
                            {subscription.endDate && (
                                <p style={{ color: "var(--color-ink-muted)" }}>
                                    End date:{" "}
                                    {new Date(
                                        subscription.endDate,
                                    ).toLocaleDateString()}
                                </p>
                            )}
                        </>
                    ) : (
                        user.proSubscription && (
                            <>
                                <p style={{ color: "var(--color-ink-muted)" }}>
                                    Start date:{" "}
                                    {new Date(user.proSubscription.grantedAt).toLocaleDateString()}
                                </p>
                                <p style={{ color: "var(--color-ink-muted)" }}>
                                    Expires on:{" "}
                                    {new Date(user.proSubscription.expiresAt).toLocaleDateString()}
                                </p>
                            </>
                        )
                    )}
                </div>
            ) : (
                <PricingCard />
            )}
        </div>
    );
}
