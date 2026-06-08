import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

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
                { folder: "shiplog/avatars" },
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

                    const user = await User.findOne({
                        email: session.user.email,
                    });
                    user.avatarUrl = result.secure_url;
                    await user.save();

                    resolve(
                        NextResponse.json({
                            success: true,
                            avatarUrl: result.secure_url,
                        }),
                    );
                },
            )
            .end(buffer);
    });
}
