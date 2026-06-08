import mongoose from "mongoose";

const BuildLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: { type: String, maxlength: 500, required: true },
        tags: [String],
        mood: {
            type: String,
            enum: ["productive", "stuck", "learning", "shipping", "grinding"],
        },
    },
    { timestamps: true },
);

export default mongoose.models.BuildLog ||
    mongoose.model("BuildLog", BuildLogSchema);
