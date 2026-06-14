import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
            });
        }

        await dbConnect();
        const user = await User.findById(session.user.id);

        return new Response(
            JSON.stringify({
                connected: user?.github?.connected || false,
                username: user?.github?.username,
                avatarUrl: user?.github?.avatarUrl,
                lastSync: user?.github?.lastSync,
            }),
            {
                headers: { "Content-Type": "application/json" },
                status: 200,
            },
        );
    } catch (error) {
        console.error("GitHub status error:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500 },
        );
    }
}
