import mongoose from "mongoose";

const PromoCodeSchema = new mongoose.Schema(
    {
        code: { type: String, unique: true, required: true },
        plan: {
            type: String,
            enum: ["monthly", "yearly", "weekly"],
            required: true,
        },
        discountType: {
            type: String,
            enum: ["percent", "fixed"],
            required: true,
        },
        discountValue: { type: Number, required: true },
        maxUses: Number,
        usedCount: { type: Number, default: 0 },
        expiresAt: Date,
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true },
);

export default mongoose.models.PromoCode ||
    mongoose.model("PromoCode", PromoCodeSchema);
