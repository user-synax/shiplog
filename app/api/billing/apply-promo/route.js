export const runtime = "nodejs";

import { auth } from "../../../../auth.js";
import dbConnect from "../../../../lib/db.js";
import User from "../../../../models/User.js";
import Subscription from "../../../../models/Subscription.js";
import { validatePromo, applyPromo } from "../../../../lib/promo.js";
import { PLANS } from "../../../../lib/constants.js";

export async function POST(req) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { code, plan } = await req.json();
  if (!code || !plan) {
    return Response.json({ error: "Missing code or plan" }, { status: 400 });
  }

  await dbConnect();
  const user = await User.findOne({ email: session.user.email });

  const promoResult = await validatePromo(code, plan);
  if (!promoResult.valid) {
    return Response.json({ error: promoResult.error }, { status: 400 });
  }

  // Apply promo code (increment used count)
  await applyPromo(code);

  // Calculate end date based on plan
  const startDate = new Date();
  let endDate = new Date(startDate);
  if (plan === "weekly") {
    endDate.setDate(endDate.getDate() + 7);
  } else if (plan === "monthly") {
    endDate.setMonth(endDate.getMonth() + 1);
  } else if (plan === "yearly") {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }

  // Create subscription
  const subscription = await Subscription.create({
    userId: user._id,
    plan,
    promoCode: code.toUpperCase(),
    discountApplied: promoResult.discountValue,
    startDate,
    endDate,
    status: "active",
  });

  // Update user to Pro
  await User.findByIdAndUpdate(user._id, { isPro: true });

  return Response.json({
    success: true,
    subscription,
    message: "Subscription activated successfully!",
  });
}
