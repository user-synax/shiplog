import Achievement from "../models/Achievement";
import User from "../models/User";

export const ACHIEVEMENTS = {
    first_log: {
        title: "First Shipment: Wrote your first build log",
    },
    streak_7: {
        title: "Week Warrior: 7-day streak",
    },
    streak_30: {
        title: "Month Grind: 30-day streak",
    },
    streak_100: {
        title: "Century Shipper: 100-day streak",
    },
    first_project: {
        title: "Launched: Added your first project",
    },
    profile_complete: {
        title: "Identity Set: Completed your full profile",
    },
};

export async function checkAndUnlock(userId, type) {
    const achievementDef = ACHIEVEMENTS[type];
    if (!achievementDef) return;

    const exists = await Achievement.findOne({ userId, type });
    if (exists) return;

    await Achievement.create({
        userId,
        type,
        title: achievementDef.title,
    });
}

export async function isProfileComplete(userId) {
    const user = await User.findById(userId);
    if (!user) return false;

    // Check if all key fields are filled
    return !!(user.displayName && user.bio && user.username);
}
