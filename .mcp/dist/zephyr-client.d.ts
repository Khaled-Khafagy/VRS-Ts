import type { JiraConfig } from './types.js';
export interface ZephyrTestCase {
    id?: string;
    key?: string;
    projectKey: string;
    name: string;
    objective?: string;
    precondition?: string;
    priority?: 'Normal' | 'High' | 'Low';
    status?: string;
    folder?: string;
    labels?: string[];
    component?: string;
    customFields?: Record<string, any>;
}
export interface TestStep {
    description: string;
    testData?: string;
    expectedResult: string;
}
export interface CreateTestCaseParams extends ZephyrTestCase {
    testScript?: {
        type: 'STEP_BY_STEP' | 'PLAIN_TEXT';
        steps?: TestStep[];
        text?: string;
    };
}
export interface TestExecution {
    id: string;
    key: string;
    testCaseKey: string;
    status: 'Pass' | 'Fail' | 'Blocked' | 'Not Executed';
    executedById?: string;
    assignedToId?: string;
    comment?: string;
}
export declare class ZephyrScaleClient {
    private client;
    private baseURL;
    constructor(config: JiraConfig);
    private createAxiosClient;
    /**
     * Get all folders for a project
     */
    getFolders(projectKey: string): Promise<any[]>;
    /**
     * Find the closest existing parent folder for a given path
     */
    findClosestExistingFolder(projectKey: string, folderPath: string): Promise<string | null>;
    /**
     * Get folder ID by path, returns null if not found
     */
    getFolderIdByPath(projectKey: string, folderPath: string): Promise<number | null>;
    /**
     * Ensure folder exists - finds closest parent if exact path doesn't exist
     * Note: Zephyr Scale API doesn't support folder creation, so folders must be created manually in Jira UI
     */
    ensureFolderExists(projectKey: string, folderPath: string): Promise<number | null>;
    /**
     * Create a new test case in Zephyr Scale
     */
    createTestCase(params: CreateTestCaseParams): Promise<ZephyrTestCase>;
    /**
     * Get test case details by key
     */
    getTestCase(testCaseKey: string): Promise<ZephyrTestCase>;
    /**
     * Update an existing test case
     */
    updateTestCase(testCaseKey: string, updates: Partial<CreateTestCaseParams>): Promise<ZephyrTestCase>;
    /**
     * Link test case to a Jira issue (story, bug, etc.) via Traceability/Coverage
     * This creates a proper traceability link that appears in the Coverage section
     */
    linkTestCaseToIssue(testCaseKey: string, issueKey: string): Promise<void>;
    /**
     * Get test executions for a test case
     */
    getTestExecutions(testCaseKey: string): Promise<TestExecution[]>;
    /**
     * Format test case for display
     */
    formatTestCase(testCase: any): string;
}
//# sourceMappingURL=zephyr-client.d.ts.map