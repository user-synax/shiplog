import mongoose from "mongoose";

const ClickSchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        type: {
            type: String,
            enum: ["demo", "repo"],
            required: true,
        },
        visitorIp: String,
        userAgent: String,
    },
    { timestamps: true },
);

export default mongoose.models.Click || mongoose.model("Click", ClickSchema);
