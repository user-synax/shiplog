import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: String,
        email: { type: String, unique: true, required: true },
        password: String,
        image: String,
        username: { 
            type: String, 
            unique: true, 
            sparse: true // This allows multiple null/undefined values
        },
        tagline: String,
        bio: { type: String, maxlength: 200 },
        avatarUrl: String,
        socials: {
            github: String,
            linkedin: String,
            x: String,
            instagram: String,
            website: String,
        },
        isPro: { type: Boolean, default: false },
        proSubscription: {
            grantedBy: String,
            grantedAt: Date,
            expiresAt: Date,
        },
        theme: { type: String, default: "warm-sand" },
        availability: {
            type: String,
            enum: [
                "open",
                "internship",
                "freelance",
                "fulltime",
                "collaboration",
                "not_available",
            ],
            default: "not_available",
        },
        currentStreak: { type: Number, default: 0 },
        longestStreak: { type: Number, default: 0 },
        lastLogDate: Date,
        totalLogs: { type: Number, default: 0 },
        resumeUrl: String,
        isProfilePublic: { type: Boolean, default: true },
    },
    { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
