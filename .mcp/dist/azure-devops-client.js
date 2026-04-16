import * as azdev from 'azure-devops-node-api';
export class AzureDevOpsClient {
    connection;
    gitApi = null;
    config;
    constructor(config) {
        this.config = config;
        const authHandler = azdev.getPersonalAccessTokenHandler(config.token);
        this.connection = new azdev.WebApi(config.organizationUrl, authHandler);
    }
    async getGitApi() {
        if (!this.gitApi) {
            this.gitApi = await this.connection.getGitApi();
        }
        return this.gitApi;
    }
    /**
     * List all repositories in the project
     */
    async listRepositories() {
        try {
            const gitApi = await this.getGitApi();
            const repos = await gitApi.getRepositories(this.config.project);
            return repos;
        }
        catch (error) {
            throw new Error(`Failed to list repositories: ${error.message}`);
        }
    }
    /**
     * Get repository details by name or ID
     */
    async getRepository(repositoryId) {
        try {
            const gitApi = await this.getGitApi();
            const repo = await gitApi.getRepository(repositoryId, this.config.project);
            return repo;
        }
        catch (error) {
            throw new Error(`Failed to get repository: ${error.message}`);
        }
    }
    /**
     * List branches in a repository
     */
    async listBranches(repositoryId) {
        try {
            const gitApi = await this.getGitApi();
            const branches = await gitApi.getBranches(repositoryId, this.config.project);
            return branches;
        }
        catch (error) {
            throw new Error(`Failed to list branches: ${error.message}`);
        }
    }
    /**
     * Get commits for a repository
     */
    async getCommits(repositoryId, branch, top) {
        try {
            const gitApi = await this.getGitApi();
            const searchCriteria = {
                $top: top || 50,
            };
            if (branch) {
                searchCriteria.itemVersion = {
                    version: branch,
                    versionType: 'branch'
                };
            }
            const commits = await gitApi.getCommits(repositoryId, searchCriteria, this.config.project);
            return commits;
        }
        catch (error) {
            throw new Error(`Failed to get commits: ${error.message}`);
        }
    }
    /**
     * List pull requests
     */
    async listPullRequests(repositoryId, status, creatorId, reviewerId, top) {
        try {
            const gitApi = await this.getGitApi();
            const searchCriteria = {
                status: status === 'all' ? undefined : (status === 'active' ? 1 : status === 'completed' ? 3 : status === 'abandoned' ? 2 : 1),
                creatorId,
                reviewerId,
            };
            const prs = await gitApi.getPullRequests(repositoryId, searchCriteria, this.config.project, undefined, 0, top || 50);
            return prs;
        }
        catch (error) {
            throw new Error(`Failed to list pull requests: ${error.message}`);
        }
    }
    /**
     * Get pull request details
     */
    async getPullRequest(repositoryId, pullRequestId) {
        try {
            const gitApi = await this.getGitApi();
            const pr = await gitApi.getPullRequest(repositoryId, pullRequestId, this.config.project);
            return pr;
        }
        catch (error) {
            throw new Error(`Failed to get pull request: ${error.message}`);
        }
    }
    /**
     * Create a pull request
     */
    async createPullRequest(repositoryId, sourceBranch, targetBranch, title, description, reviewers) {
        try {
            const gitApi = await this.getGitApi();
            const pr = {
                sourceRefName: `refs/heads/${sourceBranch}`,
                targetRefName: `refs/heads/${targetBranch}`,
                title,
                description: description || '',
                reviewers: reviewers?.map(id => ({ id }))
            };
            const createdPr = await gitApi.createPullRequest(pr, repositoryId, this.config.project);
            return createdPr;
        }
        catch (error) {
            throw new Error(`Failed to create pull request: ${error.message}`);
        }
    }
    /**
     * Add comment to pull request
     */
    async addPullRequestComment(repositoryId, pullRequestId, comment) {
        try {
            const gitApi = await this.getGitApi();
            const thread = {
                comments: [
                    {
                        content: comment,
                        commentType: 1 // text
                    }
                ],
                status: 1 // active
            };
            const result = await gitApi.createThread(thread, repositoryId, pullRequestId, this.config.project);
            return result;
        }
        catch (error) {
            throw new Error(`Failed to add comment: ${error.message}`);
        }
    }
    /**
     * Update pull request (approve, complete, abandon, etc.)
     */
    async updatePullRequest(repositoryId, pullRequestId, status, mergeCommitMessage) {
        try {
            const gitApi = await this.getGitApi();
            const update = {};
            if (status) {
                update.status = status === 'active' ? 1 : status === 'completed' ? 3 : 2;
            }
            if (mergeCommitMessage) {
                update.completionOptions = {
                    mergeCommitMessage
                };
            }
            const updatedPr = await gitApi.updatePullRequest(update, repositoryId, pullRequestId, this.config.project);
            return updatedPr;
        }
        catch (error) {
            throw new Error(`Failed to update pull request: ${error.message}`);
        }
    }
    /**
     * Vote on pull request with different approval statuses
     * @param repositoryId Repository ID
     * @param pullRequestId PR ID
     * @param vote Vote type: 'approve' (10), 'approve-with-suggestions' (5), 'no-vote' (0), 'wait-for-author' (-5), 'reject' (-10)
     * @param updateStatus Optionally update PR status based on vote
     */
    async votePullRequest(repositoryId, pullRequestId, vote, updateStatus = false) {
        try {
            const gitApi = await this.getGitApi();
            // Map vote string to number
            const voteValue = this.getVoteValue(vote);
            // Get current user ID
            const currentUserId = await this.getCurrentUserId();
            // Create the reviewer vote
            const reviewer = {
                vote: voteValue,
                isRequired: false
            };
            const identity = await gitApi.createPullRequestReviewer(reviewer, repositoryId, pullRequestId, currentUserId, this.config.project);
            let updatedPr;
            // Optionally update PR status based on vote
            if (updateStatus) {
                if (vote === 'reject') {
                    // If rejected, set to abandoned
                    updatedPr = await this.updatePullRequest(repositoryId, pullRequestId, 'abandoned');
                }
                else if (vote === 'wait-for-author') {
                    // If waiting for author, keep active but don't complete
                    updatedPr = await this.updatePullRequest(repositoryId, pullRequestId, 'active');
                }
                // Note: We don't auto-complete on approve - that's a manual action
            }
            return { reviewer: identity, pr: updatedPr };
        }
        catch (error) {
            throw new Error(`Failed to vote on pull request: ${error.message}`);
        }
    }
    /**
     * Get current authenticated user ID
     */
    async getCurrentUserId() {
        try {
            // Use the connection API to get authenticated user
            const authHandler = azdev.getPersonalAccessTokenHandler(this.config.token);
            const connection = new azdev.WebApi(this.config.organizationUrl, authHandler);
            const connectionData = await connection.connect();
            if (!connectionData.authenticatedUser?.id) {
                throw new Error('Unable to get authenticated user ID from connection');
            }
            return connectionData.authenticatedUser.id;
        }
        catch (error) {
            throw new Error(`Failed to get current user: ${error.message}`);
        }
    }
    /**
     * Map vote string to numeric value
     */
    getVoteValue(vote) {
        switch (vote) {
            case 'approve': return 10;
            case 'approve-with-suggestions': return 5;
            case 'no-vote': return 0;
            case 'wait-for-author': return -5;
            case 'reject': return -10;
            default: return 0;
        }
    }
    /**
     * Format repository for display
     */
    formatRepository(repo) {
        const lines = [
            `# ${repo.name}`,
            '',
            `**ID:** ${repo.id}`,
            `**Project:** ${repo.project?.name}`,
            `**Default Branch:** ${repo.defaultBranch || 'N/A'}`,
            `**Remote URL:** ${repo.remoteUrl}`,
            `**Web URL:** ${repo.webUrl}`,
        ];
        if (repo.size) {
            lines.push(`**Size:** ${(repo.size / 1024 / 1024).toFixed(2)} MB`);
        }
        return lines.join('\n');
    }
    /**
     * Format pull request for display
     */
    formatPullRequest(pr) {
        const lines = [
            `# PR ${pr.pullRequestId}: ${pr.title}`,
            '',
            `**Status:** ${this.getPRStatus(pr.status)}`,
            `**Created By:** ${pr.createdBy?.displayName || 'Unknown'}`,
            `**Created:** ${pr.creationDate?.toISOString() || 'N/A'}`,
            `**Source:** ${pr.sourceRefName?.replace('refs/heads/', '')}`,
            `**Target:** ${pr.targetRefName?.replace('refs/heads/', '')}`,
        ];
        if (pr.description) {
            lines.push('');
            lines.push('## Description');
            lines.push(pr.description);
        }
        if (pr.reviewers && pr.reviewers.length > 0) {
            lines.push('');
            lines.push('## Reviewers');
            pr.reviewers.forEach(reviewer => {
                const vote = this.getReviewerVote(reviewer.vote);
                lines.push(`- ${reviewer.displayName}: ${vote}`);
            });
        }
        lines.push('');
        lines.push(`**URL:** ${pr.url}`);
        return lines.join('\n');
    }
    getPRStatus(status) {
        switch (status) {
            case 1: return 'Active';
            case 2: return 'Abandoned';
            case 3: return 'Completed';
            default: return 'Unknown';
        }
    }
    getReviewerVote(vote) {
        switch (vote) {
            case 10: return '✅ Approved';
            case 5: return '👍 Approved with suggestions';
            case 0: return '⏳ No vote';
            case -5: return '⏸️ Waiting for author';
            case -10: return '❌ Rejected';
            default: return 'Unknown';
        }
    }
}
//# sourceMappingURL=azure-devops-client.js.map