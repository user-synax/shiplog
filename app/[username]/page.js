export const runtime = "nodejs";

import connectToDB from "../../lib/db";
import { getTheme } from "../../lib/themes";
import { getDefaultAvatarUrl } from "../../lib/utils";
import User from "../../models/User";
import Project from "../../models/Project";
import BuildLog from "../../models/BuildLog";
import TechStack from "../../models/TechStack";
import Goal from "../../models/Goal";
import Learning from "../../models/Learning";
import Guestbook from "../../models/Guestbook";
import PublicProfileClient from "./PublicProfileClient";

export async function generateMetadata({ params }) {
    const { username } = await params;
    await connectToDB();
    const user = await User.findOne({ username });
    if (!user || !user.isProfilePublic) {
        return { title: "Profile not found | Shiplog" };
    }

    const description =
        user.tagline ||
        user.bio ||
        `${user.name}'s developer profile on Shiplog - showcasing projects, build logs, and coding streak.`;
    const keywords = [
        `${user.name}`,
        `${user.username}`,
        "developer portfolio",
        "build logs",
        "coding streak",
        "developer profile",
        ...(user.availability ? [`${user.availability} developer`] : []),
    ];

    return {
        title: `${user.name} (@${user.username}) | Shiplog`,
        description,
        keywords,
        authors: [{ name: user.name }],
        openGraph: {
            type: "profile",
            locale: "en_US",
            url: `https://shiplog.usersynax.dev/${user.username}`,
            siteName: "Shiplog",
            title: `${user.name} (@${user.username}) | Shiplog`,
            description,
            images: [
                {
                    url: user.avatarUrl || user.image || "/shiplog.png",
                    width: 800,
                    height: 800,
                    alt: `${user.name}'s profile picture`,
                },
            ],
            profile: {
                firstName: user.name?.split(" ")[0],
                lastName: user.name?.split(" ").slice(1).join(" "),
                username: user.username,
            },
        },
        twitter: {
            card: "summary_large_image",
            site: "@shiplog",
            creator: user.socials?.x || "@shiplog",
            title: `${user.name} (@${user.username}) | Shiplog`,
            description,
            images: [user.avatarUrl || user.image || "/shiplog.png"],
        },
        alternates: {
            canonical: `https://shiplog.usersynax.dev/${user.username}`,
        },
    };
}

export default async function PublicProfilePage({ params }) {
    const { username } = await params;
    await connectToDB();
    const user = await User.findOne({ username });
    if (!user || !user.isProfilePublic) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
                <h1 className="text-white text-2xl">Profile not found</h1>
            </div>
        );
    }
    const theme = getTheme(user.theme, user.isPro);
    const pinnedProjects = await Project.find({
        userId: user._id,
        isPinned: true,
    }).sort({ order: 1, createdAt: -1 });
    const activeProjects = await Project.find({
        userId: user._id,
        isActive: true,
    }).sort({ createdAt: -1 });
    const [logs, buildLogsCount, projectsCount] = await Promise.all([
        BuildLog.find({ userId: user._id }).sort({ createdAt: -1 }).limit(5),
        BuildLog.countDocuments({ userId: user._id }),
        Project.countDocuments({ userId: user._id }),
    ]);
    const techStack = await TechStack.find({ userId: user._id }).sort({
        order: 1,
    });
    const goals = await Goal.find({
        userId: user._id,
        isCompleted: false,
    })
        .sort({ order: 1 })
        .limit(5);
    const learning = await Learning.find({ userId: user._id })
        .sort({ createdAt: -1 })
        .limit(5);
    const guestbook = await Guestbook.find({
        profileUserId: user._id,
        isApproved: true,
    })
        .sort({ createdAt: -1 })
        .limit(10);
    const userData = JSON.parse(JSON.stringify(user));
    userData.avatarUrl =
        userData.avatarUrl ||
        userData.image ||
        getDefaultAvatarUrl(userData.username);
    return (
        <PublicProfileClient
            user={userData}
            theme={theme}
            pinnedProjects={JSON.parse(JSON.stringify(pinnedProjects))}
            activeProjects={JSON.parse(JSON.stringify(activeProjects))}
            logs={JSON.parse(JSON.stringify(logs))}
            techStack={JSON.parse(JSON.stringify(techStack))}
            goals={JSON.parse(JSON.stringify(goals))}
            learning={JSON.parse(JSON.stringify(learning))}
            guestbook={JSON.parse(JSON.stringify(guestbook))}
            buildLogsCount={buildLogsCount}
            projectsCount={projectsCount}
        />
    );
}
