export const runtime = "nodejs";

import connectToDB from "@/lib/db";
import Project from "@/models/Project";
import Click from "@/models/Click";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectToDB();
        const { projectId, type } = await request.json();
        const project = await Project.findById(projectId);
        if (!project) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 },
            );
        }
        project.viewCount = (project.viewCount || 0) + 1;
        await project.save();
        const ip =
            request.headers.get("x-forwarded-for") || request.ip || "unknown";
        const userAgent = request.headers.get("user-agent") || "unknown";
        const click = new Click({
            projectId,
            type,
            visitorIp: ip,
            userAgent,
        });
        await click.save();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to track click" },
            { status: 500 },
        );
    }
}
