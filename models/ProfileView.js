import mongoose from "mongoose";

const ProfileViewSchema = new mongoose.Schema(
    {
        profileUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        visitorIp: String,
        country: String,
        city: String,
        referrer: String,
        userAgent: String,
    },
    { timestamps: true },
);

export default mongoose.models.ProfileView ||
    mongoose.model("ProfileView", ProfileViewSchema);
