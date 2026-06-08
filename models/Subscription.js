import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    plan: { type: String, required: true },
    promoCode: String,
    discountApplied: { type: Number, default: 0 },
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    status: { type: String, enum: ["active", "expired", "pending"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.models.Subscription || mongoose.model("Subscription", SubscriptionSchema);
