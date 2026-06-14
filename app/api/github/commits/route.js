import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import GitHubCommit from "@/models/GitHubCommit";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
            });
        }

        await dbConnect();
        const commits = await GitHubCommit.find({ userId: session.user.id })
            .sort({ commitDate: -1 })
            .limit(50);

        return new Response(JSON.stringify({ commits }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("GitHub commits error:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500 },
        );
    }
}
