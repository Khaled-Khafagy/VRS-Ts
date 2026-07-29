import { JiraIssue } from './types.js';

export class JiraClient {
    private readonly baseUrl: string;
    private readonly headers: Record<string, string>;

    constructor(baseUrl: string, pat: string) {
        this.baseUrl = baseUrl.replace(/\/$/, '');
        this.headers = {
            'Authorization': `Bearer ${pat}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
    }

    async fetchIssue(issueKey: string): Promise<JiraIssue> {
        const url = `${this.baseUrl}/rest/api/2/issue/${issueKey}`;
        const response = await fetch(url, { headers: this.headers });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to fetch Jira issue ${issueKey}: ${response.status} ${error}`);
        }

        const data = await response.json() as any;
        const fields = data.fields;

        const description = this.extractText(fields.description) || 'No description provided';
        const acceptanceCriteria =
            this.extractText(fields.customfield_10100) ||
            this.extractText(fields.customfield_10016) ||
            this.extractCustomAC(description) ||
            'No acceptance criteria found';

        return {
            key: data.key,
            summary: fields.summary,
            description,
            issueType: fields.issuetype?.name || 'Unknown',
            status: fields.status?.name || 'Unknown',
            priority: fields.priority?.name || 'Normal',
            assignee: fields.assignee?.displayName || null,
            reporter: fields.reporter?.displayName || 'Unknown',
            acceptanceCriteria,
            projectKey: fields.project?.key || data.key.split('-')[0],
        };
    }

    async postComment(issueKey: string, commentText: string): Promise<void> {
        const url = `${this.baseUrl}/rest/api/2/issue/${issueKey}/comment`;
        const body = { body: commentText };

        const response = await fetch(url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to post comment to ${issueKey}: ${response.status} ${error}`);
        }
    }

    async addRemoteLink(issueKey: string, title: string, url: string, relationship: string): Promise<void> {
        const endpoint = `${this.baseUrl}/rest/api/2/issue/${issueKey}/remotelink`;
        const body = {
            globalId: `zephyr-${title.replace(/\s/g, '-').toLowerCase()}`,
            relationship,
            object: {
                url,
                title,
                icon: {
                    url16x16: `${this.baseUrl}/favicon.ico`,
                    title: 'Zephyr Scale',
                },
            },
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to add remote link to ${issueKey}: ${response.status} ${error}`);
        }
    }

    /** Create a Bug issue and return its key and browse URL. */
    async createBug(params: {
        projectKey: string;
        summary: string;
        description: string;
        priority?: string;
        labels?: string[];
        environment?: string;
        fixVersions?: string[];
    }): Promise<{ key: string; url: string }> {
        const fields: any = {
            project: { key: params.projectKey },
            summary: params.summary,
            description: params.description,
            issuetype: { name: 'Bug' },
        };
        if (params.priority) fields.priority = { name: params.priority };
        if (params.labels?.length) fields.labels = params.labels;
        if (params.environment) fields.environment = params.environment;
        if (params.fixVersions?.length) fields.fixVersions = params.fixVersions.map(name => ({ name }));

        const response = await fetch(`${this.baseUrl}/rest/api/2/issue`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({ fields }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to create bug: ${response.status} ${error}`);
        }
        const data = await response.json() as any;
        return { key: data.key, url: `${this.baseUrl}/browse/${data.key}` };
    }

    /** Link two issues (default "Relates" link type). */
    async linkIssues(fromKey: string, toKey: string, linkType = 'Relates'): Promise<void> {
        const response = await fetch(`${this.baseUrl}/rest/api/2/issueLink`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({
                type: { name: linkType },
                inwardIssue: { key: fromKey },
                outwardIssue: { key: toKey },
            }),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to link ${fromKey} to ${toKey}: ${response.status} ${error}`);
        }
    }

    /** List the (unreleased first) versions of a project. */
    async getProjectVersions(projectKey: string): Promise<{ name: string; released: boolean }[]> {
        const response = await fetch(`${this.baseUrl}/rest/api/2/project/${projectKey}/versions`, {
            headers: this.headers,
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to fetch versions for ${projectKey}: ${response.status} ${error}`);
        }
        const data = await response.json() as any[];
        return data
            .filter(v => !v.archived)
            .sort((a, b) => Number(a.released) - Number(b.released))
            .map(v => ({ name: v.name, released: !!v.released }));
    }

    /** Attach a local file to an issue. */
    async attachFile(issueKey: string, filePath: string): Promise<void> {
        const { readFileSync } = await import('node:fs');
        const { basename } = await import('node:path');
        const form = new FormData();
        form.append('file', new Blob([readFileSync(filePath)]), basename(filePath));

        const response = await fetch(`${this.baseUrl}/rest/api/2/issue/${issueKey}/attachments`, {
            method: 'POST',
            headers: {
                'Authorization': this.headers['Authorization'],
                'X-Atlassian-Token': 'no-check',
            },
            body: form,
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to attach file to ${issueKey}: ${response.status} ${error}`);
        }
    }

    /** Fetch just the project key from a Jira issue key (e.g. "PROJ-123" → "PROJ"). */
    async fetchProjectKey(issueKey: string): Promise<string> {
        const issue = await this.fetchIssue(issueKey);
        return issue.projectKey;
    }

    /** Extract ticket key from a URL or plain key (e.g. "https://.../PROJ-123" or "PROJ-123"). */
    static extractTicketKey(input: string): string {
        const match = input.match(/([A-Z]+-\d+)/);
        if (!match) throw new Error(`Could not extract ticket key from: ${input}`);
        return match[1];
    }

    private extractText(field: any): string {
        if (!field) return '';
        if (typeof field === 'string') return field;
        if (field.content) {
            return field.content
                .map((block: any) => this.extractBlockText(block))
                .join('\n')
                .trim();
        }
        return '';
    }

    private extractBlockText(block: any): string {
        if (!block) return '';
        if (block.type === 'text') return block.text || '';
        if (block.content) {
            return block.content.map((c: any) => this.extractBlockText(c)).join(' ');
        }
        return '';
    }

    private extractCustomAC(description: string): string {
        const match = description.match(/acceptance criteria[:\s]+([\s\S]+?)(?:\n\n|$)/i);
        return match ? match[1].trim() : '';
    }
}
