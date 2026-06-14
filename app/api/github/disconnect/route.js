import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
            });
        }

        await dbConnect();
        await User.updateOne(
            { _id: session.user.id },
            {
                $set: {
                    "github.connected": false,
                    "github.username": null,
                    "github.accessToken": null,
                    "github.refreshToken": null,
                    "github.tokenExpiresAt": null,
                    "github.userId": null,
                    "github.avatarUrl": null,
                },
            },
        );

        return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("GitHub disconnect error:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500 },
        );
    }
}
