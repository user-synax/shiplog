import mongoose from "mongoose";

const TechStackSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: String,
        category: {
            type: String,
            enum: ["language", "framework", "database", "tool", "other"],
            default: "other",
        },
        order: Number,
    },
    { timestamps: true },
);

export default mongoose.models.TechStack ||
    mongoose.model("TechStack", TechStackSchema);
