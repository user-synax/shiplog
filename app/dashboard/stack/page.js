import { redirect } from "next/navigation";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import TechStack from "@/models/TechStack";
import Goal from "@/models/Goal";
import Learning from "@/models/Learning";
import StackPageClient from "./StackPageClient";

export default async function StackPage() {
    const session = await auth();
    if (!session) redirect("/auth/signin");

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    const techStack = await TechStack.find({ userId: user._id })
        .sort({ order: 1 })
        .lean();
    const goals = await Goal.find({ userId: user._id })
        .sort({ order: 1 })
        .lean();
    const learning = await Learning.find({ userId: user._id })
        .sort({ order: 1 })
        .lean();

    return (
        <StackPageClient
            initialTechStack={techStack}
            initialGoals={goals}
            initialLearning={learning}
            isPro={user.isPro}
        />
    );
}
