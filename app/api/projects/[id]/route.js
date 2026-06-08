import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Project from "@/models/Project";

export const runtime = "nodejs";

export async function PATCH(request, { params }) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const data = await request.json();
    const { id } = await params;

    const user = await User.findOne({ email: session.user.email });
    const project = await Project.findOne({ _id: id, userId: user._id });
    if (!project) {
        return NextResponse.json(
            { error: "Project not found" },
            { status: 404 },
        );
    }

    Object.assign(project, data);
    await project.save();

    return NextResponse.json({ project });
}

export async function DELETE(request, { params }) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const user = await User.findOne({ email: session.user.email });
    await Project.deleteOne({ _id: id, userId: user._id });

    return NextResponse.json({ success: true });
}
