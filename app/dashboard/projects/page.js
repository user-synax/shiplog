import { redirect } from "next/navigation";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Project from "@/models/Project";
import ProjectsClient from "./ProjectsClient";

export default async function ProjectsPage() {
    const session = await auth();
    if (!session) redirect("/auth/signin");

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    const projects = await Project.find({ userId: user._id })
        .sort({ order: 1, createdAt: -1 })
        .lean();

    // Serialize data for client component
    const serializedProjects = projects.map(project => ({
        ...project,
        _id: project._id.toString(),
        userId: project.userId.toString(),
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
    }));

    return <ProjectsClient initialProjects={serializedProjects} isPro={user.isPro} />;
}
