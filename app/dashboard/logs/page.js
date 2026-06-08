import { redirect } from "next/navigation";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import BuildLog from "@/models/BuildLog";
import LogsClient from "./LogsClient";

export default async function LogsPage() {
    const session = await auth();
    if (!session) redirect("/auth/signin");

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    const logs = await BuildLog.find({ userId: user._id })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();

    return <LogsClient initialLogs={logs} userLastLogDate={user.lastLogDate} />;
}
