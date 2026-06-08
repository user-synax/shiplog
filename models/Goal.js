import mongoose from "mongoose";

const GoalSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: String,
        isCompleted: { type: Boolean, default: false },
        targetDate: Date,
        order: Number,
    },
    { timestamps: true },
);

export default mongoose.models.Goal || mongoose.model("Goal", GoalSchema);
