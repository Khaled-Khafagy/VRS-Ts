export interface JiraConfig {
    type: 'cloud' | 'server';
    url: string;
    auth: JiraCloudAuth | JiraServerAuth;
}
export interface JiraCloudAuth {
    type: 'cloud';
    email: string;
    apiToken: string;
}
export interface JiraServerAuth {
    type: 'server';
    username?: string;
    password?: string;
    pat?: string;
}
export interface JiraIssue {
    id: string;
    key: string;
    self: string;
    fields: {
        summary: string;
        description?: string;
        status: {
            name: string;
            statusCategory: {
                key: string;
                name: string;
            };
        };
        issuetype: {
            name: string;
            iconUrl?: string;
        };
        priority?: {
            name: string;
            iconUrl?: string;
        };
        assignee?: {
            displayName: string;
            emailAddress?: string;
        };
        reporter?: {
            displayName: string;
            emailAddress?: string;
        };
        created: string;
        updated: string;
        project: {
            key: string;
            name: string;
        };
        labels?: string[];
        components?: Array<{
            name: string;
        }>;
        [key: string]: any;
    };
}
export interface JiraApiResponse<T> {
    data: T;
    status: number;
}
export interface GetIssueParams {
    issueKey: string;
    expand?: string[];
}
//# sourceMappingURL=types.d.ts.map