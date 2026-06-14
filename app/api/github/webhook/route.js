import { createHmac } from "crypto";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import GitHubCommit from "@/models/GitHubCommit";
import BuildLog from "@/models/BuildLog";

export async function POST(req) {
    try {
        const body = await req.text();
        const signature = req.headers.get("x-hub-signature-256");
        const event = req.headers.get("x-github-event");

        if (!verifySignature(body, signature)) {
            return new Response("Invalid signature", { status: 403 });
        }

        await dbConnect();

        if (event === "push") {
            const payload = JSON.parse(body);
            await handlePushEvent(payload);
        }

        return new Response("OK", { status: 200 });
    } catch (error) {
        console.error("Webhook error:", error);
        return new Response("Error", { status: 500 });
    }
}

function verifySignature(body, signature) {
    const secret = process.env.GITHUB_WEBHOOK_SECRET;
    if (!secret || !signature) return true;

    const hmac = createHmac("sha256", secret);
    const digest = `sha256=${hmac.update(body).digest("hex")}`;

    const signatureBuffer = Buffer.from(signature);
    const digestBuffer = Buffer.from(digest);

    try {
        return crypto.timingSafeEqual(signatureBuffer, digestBuffer);
    } catch {
        return false;
    }
}

async function handlePushEvent(payload) {
    const commits = payload.commits || [];
    const repository = payload.repository;
    const ref = payload.ref;
    const branch = ref.replace("refs/heads/", "");

    for (const commit of commits) {
        const commitAuthorEmail = commit.author?.email || commit.committer?.email;
        
        if (!commitAuthorEmail) continue;

        const user = await User.findOne({
            $or: [
                { email: commitAuthorEmail },
                { "socials.github": payload.sender?.login },
            ],
        });

        if (!user) continue;

        const existingCommit = await GitHubCommit.findOne({
            commitHash: commit.id,
        });

        if (existingCommit) continue;

        const githubCommit = new GitHubCommit({
            userId: user._id,
            commitHash: commit.id,
            message: commit.message,
            repository: {
                name: repository.name,
                fullName: repository.full_name,
                htmlUrl: repository.html_url,
                private: repository.private,
            },
            branch,
            author: {
                name: commit.author?.name,
                email: commit.author?.email,
                username: payload.sender?.login,
            },
            committer: {
                name: commit.committer?.name,
                email: commit.committer?.email,
                username: payload.sender?.login,
            },
            stats: {
                additions: commit.added?.length || 0,
                deletions: commit.removed?.length || 0,
                total: (commit.added?.length || 0) + (commit.removed?.length || 0) + (commit.modified?.length || 0),
            },
            files: [
                ...(commit.added || []).map((f) => ({ filename: f, status: "added" })),
                ...(commit.removed || []).map((f) => ({ filename: f, status: "removed" })),
                ...(commit.modified || []).map((f) => ({ filename: f, status: "modified" })),
            ],
            htmlUrl: commit.url,
            commitDate: new Date(commit.timestamp),
        });

        await githubCommit.save();

        const today = new Date().toDateString();
        const lastLogDate = user.lastLogDate?.toDateString();

        const buildLog = new BuildLog({
            userId: user._id,
            content: `[GitHub] ${commit.message.substring(0, 497)}${commit.message.length > 500 ? "..." : ""}`,
            tags: ["github", repository.name],
            mood: "shipping",
        });

        await buildLog.save();

        githubCommit.buildLogId = buildLog._id;
        await githubCommit.save();

        const updateData = {
            $inc: { totalLogs: 1 },
            lastLogDate: new Date(),
        };

        if (lastLogDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toDateString();

            if (lastLogDate === yesterdayStr) {
                updateData.$inc.currentStreak = 1;
                if (user.currentStreak + 1 > user.longestStreak) {
                    updateData.longestStreak = user.currentStreak + 1;
                }
            } else {
                updateData.currentStreak = 1;
            }
        }

        await User.updateOne({ _id: user._id }, updateData);
    }
}
