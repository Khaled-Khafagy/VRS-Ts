import axios from 'axios';
export class JiraClient {
    client;
    config;
    constructor(config) {
        this.config = config;
        this.client = this.createAxiosClient();
    }
    createAxiosClient() {
        const baseURL = this.config.url;
        const auth = this.config.auth;
        let headers = {
            'Content-Type': 'application/json',
        };
        let authConfig = {};
        if (this.config.type === 'cloud' && auth.type === 'cloud') {
            // Jira Cloud uses Basic Auth with email and API token
            const credentials = Buffer.from(`${auth.email}:${auth.apiToken}`).toString('base64');
            headers['Authorization'] = `Basic ${credentials}`;
        }
        else if (this.config.type === 'server' && auth.type === 'server') {
            if (auth.pat) {
                // Personal Access Token (Jira Server 8.14+)
                headers['Authorization'] = `Bearer ${auth.pat}`;
            }
            else if (auth.username && auth.password) {
                // Basic Auth for Jira Server
                const credentials = Buffer.from(`${auth.username}:${auth.password}`).toString('base64');
                headers['Authorization'] = `Basic ${credentials}`;
            }
        }
        return axios.create({
            baseURL,
            headers,
            timeout: 30000,
        });
    }
    /**
     * Get detailed information about a Jira issue
     */
    async getIssue(params) {
        const { issueKey, expand = [] } = params;
        try {
            const expandParam = expand.length > 0 ? `?expand=${expand.join(',')}` : '';
            const endpoint = `/rest/api/2/issue/${issueKey}${expandParam}`;
            const response = await this.client.get(endpoint);
            return response.data;
        }
        catch (error) {
            if (error.response) {
                throw new Error(`Jira API Error: ${error.response.status} - ${error.response.data?.errorMessages?.join(', ') || error.response.statusText}`);
            }
            throw new Error(`Failed to get issue: ${error.message}`);
        }
    }
    /**
     * Test the connection to Jira
     */
    async testConnection() {
        try {
            await this.client.get('/rest/api/2/myself');
            return true;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Add a comment to a Jira issue
     */
    async addComment(issueKey, commentBody) {
        try {
            const endpoint = `/rest/api/2/issue/${issueKey}/comment`;
            const response = await this.client.post(endpoint, {
                body: commentBody
            });
            return response.data;
        }
        catch (error) {
            if (error.response) {
                throw new Error(`Jira API Error: ${error.response.status} - ${error.response.data?.errorMessages?.join(', ') || error.response.statusText}`);
            }
            throw new Error(`Failed to add comment: ${error.message}`);
        }
    }
    /**
     * Format issue data for display
     */
    formatIssue(issue) {
        const lines = [
            `# ${issue.key}: ${issue.fields.summary}`,
            '',
            `**Type:** ${issue.fields.issuetype.name}`,
            `**Status:** ${issue.fields.status.name} (${issue.fields.status.statusCategory.name})`,
            `**Project:** ${issue.fields.project.name} (${issue.fields.project.key})`,
        ];
        if (issue.fields.priority) {
            lines.push(`**Priority:** ${issue.fields.priority.name}`);
        }
        if (issue.fields.assignee) {
            lines.push(`**Assignee:** ${issue.fields.assignee.displayName}`);
        }
        if (issue.fields.reporter) {
            lines.push(`**Reporter:** ${issue.fields.reporter.displayName}`);
        }
        lines.push('');
        lines.push(`**Created:** ${new Date(issue.fields.created).toLocaleString()}`);
        lines.push(`**Updated:** ${new Date(issue.fields.updated).toLocaleString()}`);
        if (issue.fields.labels && issue.fields.labels.length > 0) {
            lines.push('');
            lines.push(`**Labels:** ${issue.fields.labels.join(', ')}`);
        }
        if (issue.fields.components && issue.fields.components.length > 0) {
            lines.push('');
            lines.push(`**Components:** ${issue.fields.components.map(c => c.name).join(', ')}`);
        }
        if (issue.fields.description) {
            lines.push('');
            lines.push('## Description');
            lines.push(issue.fields.description);
        }
        lines.push('');
        lines.push(`**URL:** ${issue.self}`);
        return lines.join('\n');
    }
}
//# sourceMappingURL=jira-client.js.map