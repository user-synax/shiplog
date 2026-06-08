export const runtime = "nodejs";

import { validatePromo, PLANS } from "../../../../lib/promo.js";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const plan = searchParams.get("plan");

    if (!code || !plan) {
        return Response.json(
            { valid: false, error: "Missing code or plan" },
            { status: 400 },
        );
    }

    const result = await validatePromo(code, plan);

    if (!result.valid) {
        return Response.json(result, { status: 400 });
    }

    const planData = PLANS[plan];
    let finalAmount = planData.price;

    if (result.discountType === "percent") {
        finalAmount = Math.round(
            planData.price * (1 - result.discountValue / 100),
        );
    } else if (result.discountType === "fixed") {
        finalAmount = Math.max(0, planData.price - result.discountValue);
    }

    return Response.json({
        valid: true,
        discountType: result.discountType,
        discountValue: result.discountValue,
        finalAmount,
        originalAmount: planData.price,
    });
}
