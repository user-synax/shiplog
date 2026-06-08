import dbConnect from "./db.js";
import PromoCode from "../models/PromoCode.js";
import { PLANS } from "./constants.js";

export async function validatePromo(code, plan) {
    await dbConnect();
    const promoDoc = await PromoCode.findOne({ code: code.toUpperCase() });

    if (!promoDoc) {
        return { valid: false, error: "Invalid promo code" };
    }

    if (!promoDoc.isActive) {
        return { valid: false, error: "Promo code is not active" };
    }

    if (promoDoc.expiresAt && new Date() > promoDoc.expiresAt) {
        return { valid: false, error: "Promo code has expired" };
    }

    if (promoDoc.maxUses && promoDoc.usedCount >= promoDoc.maxUses) {
        return { valid: false, error: "Promo code has reached max uses" };
    }

    if (promoDoc.plan !== plan) {
        return { valid: false, error: "Promo code not valid for this plan" };
    }

    return {
        valid: true,
        discountType: promoDoc.discountType,
        discountValue: promoDoc.discountValue,
        promoDoc,
    };
}

export async function applyPromo(code) {
    await dbConnect();
    await PromoCode.findOneAndUpdate(
        { code: code.toUpperCase() },
        { $inc: { usedCount: 1 } },
    );
}

export { PLANS };
