import axios from 'axios';
export class ZephyrScaleClient {
    client;
    baseURL;
    constructor(config) {
        this.baseURL = config.url;
        this.client = this.createAxiosClient(config);
    }
    createAxiosClient(config) {
        let headers = {
            'Content-Type': 'application/json',
        };
        if (config.type === 'server' && config.auth.type === 'server') {
            if (config.auth.pat) {
                headers['Authorization'] = `Bearer ${config.auth.pat}`;
            }
            else if (config.auth.username && config.auth.password) {
                const credentials = Buffer.from(`${config.auth.username}:${config.auth.password}`).toString('base64');
                headers['Authorization'] = `Basic ${credentials}`;
            }
        }
        return axios.create({
            baseURL: `${this.baseURL}/rest/atm/1.0`,
            headers,
            timeout: 30000,
        });
    }
    /**
     * Get all folders for a project
     */
    async getFolders(projectKey) {
        try {
            const response = await this.client.get(`/folder?projectKey=${projectKey}`);
            return response.data;
        }
        catch (error) {
            return [];
        }
    }
    /**
     * Find the closest existing parent folder for a given path
     */
    async findClosestExistingFolder(projectKey, folderPath) {
        if (!folderPath)
            return null;
        try {
            const allFolders = await this.getFolders(projectKey);
            // Try exact match first
            if (allFolders.find((f) => f.name === folderPath)) {
                return folderPath;
            }
            // Try parent paths
            const parts = folderPath.split('/').filter(p => p);
            for (let i = parts.length - 1; i >= 0; i--) {
                const testPath = '/' + parts.slice(0, i).join('/');
                if (allFolders.find((f) => f.name === testPath)) {
                    console.log(`📁 Folder "${folderPath}" not found, using existing parent: "${testPath}"`);
                    return testPath;
                }
            }
            return null;
        }
        catch (error) {
            return null;
        }
    }
    /**
     * Get folder ID by path, returns null if not found
     */
    async getFolderIdByPath(projectKey, folderPath) {
        try {
            const response = await this.client.get(`/folder?projectKey=${projectKey}`);
            const folders = response.data;
            const folder = folders.find((f) => f.name === folderPath);
            return folder ? folder.id : null;
        }
        catch (error) {
            return null;
        }
    }
    /**
     * Ensure folder exists - finds closest parent if exact path doesn't exist
     * Note: Zephyr Scale API doesn't support folder creation, so folders must be created manually in Jira UI
     */
    async ensureFolderExists(projectKey, folderPath) {
        if (!folderPath)
            return null;
        try {
            // Find the closest existing folder
            const existingPath = await this.findClosestExistingFolder(projectKey, folderPath);
            if (existingPath) {
                const folderId = await this.getFolderIdByPath(projectKey, existingPath);
                if (folderId) {
                    if (existingPath !== folderPath) {
                        console.log(`⚠️  Using closest available folder: "${existingPath}"`);
                        console.log(`   To use exact folder, create it manually in Jira: "${folderPath}"`);
                    }
                    return folderId;
                }
            }
            console.log(`⚠️  No matching folders found for: "${folderPath}"`);
            console.log(`   Test case will be created in project root.`);
            console.log(`   Create folders manually in: ${this.baseURL}/projects/${projectKey}?selectedItem=com.kanoah.test-manager:test-case-folders`);
            return null;
        }
        catch (error) {
            return null;
        }
    }
    /**
     * Create a new test case in Zephyr Scale
     */
    async createTestCase(params) {
        try {
            const payload = {
                projectKey: params.projectKey,
                name: params.name,
                objective: params.objective,
                precondition: params.precondition,
                priority: params.priority || 'Normal',
            };
            // Handle folder - ensure it exists if specified
            if (params.folder) {
                const folderId = await this.ensureFolderExists(params.projectKey, params.folder);
                if (folderId) {
                    payload.folderId = folderId;
                }
            }
            if (params.labels && params.labels.length > 0) {
                payload.labels = params.labels;
            }
            if (params.component) {
                payload.component = params.component;
            }
            if (params.customFields) {
                payload.customFields = params.customFields;
            }
            if (params.testScript) {
                payload.testScript = params.testScript;
            }
            const response = await this.client.post('/testcase', payload);
            return response.data;
        }
        catch (error) {
            if (error.response) {
                throw new Error(`Zephyr API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
            }
            throw new Error(`Failed to create test case: ${error.message}`);
        }
    }
    /**
     * Get test case details by key
     */
    async getTestCase(testCaseKey) {
        try {
            const response = await this.client.get(`/testcase/${testCaseKey}`);
            return response.data;
        }
        catch (error) {
            if (error.response) {
                throw new Error(`Zephyr API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
            }
            throw new Error(`Failed to get test case: ${error.message}`);
        }
    }
    /**
     * Update an existing test case
     */
    async updateTestCase(testCaseKey, updates) {
        try {
            const payload = { ...updates };
            // Handle folder - ensure it exists if specified
            if (updates.folder && updates.projectKey) {
                const folderId = await this.ensureFolderExists(updates.projectKey, updates.folder);
                if (folderId) {
                    payload.folderId = folderId;
                    delete payload.folder; // Remove folder path, use folderId instead
                }
            }
            const response = await this.client.put(`/testcase/${testCaseKey}`, payload);
            return response.data;
        }
        catch (error) {
            if (error.response) {
                throw new Error(`Zephyr API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
            }
            throw new Error(`Failed to update test case: ${error.message}`);
        }
    }
    /**
     * Link test case to a Jira issue (story, bug, etc.) via Traceability/Coverage
     * This creates a proper traceability link that appears in the Coverage section
     */
    async linkTestCaseToIssue(testCaseKey, issueKey) {
        try {
            // Use PUT with issueLinks field for traceability linking
            // This creates proper coverage links visible in the Coverage section
            await this.client.put(`/testcase/${testCaseKey}`, {
                issueLinks: [issueKey],
            });
        }
        catch (error) {
            if (error.response) {
                throw new Error(`Zephyr API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
            }
            throw new Error(`Failed to link test case: ${error.message}`);
        }
    }
    /**
     * Get test executions for a test case
     */
    async getTestExecutions(testCaseKey) {
        try {
            const response = await this.client.get(`/testcase/${testCaseKey}/testresults`);
            return response.data;
        }
        catch (error) {
            if (error.response) {
                throw new Error(`Zephyr API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
            }
            throw new Error(`Failed to get test executions: ${error.message}`);
        }
    }
    /**
     * Format test case for display
     */
    formatTestCase(testCase) {
        const lines = [
            `# ${testCase.key}: ${testCase.name}`,
            '',
            `**Project:** ${testCase.projectKey}`,
            `**Priority:** ${testCase.priority || 'Normal'}`,
            `**Status:** ${testCase.status || 'Draft'}`,
        ];
        if (testCase.objective) {
            lines.push('');
            lines.push('## Objective');
            lines.push(testCase.objective);
        }
        if (testCase.precondition) {
            lines.push('');
            lines.push('## Preconditions');
            lines.push(testCase.precondition);
        }
        if (testCase.testScript && testCase.testScript.steps) {
            lines.push('');
            lines.push('## Test Steps');
            testCase.testScript.steps.forEach((step, index) => {
                lines.push('');
                lines.push(`### Step ${index + 1}: ${step.description}`);
                if (step.testData) {
                    lines.push(`**Test Data:** ${step.testData}`);
                }
                lines.push(`**Expected Result:** ${step.expectedResult}`);
            });
        }
        if (testCase.labels && testCase.labels.length > 0) {
            lines.push('');
            lines.push(`**Labels:** ${testCase.labels.join(', ')}`);
        }
        return lines.join('\n');
    }
}
//# sourceMappingURL=zephyr-client.js.map