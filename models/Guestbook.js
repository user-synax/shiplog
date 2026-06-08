import mongoose from "mongoose";

const GuestbookSchema = new mongoose.Schema(
    {
        profileUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        authorName: String,
        authorEmail: String,
        authorAvatar: String,
        message: { type: String, maxlength: 300, required: true },
        isApproved: { type: Boolean, default: true },
    },
    { timestamps: true },
);

export default mongoose.models.Guestbook ||
    mongoose.model("Guestbook", GuestbookSchema);
