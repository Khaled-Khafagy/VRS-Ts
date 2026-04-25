export class ZephyrClient {
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
    async createTestCase(projectKey, testCase, issueKey) {
        const url = `${this.baseUrl}/rest/atm/1.0/testcase`;
        const body = {
            projectKey,
            name: testCase.name,
            objective: testCase.objective,
            precondition: testCase.precondition || '',
            priority: testCase.priority,
            status: 'Approved',
            labels: testCase.labels || [],
            issueLinks: [issueKey],
            testScript: {
                type: 'STEP_BY_STEP',
                steps: testCase.steps.map(step => ({
                    description: step.description,
                    testData: step.testData || '',
                    expectedResult: step.expectedResult,
                })),
            },
        };
        const response = await fetch(url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to create test case "${testCase.name}": ${response.status} ${error}`);
        }
        const created = await response.json();
        return {
            key: created.key,
            name: testCase.name,
            url: `${this.baseUrl}/secure/Tests.jspa#/v2/testCase/${created.key}`,
        };
    }
    async createTestCycle(projectKey, cycleName, description, testCaseKeys, issueKey) {
        const url = `${this.baseUrl}/rest/atm/1.0/testrun`;
        const today = new Date().toISOString().split('T')[0];
        const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const body = {
            projectKey,
            name: cycleName,
            summary: description,
            description,
            plannedStartDate: today,
            plannedEndDate: nextWeek,
            issueKey,
            items: testCaseKeys.map(key => ({ testCaseKey: key })),
        };
        const response = await fetch(url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to create test cycle "${cycleName}": ${response.status} ${error}`);
        }
        const created = await response.json();
        return {
            key: created.key,
            name: cycleName,
            url: `${this.baseUrl}/secure/Tests.jspa#/v2/testrun/${created.key}`,
        };
    }
}
