import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
export class PlaywrightClient {
    projectRoot;
    testDir;
    markets = []; // Auto-detected
    testTypes = []; // Auto-detected
    constructor(config) {
        this.projectRoot = config.projectRoot;
        this.testDir = path.join(this.projectRoot, 'tests');
        // Auto-detect test structure
        this.discoverTestStructure();
    }
    /**
     * Auto-discover test types and markets from directory structure
     * This makes the MCP server adaptable to any Playwright project
     */
    discoverTestStructure() {
        try {
            if (!fs.existsSync(this.testDir)) {
                console.warn(`Test directory not found: ${this.testDir}`);
                return;
            }
            // Get all directories in tests/
            const topLevelDirs = fs.readdirSync(this.testDir, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name);
            // Detect test types (e.g., ODA, WebPortal, e2e, integration, etc.)
            this.testTypes = topLevelDirs;
            // Detect markets by scanning subdirectories
            // Common 2-letter uppercase patterns like UK, PT, GR, etc.
            const marketPattern = /^[A-Z]{2}$/;
            const discoveredMarkets = new Set();
            topLevelDirs.forEach(testType => {
                const testTypePath = path.join(this.testDir, testType);
                try {
                    const subDirs = fs.readdirSync(testTypePath, { withFileTypes: true })
                        .filter(dirent => dirent.isDirectory())
                        .map(dirent => dirent.name)
                        .filter(name => marketPattern.test(name));
                    subDirs.forEach(market => discoveredMarkets.add(market));
                }
                catch (err) {
                    // Skip if can't read subdirectories
                }
            });
            this.markets = Array.from(discoveredMarkets).sort();
            console.log(`✓ Discovered test types: ${this.testTypes.join(', ') || 'none'}`);
            console.log(`✓ Discovered markets: ${this.markets.join(', ') || 'none'}`);
        }
        catch (error) {
            console.warn('Failed to auto-discover test structure:', error);
            // No fallback - keep empty to avoid project-specific assumptions
            this.markets = [];
            this.testTypes = [];
        }
    }
    /**
     * Run Playwright tests with flexible filtering
     */
    async runTests(options) {
        const args = ['playwright', 'test'];
        // Build test path
        if (options.testPath) {
            args.push(options.testPath);
        }
        else {
            // Build path from testType and market
            if (options.testType && options.market) {
                args.push(`tests/${options.testType}/${options.market}`);
            }
            else if (options.testType) {
                args.push(`tests/${options.testType}`);
            }
            else if (options.market) {
                // Search for market in all discovered test types
                this.testTypes.forEach(testType => {
                    args.push(`tests/${testType}/${options.market}`);
                });
            }
        }
        // Add project filter
        if (options.project) {
            args.push('--project', options.project);
        }
        else if (options.testType) {
            // Try to use test type as project name (common convention)
            args.push('--project', options.testType);
        }
        // Add tag filters
        if (options.tags && options.tags.length > 0) {
            options.tags.forEach(tag => {
                args.push('--grep', tag.startsWith('@') ? tag : `@${tag}`);
            });
        }
        // Add test name filter
        if (options.testName) {
            args.push('--grep', options.testName);
        }
        // Add execution options
        if (options.headed) {
            args.push('--headed');
        }
        if (options.debug) {
            args.push('--debug');
        }
        if (options.workers) {
            args.push('--workers', options.workers.toString());
        }
        try {
            const command = `npx ${args.join(' ')}`;
            console.error(`Executing: ${command}`);
            const output = execSync(command, {
                cwd: this.projectRoot,
                encoding: 'utf-8',
                stdio: ['pipe', 'pipe', 'pipe'],
            });
            return {
                success: true,
                output: output || 'Tests completed successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                output: error.stdout || error.message
            };
        }
    }
    /**
     * Get latest test results from the report
     */
    async getTestResults() {
        try {
            const junitReport = path.join(this.projectRoot, 'playwright-junit-report', 'junit-results.xml');
            if (!fs.existsSync(junitReport)) {
                return {
                    passed: 0,
                    failed: 0,
                    skipped: 0,
                    total: 0,
                    duration: 0,
                    failures: []
                };
            }
            const content = fs.readFileSync(junitReport, 'utf-8');
            // Parse XML manually (simple parsing)
            const testsMatch = content.match(/tests="(\d+)"/);
            const failuresMatch = content.match(/failures="(\d+)"/);
            const skippedMatch = content.match(/skipped="(\d+)"/);
            const timeMatch = content.match(/time="([\d.]+)"/);
            const total = testsMatch ? parseInt(testsMatch[1]) : 0;
            const failed = failuresMatch ? parseInt(failuresMatch[1]) : 0;
            const skipped = skippedMatch ? parseInt(skippedMatch[1]) : 0;
            const passed = total - failed - skipped;
            const duration = timeMatch ? parseFloat(timeMatch[1]) : 0;
            // Extract failure details
            const failures = [];
            const failureRegex = /<testcase[^>]+name="([^"]+)"[^>]+file="([^"]+)"[^>]*>[\s\S]*?<failure[^>]*>([\s\S]*?)<\/failure>/g;
            let match;
            while ((match = failureRegex.exec(content)) !== null) {
                failures.push({
                    testName: match[1],
                    file: match[2],
                    error: match[3].replace(/<!\[CDATA\[|\]\]>/g, '').trim()
                });
            }
            return {
                passed,
                failed,
                skipped,
                total,
                duration,
                failures
            };
        }
        catch (error) {
            throw new Error(`Failed to read test results: ${error.message}`);
        }
    }
    /**
     * List all available tests with metadata
     */
    async listTests(filter) {
        try {
            let pattern = path.join(this.testDir, '**', '*.spec.ts');
            if (filter?.testType && filter?.market) {
                pattern = path.join(this.testDir, filter.testType, filter.market, '*.spec.ts');
            }
            else if (filter?.testType) {
                pattern = path.join(this.testDir, filter.testType, '**', '*.spec.ts');
            }
            else if (filter?.market) {
                pattern = path.join(this.testDir, '**', filter.market, '*.spec.ts');
            }
            const files = glob.sync(pattern.replace(/\\/g, '/'));
            const tests = [];
            for (const file of files) {
                const content = fs.readFileSync(file, 'utf-8');
                const relativePath = path.relative(this.projectRoot, file);
                // Extract test type and market from path (auto-detected structure)
                const pathParts = relativePath.split(path.sep);
                const testType = pathParts[1]; // Could be any test type folder
                const market = pathParts[2]; // Could be market code or undefined
                // Extract test names
                const testRegex = /test\(['"`]([^'"`]+)['"`]/g;
                let match;
                while ((match = testRegex.exec(content)) !== null) {
                    const testName = match[1];
                    // Extract tags from test name or description
                    const tags = [];
                    const tagMatches = testName.match(/@\w+/g);
                    if (tagMatches) {
                        tags.push(...tagMatches);
                    }
                    // Check if tags filter matches
                    if (filter?.tags && filter.tags.length > 0) {
                        const hasMatchingTag = filter.tags.some(tag => tags.includes(tag.startsWith('@') ? tag : `@${tag}`));
                        if (!hasMatchingTag)
                            continue;
                    }
                    tests.push({
                        name: testName,
                        file: relativePath,
                        market: this.markets.includes(market) ? market : undefined,
                        testType,
                        tags
                    });
                }
            }
            return tests;
        }
        catch (error) {
            throw new Error(`Failed to list tests: ${error.message}`);
        }
    }
    /**
      * Get HTML test report summary
      */
    async getTestReport() {
        try {
            const reportIndex = path.join(this.projectRoot, 'playwright-report', 'index.html');
            if (!fs.existsSync(reportIndex)) {
                return 'No test report available. Run tests first to generate a report.';
            }
            const stats = fs.statSync(reportIndex);
            const reportUrl = `file:///${reportIndex.replace(/\\/g, '/')}`;
            return `# Test Report Available

**Location:** ${reportIndex}
**Generated:** ${stats.mtime.toLocaleString()}
**Size:** ${(stats.size / 1024).toFixed(2)} KB

**Open in browser:** ${reportUrl}

To view the report, open the file in your browser or run:
\`\`\`bash
npx playwright show-report
\`\`\`
`;
        }
        catch (error) {
            throw new Error(`Failed to get test report: ${error.message}`);
        }
    }
    /**
     * Generate locator suggestions for an element description
     */
    generateLocator(elementDescription, context) {
        const suggestions = [];
        const desc = elementDescription.toLowerCase();
        // Analyze description for button/link patterns
        if (desc.includes('button') || desc.includes('btn') || desc.includes('click')) {
            const textMatch = elementDescription.match(/["']([^"']+)["']|with text\s+(\w+)/i);
            const text = textMatch ? (textMatch[1] || textMatch[2]) : '';
            if (text) {
                suggestions.push({
                    selector: `page.getByRole('button', { name: '${text}' })`,
                    strategy: 'role',
                    confidence: 'high',
                    explanation: 'Using accessible role-based locator for button'
                });
                suggestions.push({
                    selector: `page.getByText('${text}')`,
                    strategy: 'text',
                    confidence: 'medium',
                    explanation: 'Text-based locator as alternative'
                });
            }
        }
        // Input fields
        if (desc.includes('input') || desc.includes('field') || desc.includes('textbox')) {
            const labelMatch = elementDescription.match(/labeled\s+["']([^"']+)["']|for\s+(\w+)/i);
            const label = labelMatch ? (labelMatch[1] || labelMatch[2]) : '';
            if (label) {
                suggestions.push({
                    selector: `page.getByLabel('${label}')`,
                    strategy: 'role',
                    confidence: 'high',
                    explanation: 'Using label-based locator for input field'
                });
            }
            const placeholderMatch = elementDescription.match(/placeholder\s+["']([^"']+)["']/i);
            if (placeholderMatch) {
                suggestions.push({
                    selector: `page.getByPlaceholder('${placeholderMatch[1]}')`,
                    strategy: 'role',
                    confidence: 'high',
                    explanation: 'Using placeholder-based locator'
                });
            }
        }
        // Links
        if (desc.includes('link')) {
            const textMatch = elementDescription.match(/["']([^"']+)["']/);
            if (textMatch) {
                suggestions.push({
                    selector: `page.getByRole('link', { name: '${textMatch[1]}' })`,
                    strategy: 'role',
                    confidence: 'high',
                    explanation: 'Using accessible role-based locator for link'
                });
            }
        }
        // Test ID suggestions
        if (desc.includes('test-id') || desc.includes('data-testid')) {
            const idMatch = elementDescription.match(/["']([^"']+)["']/);
            if (idMatch) {
                suggestions.push({
                    selector: `page.getByTestId('${idMatch[1]}')`,
                    strategy: 'testId',
                    confidence: 'high',
                    explanation: 'Using test-id attribute (most stable)'
                });
            }
        }
        // CSS selector fallback
        if (suggestions.length === 0) {
            suggestions.push({
                selector: `page.locator('css-selector-here')`,
                strategy: 'css',
                confidence: 'low',
                explanation: 'Provide more details for better suggestions'
            });
        }
        return suggestions;
    }
    /**
     * Generate a complete test from description
     */
    generateTest(description, options) {
        const testType = options?.testType || (this.testTypes[0] || 'tests');
        const market = options?.market || '';
        const fileName = options?.fileName || 'GeneratedTest';
        // NOTE: Update fixture imports based on your project structure
        // This is a generic template - customize the imports for your project
        return `import { test, expect } from '@playwright/test';

test.describe('${description}', () => {
  test('${fileName}${market ? ` - ${market}` : ''} - ${description}', async ({ page }) => {
    // TODO: Generated test scaffolding
    // ${description}
    
    // Navigate to the application
    await page.goto('/');
    
    // Add your test steps here:
    // 1. Arrange - Set up test data and preconditions
    // 2. Act - Perform the action being tested
    // 3. Assert - Verify the expected outcome
    
    // Example steps (modify as needed):
    // await page.getByRole('button', { name: 'Next' }).click();
    // await expect(page.getByText('Success')).toBeVisible();
  });
});
`;
    }
    /**
     * Generate a Page Object class
     */
    generatePageObject(pageName, elements) {
        const className = `${pageName}Page`;
        const elementMethods = elements.map(el => {
            const methodName = el.name.replace(/\s+/g, '');
            return `  async ${methodName[0].toLowerCase()}${methodName.slice(1)}() {
    return this.page.locator('${el.selector}');
  }`;
        }).join('\n\n');
        return `import { Page, Locator } from '@playwright/test';

export class ${className} {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

${elementMethods}

  async goto() {
    await this.page.goto('/'); // Update with actual URL
  }
}
`;
    }
    /**
     * Validate locators in a test file
     */
    async validateLocators(testFilePath) {
        try {
            const fullPath = path.join(this.projectRoot, testFilePath);
            if (!fs.existsSync(fullPath)) {
                throw new Error(`Test file not found: ${testFilePath}`);
            }
            const content = fs.readFileSync(fullPath, 'utf-8');
            const locators = [];
            // Extract all locator calls
            const locatorPatterns = [
                /page\.locator\(['"`]([^'"`]+)['"`]\)/g,
                /page\.getByRole\(['"`](\w+)['"`][^)]*\)/g,
                /page\.getByText\(['"`]([^'"`]+)['"`]\)/g,
                /page\.getByTestId\(['"`]([^'"`]+)['"`]\)/g,
                /page\.getByLabel\(['"`]([^'"`]+)['"`]\)/g,
            ];
            locatorPatterns.forEach(pattern => {
                let match;
                while ((match = pattern.exec(content)) !== null) {
                    locators.push(match[0]);
                }
            });
            // Analyze locators
            const valid = [];
            const invalid = [];
            const warnings = [];
            locators.forEach(loc => {
                // Check for fragile locators
                if (loc.includes('.locator(') && /\d+/.test(loc)) {
                    warnings.push(`⚠️ ${loc} - Uses index-based selection, may be fragile`);
                }
                // Check for CSS classes
                if (loc.includes('locator(') && loc.includes('.')) {
                    warnings.push(`⚠️ ${loc} - Uses CSS classes, consider role-based locators`);
                }
                // Recommend role-based locators
                if (loc.includes('getByRole') || loc.includes('getByLabel') || loc.includes('getByTestId')) {
                    valid.push(`✅ ${loc} - Good, uses accessible/stable locator`);
                }
                else {
                    valid.push(`🔍 ${loc} - Found, consider role-based alternative`);
                }
            });
            return { valid, invalid, warnings };
        }
        catch (error) {
            throw new Error(`Failed to validate locators: ${error.message}`);
        }
    }
    /**
     * Get Playwright configuration
     */
    async getConfig() {
        try {
            const configFile = path.join(this.projectRoot, 'playwright.config.ts');
            if (!fs.existsSync(configFile)) {
                return 'Playwright configuration file not found';
            }
            const content = fs.readFileSync(configFile, 'utf-8');
            // Extract key configuration
            const projectsMatch = content.match(/projects:\s*\[[\s\S]*?\]/);
            const workersMatch = content.match(/workers:\s*(\d+)/);
            const timeoutMatch = content.match(/timeout:\s*(\d+)/);
            let summary = '# Playwright Configuration\n\n';
            summary += `**Config File:** playwright.config.ts\n\n`;
            if (workersMatch) {
                summary += `**Workers:** ${workersMatch[1]} parallel workers\n`;
            }
            if (timeoutMatch) {
                summary += `**Timeout:** ${parseInt(timeoutMatch[1]) / 1000} seconds\n`;
            }
            summary += `\n**Projects Configured:**\n`;
            summary += `- ODA (Mobile Edge)\n`;
            summary += `- WebPortal (Desktop/Tablet/Mobile)\n`;
            summary += `\n**Markets:** ${this.markets.join(', ')}\n`;
            return summary;
        }
        catch (error) {
            throw new Error(`Failed to get config: ${error.message}`);
        }
    }
    /**
     * Format test results for display
     */
    formatTestResults(results) {
        const passRate = results.total > 0 ? ((results.passed / results.total) * 100).toFixed(1) : '0.0';
        let output = `# Test Execution Results\n\n`;
        output += `**Summary:**\n`;
        output += `- ✅ Passed: ${results.passed}\n`;
        output += `- ❌ Failed: ${results.failed}\n`;
        output += `- ⏭️  Skipped: ${results.skipped}\n`;
        output += `- 📊 Total: ${results.total}\n`;
        output += `- 📈 Pass Rate: ${passRate}%\n`;
        output += `- ⏱️  Duration: ${results.duration.toFixed(2)}s\n\n`;
        if (results.failures.length > 0) {
            output += `**Failures:**\n\n`;
            results.failures.forEach((failure, index) => {
                output += `${index + 1}. **${failure.testName}**\n`;
                output += `   File: ${failure.file}\n`;
                output += `   Error: ${failure.error.substring(0, 200)}...\n\n`;
            });
        }
        return output;
    }
}
//# sourceMappingURL=playwright-client.js.map