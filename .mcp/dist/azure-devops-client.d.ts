import { GitPullRequest, GitRepository, GitCommitRef } from 'azure-devops-node-api/interfaces/GitInterfaces';
export interface AzureDevOpsConfig {
    organizationUrl: string;
    token: string;
    project: string;
}
export declare class AzureDevOpsClient {
    private connection;
    private gitApi;
    private config;
    constructor(config: AzureDevOpsConfig);
    private getGitApi;
    /**
     * List all repositories in the project
     */
    listRepositories(): Promise<GitRepository[]>;
    /**
     * Get repository details by name or ID
     */
    getRepository(repositoryId: string): Promise<GitRepository>;
    /**
     * List branches in a repository
     */
    listBranches(repositoryId: string): Promise<any[]>;
    /**
     * Get commits for a repository
     */
    getCommits(repositoryId: string, branch?: string, top?: number): Promise<GitCommitRef[]>;
    /**
     * List pull requests
     */
    listPullRequests(repositoryId: string, status?: 'active' | 'completed' | 'abandoned' | 'all', creatorId?: string, reviewerId?: string, top?: number): Promise<GitPullRequest[]>;
    /**
     * Get pull request details
     */
    getPullRequest(repositoryId: string, pullRequestId: number): Promise<GitPullRequest>;
    /**
     * Create a pull request
     */
    createPullRequest(repositoryId: string, sourceBranch: string, targetBranch: string, title: string, description?: string, reviewers?: string[]): Promise<GitPullRequest>;
    /**
     * Add comment to pull request
     */
    addPullRequestComment(repositoryId: string, pullRequestId: number, comment: string): Promise<any>;
    /**
     * Update pull request (approve, complete, abandon, etc.)
     */
    updatePullRequest(repositoryId: string, pullRequestId: number, status?: 'active' | 'completed' | 'abandoned', mergeCommitMessage?: string): Promise<GitPullRequest>;
    /**
     * Vote on pull request with different approval statuses
     * @param repositoryId Repository ID
     * @param pullRequestId PR ID
     * @param vote Vote type: 'approve' (10), 'approve-with-suggestions' (5), 'no-vote' (0), 'wait-for-author' (-5), 'reject' (-10)
     * @param updateStatus Optionally update PR status based on vote
     */
    votePullRequest(repositoryId: string, pullRequestId: number, vote: 'approve' | 'approve-with-suggestions' | 'no-vote' | 'wait-for-author' | 'reject', updateStatus?: boolean): Promise<{
        reviewer: any;
        pr?: GitPullRequest;
    }>;
    /**
     * Get current authenticated user ID
     */
    private getCurrentUserId;
    /**
     * Map vote string to numeric value
     */
    private getVoteValue;
    /**
     * Format repository for display
     */
    formatRepository(repo: GitRepository): string;
    /**
     * Format pull request for display
     */
    formatPullRequest(pr: GitPullRequest): string;
    private getPRStatus;
    private getReviewerVote;
}
//# sourceMappingURL=azure-devops-client.d.ts.map