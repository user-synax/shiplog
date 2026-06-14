export async function fetchGitHubUser(accessToken) {
    const response = await fetch("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "User-Agent": "Shiplog",
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`GitHub API error (user): ${response.status}`, errorText);
        throw new Error(`Failed to fetch GitHub user: ${response.status}`);
    }

    return response.json();
}

export async function fetchUserRepos(accessToken) {
    const response = await fetch(
        "https://api.github.com/user/repos?per_page=100&sort=updated",
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "User-Agent": "Shiplog",
            },
        },
    );

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`GitHub API error (repos): ${response.status}`, errorText);
        throw new Error(`Failed to fetch repos: ${response.status}`);
    }

    return response.json();
}

export async function fetchRepoCommits(accessToken, owner, repo, since = null) {
    let url = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=30`;

    if (since) {
        url += `&since=${since.toISOString()}`;
    }

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "User-Agent": "Shiplog",
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`GitHub API error (commits ${owner}/${repo}): ${response.status}`, errorText);

        // If it's an empty repo, no commits, or access issue, return empty array
        if (response.status === 409 || response.status === 204 || response.status === 404 || response.status === 403) {
            console.log(`Skipping repo ${owner}/${repo} (status: ${response.status})`);
            return [];
        }

        throw new Error(`Failed to fetch commits for ${owner}/${repo}: ${response.status}`);
    }

    return response.json();
}

export async function fetchCommit(accessToken, owner, repo, commitSha) {
    const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits/${commitSha}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "User-Agent": "Shiplog",
            },
        },
    );

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`GitHub API error (commit ${owner}/${repo}/${commitSha}): ${response.status}`, errorText);
        throw new Error(`Failed to fetch commit details: ${response.status}`);
    }

    return response.json();
}
