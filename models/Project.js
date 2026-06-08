import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: String,
        description: String,
        coverImage: String,
        techStack: [String],
        demoUrl: String,
        repoUrl: String,
        status: {
            type: String,
            enum: ["building", "launched", "paused", "archived"],
            default: "building",
        },
        isPinned: { type: Boolean, default: false },
        order: Number,
        isActive: { type: Boolean, default: true },
        viewCount: { type: Number, default: 0 },
    },
    { timestamps: true },
);

export default mongoose.models.Project ||
    mongoose.model("Project", ProjectSchema);
