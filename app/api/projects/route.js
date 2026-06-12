import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Project from "@/models/Project";

export const runtime = "nodejs";

export async function POST(request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const data = await request.json();
    const {
        title,
        description,
        coverImage,
        techStack,
        demoUrl,
        repoUrl,
        status,
    } = data;

    if (!title || !description) {
        return NextResponse.json(
            { error: "Title and description are required" },
            { status: 400 },
        );
    }

    const user = await User.findOne({ email: session.user.email });
    const projectCount = await Project.countDocuments({ userId: user._id });

    if (!user.isPro && projectCount >= 5) {
        return NextResponse.json(
            { error: "Free users can have max 5 projects" },
            { status: 403 },
        );
    }

    const project = await Project.create({
        userId: user._id,
        title,
        description,
        coverImage,
        techStack,
        demoUrl,
        repoUrl,
        status: status || "building",
        order: projectCount + 1,
        isActive: true,
    });

    return NextResponse.json({ project });
}

export async function GET(request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    const projects = await Project.find({ userId: user._id })
        .sort({ order: 1, createdAt: -1 })
        .lean();

    return NextResponse.json({ projects });
}
