import mongoose from "mongoose";

const GitHubCommitSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        commitHash: { type: String, required: true, unique: true },
        message: { type: String, required: true },
        repository: {
            name: String,
            fullName: String,
            htmlUrl: String,
            private: Boolean,
        },
        branch: String,
        author: {
            name: String,
            email: String,
            username: String,
        },
        committer: {
            name: String,
            email: String,
            username: String,
        },
        stats: {
            additions: Number,
            deletions: Number,
            total: Number,
        },
        files: [
            {
                filename: String,
                status: String,
                additions: Number,
                deletions: Number,
                changes: Number,
                patch: String,
            },
        ],
        htmlUrl: String,
        commitDate: Date,
        autoLogged: { type: Boolean, default: true },
        buildLogId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BuildLog",
        },
    },
    { timestamps: true },
);

export default mongoose.models.GitHubCommit ||
    mongoose.model("GitHubCommit", GitHubCommitSchema);
