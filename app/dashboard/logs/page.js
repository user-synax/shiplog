import { redirect } from "next/navigation";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import BuildLog from "@/models/BuildLog";
import GitHubCommit from "@/models/GitHubCommit";
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

    // Get GitHub commits for these logs
    const logIds = logs.map((log) => log._id);
    const commits = await GitHubCommit.find({
        buildLogId: { $in: logIds },
    }).lean();

    // Create a map of commit by buildLogId
    const commitMap = {};
    commits.forEach((commit) => {
        if (commit.buildLogId) {
            commitMap[commit.buildLogId.toString()] = commit;
        }
    });

    // Serialize data for client component
    const serializedLogs = logs.map((log) => {
        const commit = commitMap[log._id.toString()];
        return {
            ...log,
            _id: log._id.toString(),
            userId: log.userId.toString(),
            createdAt: log.createdAt.toISOString(),
            updatedAt: log.updatedAt.toISOString(),
            githubCommit: commit
                ? {
                      ...commit,
                      _id: commit._id.toString(),
                      userId: commit.userId.toString(),
                      buildLogId: commit.buildLogId?.toString(),
                      commitDate: commit.commitDate?.toISOString(),
                      createdAt: commit.createdAt.toISOString(),
                      updatedAt: commit.updatedAt.toISOString(),
                  }
                : null,
        };
    });

    return (
        <LogsClient
            initialLogs={serializedLogs}
            userLastLogDate={user.lastLogDate?.toISOString() || null}
        />
    );
}
