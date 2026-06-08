import { NextResponse } from "next/server";
import { auth } from "@/auth";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
        return NextResponse.json(
            { error: "No file provided" },
            { status: 400 },
        );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve) => {
        cloudinary.uploader
            .upload_stream(
                { folder: "shiplog/project-covers" },
                async (error, result) => {
                    if (error) {
                        resolve(
                            NextResponse.json(
                                { error: error.message },
                                { status: 500 },
                            ),
                        );
                        return;
                    }
                    resolve(NextResponse.json({ url: result.secure_url }));
                },
            )
            .end(buffer);
    });
}
