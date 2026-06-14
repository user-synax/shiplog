import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import GitHubCommit from "@/models/GitHubCommit";
import BuildLog from "@/models/BuildLog";
import { fetchUserRepos, fetchRepoCommits } from "@/lib/github";

export async function POST() {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });

    if (!user.github?.connected || !user.github?.accessToken) {
        return NextResponse.json(
            { error: "GitHub not connected" },
            { status: 400 },
        );
    }

    try {
        // Get all repos
        console.log("Fetching repos for user:", user.github.username);
        const repos = await fetchUserRepos(user.github.accessToken);
        console.log(`Found ${repos.length} repos`);

        // Get the last sync date or default to 7 days ago (reduced from 30 for performance)
        const lastSync = user.github?.lastSync
            ? new Date(user.github.lastSync)
            : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        console.log(`Syncing commits since: ${lastSync.toISOString()}`);

        let newCommitsCount = 0;
        let newLogsCount = 0;
        let reposProcessed = 0;

        // Process each repo
        for (const repo of repos) {
            if (repo.archived) continue;
            reposProcessed++;

            try {
                console.log(`Processing repo: ${repo.full_name}`);

                // Fetch commits since last sync
                const commits = await fetchRepoCommits(
                    user.github.accessToken,
                    repo.owner.login,
                    repo.name,
                    lastSync,
                );

                console.log(`Found ${commits.length} commits in ${repo.name}`);

                // Process each commit
                for (const commit of commits) {
                    // Skip if commit not authored by user
                    const commitAuthorLogin = commit.author?.login;
                    const commitCommitterLogin = commit.committer?.login;

                    if (
                        commitAuthorLogin !== user.github.username &&
                        commitCommitterLogin !== user.github.username
                    ) {
                        continue;
                    }

                    // Check if we already have this commit
                    const existingCommit = await GitHubCommit.findOne({
                        commitHash: commit.sha,
                    });
                    if (existingCommit) continue;

                    console.log(`Processing new commit: ${commit.sha}`);

                    // Create GitHub commit record (without extra API call)
                    const githubCommit = new GitHubCommit({
                        userId: user._id,
                        commitHash: commit.sha,
                        message: commit.commit.message,
                        repository: {
                            name: repo.name,
                            fullName: repo.full_name,
                            htmlUrl: repo.html_url,
                            private: repo.private,
                        },
                        branch: repo.default_branch || "main",
                        author: {
                            name: commit.commit.author?.name,
                            email: commit.commit.author?.email,
                            username: commit.author?.login,
                        },
                        committer: {
                            name: commit.commit.committer?.name,
                            email: commit.commit.committer?.email,
                            username: commit.committer?.login,
                        },
                        stats: {
                            additions: 0,
                            deletions: 0,
                            total: 0,
                        },
                        files: [], // We'll leave this empty to avoid extra API call
                        htmlUrl: commit.html_url,
                        commitDate: new Date(
                            commit.commit.author?.date ||
                                commit.commit.committer?.date,
                        ),
                    });

                    await githubCommit.save();
                    newCommitsCount++;

                    // Create a build log for this commit
                    const today = new Date().toDateString();
                    const lastLogDate = user.lastLogDate?.toDateString();

                    const buildLog = new BuildLog({
                        userId: user._id,
                        content: `[GitHub] ${commit.commit.message.substring(0, 497)}${commit.commit.message.length > 500 ? "..." : ""}`,
                        tags: ["github", repo.name],
                        mood: "shipping",
                    });

                    await buildLog.save();
                    newLogsCount++;

                    // Link the commit to the log
                    githubCommit.buildLogId = buildLog._id;
                    await githubCommit.save();

                    // Update user stats and streak
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
                                updateData.longestStreak =
                                    user.currentStreak + 1;
                            }
                        } else {
                            updateData.currentStreak = 1;
                            if (!user.longestStreak) {
                                updateData.longestStreak = 1;
                            }
                        }
                    }

                    await User.updateOne({ _id: user._id }, updateData);

                    // Refresh user object
                    const updatedUser = await User.findById(user._id);
                    user.currentStreak = updatedUser.currentStreak;
                    user.longestStreak = updatedUser.longestStreak;
                    user.lastLogDate = updatedUser.lastLogDate;
                    user.totalLogs = updatedUser.totalLogs;
                }
            } catch (repoError) {
                console.error(
                    `Error processing repo ${repo.full_name}:`,
                    repoError.message,
                );
                // Continue with next repo
            }
        }

        // Update last sync time
        await User.updateOne(
            { _id: user._id },
            { $set: { "github.lastSync": new Date() } },
        );

        console.log(
            `Sync complete: ${newCommitsCount} new commits, ${newLogsCount} new logs from ${reposProcessed} repos`,
        );

        return NextResponse.json({
            success: true,
            newCommits: newCommitsCount,
            newLogs: newLogsCount,
        });
    } catch (error) {
        console.error("GitHub sync error:", error);
        return NextResponse.json(
            { error: `Failed to sync commits: ${error.message}` },
            { status: 500 },
        );
    }
}
