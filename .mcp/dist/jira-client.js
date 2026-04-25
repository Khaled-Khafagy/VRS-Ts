export class JiraClient {
    baseUrl;
    headers;
    constructor(baseUrl, pat) {
        this.baseUrl = baseUrl.replace(/\/$/, '');
        this.headers = {
            'Authorization': `Bearer ${pat}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
    }
    async fetchIssue(issueKey) {
        const url = `${this.baseUrl}/rest/api/2/issue/${issueKey}`;
        const response = await fetch(url, { headers: this.headers });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to fetch Jira issue ${issueKey}: ${response.status} ${error}`);
        }
        const data = await response.json();
        const fields = data.fields;
        const description = this.extractText(fields.description) || 'No description provided';
        const acceptanceCriteria = this.extractText(fields.customfield_10100)
            || this.extractText(fields.customfield_10016)
            || this.extractCustomAC(description)
            || 'No acceptance criteria found';
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
        };
    }
    async addRemoteLink(issueKey, title, url, relationship) {
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
    extractText(field) {
        if (!field)
            return '';
        if (typeof field === 'string')
            return field;
        if (field.content) {
            return field.content
                .map((block) => this.extractBlockText(block))
                .join('\n')
                .trim();
        }
        return '';
    }
    extractBlockText(block) {
        if (!block)
            return '';
        if (block.type === 'text')
            return block.text || '';
        if (block.content) {
            return block.content.map((c) => this.extractBlockText(c)).join(' ');
        }
        return '';
    }
    extractCustomAC(description) {
        const match = description.match(/acceptance criteria[:\s]+([\s\S]+?)(?:\n\n|\Z)/i);
        return match ? match[1].trim() : '';
    }
}
