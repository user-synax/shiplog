import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Learning from "@/models/Learning";
import User from "@/models/User";

export const runtime = "nodejs";

export async function POST(request) {
    const session = await auth();
    if (!session) return new Response("Unauthorized", { status: 401 });

    await connectDB();

    const { title, url } = await request.json();
    if (!title) return new Response("Title is required", { status: 400 });

    const user = await User.findById(session.user.id);
    const isPro = user && user.isPro;

    const currentCount = await Learning.countDocuments({
        userId: session.user.id,
    });
    if (!isPro && currentCount >= 5) {
        return new Response("Free users can have max 5 learning items", {
            status: 403,
        });
    }

    const maxOrder = await Learning.find({ userId: session.user.id })
        .sort({ order: -1 })
        .limit(1);
    const order = maxOrder.length > 0 ? maxOrder[0].order + 1 : 0;

    const learning = await Learning.create({
        userId: session.user.id,
        title,
        url: url || null,
        order,
    });

    return Response.json(learning);
}

export async function DELETE(request) {
    const session = await auth();
    if (!session) return new Response("Unauthorized", { status: 401 });

    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return new Response("ID is required", { status: 400 });

    await Learning.deleteOne({ _id: id, userId: session.user.id });
    return new Response("Deleted", { status: 200 });
}

export async function GET(request) {
    const session = await auth();
    if (!session) return new Response("Unauthorized", { status: 401 });

    await connectDB();

    const learning = await Learning.find({ userId: session.user.id }).sort({
        order: 1,
    });
    return Response.json(learning);
}
