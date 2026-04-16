export interface PlaywrightConfig {
    projectRoot: string;
}
export interface TestExecutionOptions {
    testPath?: string;
    testName?: string;
    market?: string;
    testType?: string;
    tags?: string[];
    project?: string;
    headed?: boolean;
    debug?: boolean;
    workers?: number;
}
export interface TestResult {
    passed: number;
    failed: number;
    skipped: number;
    total: number;
    duration: number;
    failures: Array<{
        testName: string;
        error: string;
        file: string;
    }>;
}
export interface TestInfo {
    name: string;
    file: string;
    market?: string;
    testType?: string;
    tags?: string[];
    line?: number;
}
export interface LocatorSuggestion {
    selector: string;
    strategy: 'role' | 'text' | 'testId' | 'css';
    confidence: 'high' | 'medium' | 'low';
    explanation: string;
}
export declare class PlaywrightClient {
    private projectRoot;
    private testDir;
    private markets;
    private testTypes;
    constructor(config: PlaywrightConfig);
    /**
     * Auto-discover test types and markets from directory structure
     * This makes the MCP server adaptable to any Playwright project
     */
    private discoverTestStructure;
    /**
     * Run Playwright tests with flexible filtering
     */
    runTests(options: TestExecutionOptions): Promise<{
        success: boolean;
        output: string;
    }>;
    /**
     * Get latest test results from the report
     */
    getTestResults(): Promise<TestResult>;
    /**
     * List all available tests with metadata
     */
    listTests(filter?: {
        market?: string;
        testType?: string;
        tags?: string[];
    }): Promise<TestInfo[]>;
    /**
      * Get HTML test report summary
      */
    getTestReport(): Promise<string>;
    /**
     * Generate locator suggestions for an element description
     */
    generateLocator(elementDescription: string, context?: string): LocatorSuggestion[];
    /**
     * Generate a complete test from description
     */
    generateTest(description: string, options?: {
        testType?: string;
        market?: string;
        fileName?: string;
    }): string;
    /**
     * Generate a Page Object class
     */
    generatePageObject(pageName: string, elements: Array<{
        name: string;
        selector: string;
    }>): string;
    /**
     * Validate locators in a test file
     */
    validateLocators(testFilePath: string): Promise<{
        valid: string[];
        invalid: string[];
        warnings: string[];
    }>;
    /**
     * Get Playwright configuration
     */
    getConfig(): Promise<string>;
    /**
     * Format test results for display
     */
    formatTestResults(results: TestResult): string;
}
//# sourceMappingURL=playwright-client.d.ts.map