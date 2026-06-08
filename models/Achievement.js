import mongoose from "mongoose";

const AchievementSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: String,
        title: String,
        earnedAt: { type: Date, default: Date.now },
    },
    { timestamps: true },
);

export default mongoose.models.Achievement ||
    mongoose.model("Achievement", AchievementSchema);
