import mongoose from "mongoose";

const LearningSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: String,
        url: String,
        order: Number,
    },
    { timestamps: true },
);

export default mongoose.models.Learning ||
    mongoose.model("Learning", LearningSchema);
