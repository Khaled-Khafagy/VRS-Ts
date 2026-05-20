export class ZephyrClient {
    baseUrl;
    headers;
    constructor(baseUrl, pat) {
        this.baseUrl = baseUrl.replace(/\/$/, '');
        this.headers = {
            'Authorization': `Bearer ${pat}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Atlassian-Token': 'no-check',
        };
    }
    async listFolders(projectKey) {
        const params = projectKey ? `?projectKey=${encodeURIComponent(projectKey)}` : '';
        const url = `${this.baseUrl}/rest/atm/1.0/folder/search${params}`;
        const response = await fetch(url, { headers: this.headers });
        if (!response.ok)
            return [];
        const data = await response.json();
        const folders = data.map(f => ({
            id: String(f.id ?? ''),
            name: f.name ?? '',
            path: f.path ?? `/${f.name}`,
            parentId: f.parentId ? String(f.parentId) : undefined,
            children: [],
        }));
        // Build tree
        const map = new Map(folders.map(f => [f.id, f]));
        const roots = [];
        for (const folder of folders) {
            if (folder.parentId && map.has(folder.parentId)) {
                map.get(folder.parentId).children.push(folder);
            }
            else {
                roots.push(folder);
            }
        }
        return roots;
    }
    /**
     * Ensure a folder exists in Zephyr Scale for the given type.
     * Creates each level of the path hierarchy if it doesn't exist.
     * Uses the same approach as the Python implementation: POST with full path as name.
     */
    async ensureFolder(projectKey, folderPath, type = 'TEST_CASE') {
        if (!folderPath || folderPath === '/')
            return true;
        let path = folderPath.trim().replace(/\/$/, '');
        if (!path.startsWith('/'))
            path = '/' + path;
        // Get existing folders
        const listUrl = `${this.baseUrl}/rest/atm/1.0/folder/search?projectKey=${encodeURIComponent(projectKey)}`;
        const listResponse = await fetch(listUrl, { headers: this.headers });
        const existingFolders = new Map();
        if (listResponse.ok) {
            const folders = await listResponse.json();
            for (const f of folders) {
                if (f.path)
                    existingFolders.set(f.path.trim(), String(f.id));
            }
        }
        if (existingFolders.has(path))
            return true;
        const parts = path.split('/').filter(Boolean);
        let currentPath = '';
        for (const part of parts) {
            currentPath += '/' + part;
            if (existingFolders.has(currentPath))
                continue;
            const createUrl = `${this.baseUrl}/rest/atm/1.0/folder`;
            const body = { projectKey, name: currentPath, type };
            const res = await fetch(createUrl, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(body),
            });
            if (res.ok) {
                const created = await res.json();
                existingFolders.set(currentPath, String(created.id));
            }
            else {
                const text = await res.text();
                if (res.status === 400 || res.status === 409) {
                    // Already exists — treat as success
                    continue;
                }
                throw new Error(`Failed to create folder "${currentPath}": ${res.status} ${text}`);
            }
        }
        return true;
    }
    /**
     * Create a test case in Zephyr Scale, then link it to the requirement via a separate PUT.
     * The Python implementation specifically uses a 2-call approach to avoid TRACE_LINK.TYPE.UNDEFINED bugs.
     */
    async createTestCase(projectKey, tc, requirementKey, folderPath) {
        const url = `${this.baseUrl}/rest/atm/1.0/testcase`;
        const steps = tc.steps.map((step, i) => ({
            description: step.replace(/^\d+\.\s*/, ''),
            testData: '',
            expectedResult: i === tc.steps.length - 1 ? tc.expected_result : '',
        }));
        const body = {
            projectKey,
            name: tc.title,
            objective: `Type: ${tc.type.toUpperCase()}\n\nExpected Result:\n${tc.expected_result}`,
            priority: 'Normal',
            testScript: {
                type: 'STEP_BY_STEP',
                steps,
            },
        };
        if (folderPath) {
            const cleanPath = folderPath.trim().replace(/\/$/, '');
            body.folder = cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath;
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to create test case "${tc.title}": ${response.status} ${error}`);
        }
        const created = await response.json();
        const testKey = created.key;
        // Separately link the test case to the requirement (2-call approach)
        await this.linkTestCaseToRequirement(testKey, requirementKey);
        return {
            key: testKey,
            name: tc.title,
            url: `${this.baseUrl}/secure/Tests.jspa#/v2/testCase/${testKey}`,
        };
    }
    /** PUT /rest/atm/1.0/testcase/{key} to set issueLinks. */
    async linkTestCaseToRequirement(testCaseKey, requirementKey) {
        const url = `${this.baseUrl}/rest/atm/1.0/testcase/${testCaseKey}`;
        const body = { issueLinks: [requirementKey] };
        const response = await fetch(url, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            // Non-fatal: log but don't throw
            process.stderr.write(`Warning: Could not link ${testCaseKey} to ${requirementKey}: ${response.status}\n`);
        }
    }
    async createTestCycle(projectKey, cycleName, testCaseKeys, issueKey, assigneeEmail, folderPath) {
        const url = `${this.baseUrl}/rest/atm/1.0/testrun`;
        const body = {
            projectKey,
            name: cycleName,
            items: testCaseKeys.map(key => ({ testCaseKey: key })),
        };
        if (issueKey)
            body.issueKey = issueKey;
        if (folderPath) {
            const cleanPath = folderPath.trim().replace(/\/$/, '');
            body.folder = cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath;
        }
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
    async createTestPlan(projectKey, planName, cycleKey, issueKey, folderPath) {
        const url = `${this.baseUrl}/rest/atm/1.0/testplan`;
        const body = {
            projectKey,
            name: planName,
            testRunKeys: [cycleKey],
        };
        if (issueKey)
            body.issueLinks = [issueKey];
        if (folderPath) {
            const cleanPath = folderPath.trim().replace(/\/$/, '');
            body.folder = cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath;
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to create test plan "${planName}": ${response.status} ${error}`);
        }
        const created = await response.json();
        return {
            key: created.key,
            name: planName,
            url: `${this.baseUrl}/secure/Tests.jspa#/v2/testplan/${created.key}`,
        };
    }
}
