import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Goal from "@/models/Goal";
import User from "@/models/User";

export const runtime = "nodejs";

export async function POST(request) {
    const session = await auth();
    if (!session) return new Response("Unauthorized", { status: 401 });

    await connectDB();

    const { title, targetDate } = await request.json();
    if (!title) return new Response("Title is required", { status: 400 });

    const user = await User.findById(session.user.id);
    const isPro = user && user.isPro;

    const currentGoalsCount = await Goal.countDocuments({
        userId: session.user.id,
    });
    if (!isPro && currentGoalsCount >= 10) {
        return new Response("Free users can have max 10 goals", {
            status: 403,
        });
    }

    const maxOrder = await Goal.find({ userId: session.user.id })
        .sort({ order: -1 })
        .limit(1);
    const order = maxOrder.length > 0 ? maxOrder[0].order + 1 : 0;

    const goal = await Goal.create({
        userId: session.user.id,
        title,
        targetDate: targetDate ? new Date(targetDate) : null,
        order,
    });

    return Response.json(goal);
}

export async function PATCH(request) {
    const session = await auth();
    if (!session) return new Response("Unauthorized", { status: 401 });

    await connectDB();

    const { id, title, targetDate, isCompleted } = await request.json();
    if (!id) return new Response("ID is required", { status: 400 });

    const update = {};
    if (title !== undefined) update.title = title;
    if (targetDate !== undefined)
        update.targetDate = targetDate ? new Date(targetDate) : null;
    if (isCompleted !== undefined) update.isCompleted = isCompleted;

    const goal = await Goal.findOneAndUpdate(
        { _id: id, userId: session.user.id },
        update,
        { new: true },
    );

    return Response.json(goal);
}

export async function DELETE(request) {
    const session = await auth();
    if (!session) return new Response("Unauthorized", { status: 401 });

    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return new Response("ID is required", { status: 400 });

    await Goal.deleteOne({ _id: id, userId: session.user.id });
    return new Response("Deleted", { status: 200 });
}

export async function GET(request) {
    const session = await auth();
    if (!session) return new Response("Unauthorized", { status: 401 });

    await connectDB();

    const goals = await Goal.find({ userId: session.user.id }).sort({
        order: 1,
    });
    return Response.json(goals);
}
