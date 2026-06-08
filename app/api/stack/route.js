import { auth } from "../../../auth";
import connectDB from "../../../lib/db";
import TechStack from "../../../models/TechStack";

export const runtime = "nodejs";

export async function POST(request) {
    const session = await auth();
    if (!session) return new Response("Unauthorized", { status: 401 });

    await connectDB();

    const { name, category } = await request.json();
    if (!name) return new Response("Name is required", { status: 400 });

    const maxOrder = await TechStack.find({ userId: session.user.id, category })
        .sort({ order: -1 })
        .limit(1);
    const order = maxOrder.length > 0 ? maxOrder[0].order + 1 : 0;

    const stackItem = await TechStack.create({
        userId: session.user.id,
        name,
        category: category || "other",
        order,
    });

    return Response.json(stackItem);
}

export async function DELETE(request) {
    const session = await auth();
    if (!session) return new Response("Unauthorized", { status: 401 });

    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return new Response("ID is required", { status: 400 });

    await TechStack.deleteOne({ _id: id, userId: session.user.id });
    return new Response("Deleted", { status: 200 });
}

export async function GET(request) {
    const session = await auth();
    if (!session) return new Response("Unauthorized", { status: 401 });

    await connectDB();

    const stack = await TechStack.find({ userId: session.user.id }).sort({
        order: 1,
    });
    return Response.json(stack);
}
