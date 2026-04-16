import type { JiraConfig, JiraIssue, GetIssueParams } from './types.js';
export declare class JiraClient {
    private client;
    private config;
    constructor(config: JiraConfig);
    private createAxiosClient;
    /**
     * Get detailed information about a Jira issue
     */
    getIssue(params: GetIssueParams): Promise<JiraIssue>;
    /**
     * Test the connection to Jira
     */
    testConnection(): Promise<boolean>;
    /**
     * Add a comment to a Jira issue
     */
    addComment(issueKey: string, commentBody: string): Promise<any>;
    /**
     * Format issue data for display
     */
    formatIssue(issue: JiraIssue): string;
}
//# sourceMappingURL=jira-client.d.ts.map