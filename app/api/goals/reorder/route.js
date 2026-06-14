import { auth } from "@/auth";
import connectDB from "../../../../lib/db";
import Goal from "../../../../models/Goal";

export const runtime = "nodejs";

export async function PATCH(request) {
    const session = await auth();
    if (!session) return new Response("Unauthorized", { status: 401 });

    await connectDB();

    const { items } = await request.json();
    if (!items) return new Response("Items are required", { status: 400 });

    for (const item of items) {
        await Goal.updateOne(
            { _id: item.id, userId: session.user.id },
            { order: item.order },
        );
    }

    return new Response("Reordered", { status: 200 });
}
