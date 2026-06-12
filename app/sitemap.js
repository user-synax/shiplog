import connectToDB from "@/lib/db";
import User from "@/models/User";

export default async function sitemap() {
    await connectToDB();

    // Fetch all public users
    const publicUsers = await User.find({ isProfilePublic: true }).select(
        "username updatedAt",
    );

    // Base URLs
    const baseUrls = [
        {
            url: "https://shiplog.usersynax.dev",
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: "https://shiplog.usersynax.dev/auth/signin",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: "https://shiplog.usersynax.dev/auth/signup",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
    ];

    // User profile URLs
    const userUrls = publicUsers.map((user) => ({
        url: `https://shiplog.usersynax.dev/${user.username}`,
        lastModified: user.updatedAt,
        changeFrequency: "daily",
        priority: 0.9,
    }));

    return [...baseUrls, ...userUrls];
}
