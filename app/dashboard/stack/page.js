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

    // Serialize data for client component
    const serializedTechStack = techStack.map(item => ({
        ...item,
        _id: item._id.toString(),
        userId: item.userId.toString(),
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
    }));

    const serializedGoals = goals.map(goal => ({
        ...goal,
        _id: goal._id.toString(),
        userId: goal.userId.toString(),
        createdAt: goal.createdAt.toISOString(),
        updatedAt: goal.updatedAt.toISOString(),
    }));

    const serializedLearning = learning.map(item => ({
        ...item,
        _id: item._id.toString(),
        userId: item.userId.toString(),
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
    }));

    return (
        <StackPageClient
            initialTechStack={serializedTechStack}
            initialGoals={serializedGoals}
            initialLearning={serializedLearning}
            isPro={user.isPro}
        />
    );
}
