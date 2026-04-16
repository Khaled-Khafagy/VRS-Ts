#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { JiraClient } from './jira-client.js';
import { ZephyrScaleClient } from './zephyr-client.js';
import { AzureDevOpsClient } from './azure-devops-client.js';
import { PlaywrightClient } from './playwright-client.js';
import { FigmaClient } from './figma-client.js';
import { WireMockStudioClient } from './wiremock-client.js';
// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load environment variables from .mcp directory (one level up from dist/)
dotenv.config({ path: path.join(__dirname, '../.env') });
// Validate and create Jira configuration (Server only, token authentication)
function createJiraConfig() {
    const url = process.env.JIRA_SERVER_URL;
    const token = process.env.JIRA_SERVER_TOKEN;
    if (!url) {
        throw new Error('JIRA_SERVER_URL is required');
    }
    if (!token) {
        throw new Error('JIRA_SERVER_TOKEN is required');
    }
    const auth = {
        type: 'server',
        pat: token,
    };
    return { type: 'server', url, auth };
}
// Initialize Jira client
let jiraClient;
let zephyrClient;
try {
    const config = createJiraConfig();
    jiraClient = new JiraClient(config);
    zephyrClient = new ZephyrScaleClient(config);
    console.error(`Jira Server MCP initialized at ${config.url}`);
    console.error(`Zephyr Scale client initialized`);
}
catch (error) {
    console.error(`Failed to initialize Jira client: ${error.message}`);
    process.exit(1);
}
// Initialize Azure DevOps client
let azureDevOpsClient = null;
try {
    const azureOrgUrl = process.env.AZURE_DEVOPS_ORG_URL;
    const azureToken = process.env.AZURE_DEVOPS_TOKEN;
    const azureProject = process.env.AZURE_DEVOPS_PROJECT;
    if (azureOrgUrl && azureToken && azureProject) {
        azureDevOpsClient = new AzureDevOpsClient({
            organizationUrl: azureOrgUrl,
            token: azureToken,
            project: azureProject,
        });
        console.error(`Azure DevOps client initialized for project ${azureProject}`);
    }
    else {
        console.error('Azure DevOps configuration not found - Azure DevOps features will be disabled');
    }
}
catch (error) {
    console.error(`Failed to initialize Azure DevOps client: ${error.message}`);
}
// Initialize Playwright client
let playwrightClient = null;
try {
    // Use environment variable path or default to parent directory
    // Default: assumes Playwright project is 2 levels up from MCP server (common setup)
    const defaultPath = path.join(__dirname, '../../../');
    const projectRoot = process.env.PLAYWRIGHT_PROJECT_PATH || defaultPath;
    playwrightClient = new PlaywrightClient({ projectRoot });
    console.error(`✓ Playwright client initialized for project at ${projectRoot}`);
}
catch (error) {
    console.error(`! Playwright client not initialized: ${error.message}`);
    console.error(`  Set PLAYWRIGHT_PROJECT_PATH in .env to enable Playwright tools`);
}
// Initialize Figma client
let figmaClient = null;
try {
    const figmaToken = process.env.FIGMA_ACCESS_TOKEN;
    if (figmaToken) {
        figmaClient = new FigmaClient({ accessToken: figmaToken });
        console.error(`✓ Figma client initialized`);
    }
    else {
        console.error('! Figma configuration not found - Figma features will be disabled');
        console.error('  Set FIGMA_ACCESS_TOKEN in .env to enable Figma tools');
    }
}
catch (error) {
    console.error(`! Failed to initialize Figma client: ${error.message}`);
}
// Initialize WireMock Studio client
let wiremockClient = null;
try {
    const wiremockUrl = process.env.WIREMOCK_STUDIO_URL;
    const wiremockToken = process.env.WIREMOCK_STUDIO_TOKEN;
    const defaultService = process.env.WIREMOCK_DEFAULT_SERVICE;
    if (wiremockUrl) {
        wiremockClient = new WireMockStudioClient(wiremockUrl, wiremockToken // Optional - undefined if not set
        );
        if (wiremockToken) {
            console.error(`✓ WireMock Studio client initialized (with authentication)`);
        }
        else {
            console.error(`✓ WireMock Studio client initialized (no authentication - internal network)`);
        }
        if (defaultService) {
            console.error(`✓ WireMock default service: ${defaultService}`);
        }
    }
    else {
        console.error('! WireMock Studio configuration not found - WireMock features will be disabled');
        console.error('  Set WIREMOCK_STUDIO_URL in .env to enable WireMock tools');
    }
}
catch (error) {
    console.error(`! Failed to initialize WireMock Studio client: ${error.message}`);
}
// Define available tools
const TOOLS = [
    {
        name: 'get_jira_issue',
        description: 'Retrieve detailed information about a Jira issue by its key (e.g., PROJ-123). Returns comprehensive issue details including status, assignee, description, comments, and more.',
        inputSchema: {
            type: 'object',
            properties: {
                issueKey: {
                    type: 'string',
                    description: 'The Jira issue key (e.g., PROJ-123, TEAM-456)',
                    pattern: '^[A-Z]+-[0-9]+$',
                },
                expand: {
                    type: 'array',
                    description: 'Optional fields to expand in the response (e.g., changelog, renderedFields, comments)',
                    items: {
                        type: 'string',
                        enum: ['changelog', 'renderedFields', 'comments', 'names', 'schema', 'transitions', 'operations', 'editmeta'],
                    },
                },
            },
            required: ['issueKey'],
        },
    },
    {
        name: 'create_zephyr_test_case',
        description: 'Create a new test case in Zephyr Scale with test steps, preconditions, and other details.',
        inputSchema: {
            type: 'object',
            properties: {
                projectKey: {
                    type: 'string',
                    description: 'The Jira project key (e.g., WEBP)',
                },
                name: {
                    type: 'string',
                    description: 'Test case name/summary',
                },
                objective: {
                    type: 'string',
                    description: 'Test objective/description (what the test validates)',
                },
                precondition: {
                    type: 'string',
                    description: 'Preconditions required before executing the test',
                },
                priority: {
                    type: 'string',
                    enum: ['Low', 'Normal', 'High'],
                    description: 'Test case priority',
                },
                labels: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Labels/tags for categorization',
                },
                steps: {
                    type: 'array',
                    description: 'Test steps with expected results',
                    items: {
                        type: 'object',
                        properties: {
                            description: {
                                type: 'string',
                                description: 'Step description/action',
                            },
                            testData: {
                                type: 'string',
                                description: 'Test data to use (optional)',
                            },
                            expectedResult: {
                                type: 'string',
                                description: 'Expected result for this step',
                            },
                        },
                        required: ['description', 'expectedResult'],
                    },
                },
            },
            required: ['projectKey', 'name'],
        },
    },
    {
        name: 'get_zephyr_test_case',
        description: 'Retrieve detailed information about a Zephyr test case by its key.',
        inputSchema: {
            type: 'object',
            properties: {
                testCaseKey: {
                    type: 'string',
                    description: 'The test case key (e.g., WEBP-T123)',
                    pattern: '^[A-Z]+-T[0-9]+$',
                },
            },
            required: ['testCaseKey'],
        },
    },
    {
        name: 'update_zephyr_test_case',
        description: 'Update an existing Zephyr test case with new information.',
        inputSchema: {
            type: 'object',
            properties: {
                testCaseKey: {
                    type: 'string',
                    description: 'The test case key to update (e.g., WEBP-T123)',
                    pattern: '^[A-Z]+-T[0-9]+$',
                },
                name: {
                    type: 'string',
                    description: 'Updated test case name',
                },
                objective: {
                    type: 'string',
                    description: 'Updated objective',
                },
                precondition: {
                    type: 'string',
                    description: 'Updated preconditions',
                },
                priority: {
                    type: 'string',
                    enum: ['Low', 'Normal', 'High'],
                    description: 'Updated priority',
                },
                labels: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Updated labels',
                },
            },
            required: ['testCaseKey'],
        },
    },
    {
        name: 'link_test_to_issue',
        description: 'Link a Zephyr test case to a Jira issue (story, bug, etc.).',
        inputSchema: {
            type: 'object',
            properties: {
                testCaseKey: {
                    type: 'string',
                    description: 'The test case key (e.g., WEBP-T123)',
                    pattern: '^[A-Z]+-T[0-9]+$',
                },
                issueKey: {
                    type: 'string',
                    description: 'The Jira issue key to link to (e.g., WEBP-13495)',
                    pattern: '^[A-Z]+-[0-9]+$',
                },
            },
            required: ['testCaseKey', 'issueKey'],
        },
    },
    {
        name: 'get_test_executions',
        description: 'Get test execution results for a specific test case.',
        inputSchema: {
            type: 'object',
            properties: {
                testCaseKey: {
                    type: 'string',
                    description: 'The test case key (e.g., WEBP-T123)',
                    pattern: '^[A-Z]+-T[0-9]+$',
                },
            },
            required: ['testCaseKey'],
        },
    },
    {
        name: 'list_zephyr_folders',
        description: 'List all available test case folders in Zephyr Scale for a project. Use this to see what folder paths exist before creating test cases. Note: Folders must be created manually in Jira UI.',
        inputSchema: {
            type: 'object',
            properties: {
                projectKey: {
                    type: 'string',
                    description: 'The Jira project key (e.g., WEBP)',
                },
            },
            required: ['projectKey'],
        },
    },
    {
        name: 'add_jira_comment',
        description: 'Add a comment to a Jira issue. This operation requires user approval before posting the comment. The comment will be previewed first, and you must confirm before it is added to the issue.',
        inputSchema: {
            type: 'object',
            properties: {
                issueKey: {
                    type: 'string',
                    description: 'The Jira issue key (e.g., WEBP-13734)',
                    pattern: '^[A-Z]+-[0-9]+$',
                },
                comment: {
                    type: 'string',
                    description: 'The comment text to add to the issue. Supports Jira markup formatting.',
                },
            },
            required: ['issueKey', 'comment'],
        },
    },
    {
        name: 'azure_list_repositories',
        description: 'List all repositories in the Azure DevOps project.',
        inputSchema: {
            type: 'object',
            properties: {},
        },
    },
    {
        name: 'azure_get_repository',
        description: 'Get details about a specific repository.',
        inputSchema: {
            type: 'object',
            properties: {
                repositoryId: {
                    type: 'string',
                    description: 'Repository name or ID',
                },
            },
            required: ['repositoryId'],
        },
    },
    {
        name: 'azure_list_pull_requests',
        description: 'List pull requests in a repository.',
        inputSchema: {
            type: 'object',
            properties: {
                repositoryId: {
                    type: 'string',
                    description: 'Repository name or ID',
                },
                status: {
                    type: 'string',
                    enum: ['active', 'completed', 'abandoned', 'all'],
                    description: 'Filter by PR status (default: active)',
                },
                top: {
                    type: 'number',
                    description: 'Maximum number of PRs to return (default: 50)',
                },
            },
            required: ['repositoryId'],
        },
    },
    {
        name: 'azure_get_pull_request',
        description: 'Get detailed information about a specific pull request.',
        inputSchema: {
            type: 'object',
            properties: {
                repositoryId: {
                    type: 'string',
                    description: 'Repository name or ID',
                },
                pullRequestId: {
                    type: 'number',
                    description: 'Pull request ID',
                },
            },
            required: ['repositoryId', 'pullRequestId'],
        },
    },
    {
        name: 'azure_create_pull_request',
        description: 'Create a new pull request.',
        inputSchema: {
            type: 'object',
            properties: {
                repositoryId: {
                    type: 'string',
                    description: 'Repository name or ID',
                },
                sourceBranch: {
                    type: 'string',
                    description: 'Source branch name (without refs/heads/)',
                },
                targetBranch: {
                    type: 'string',
                    description: 'Target branch name (without refs/heads/)',
                },
                title: {
                    type: 'string',
                    description: 'PR title',
                },
                description: {
                    type: 'string',
                    description: 'PR description',
                },
                reviewers: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Array of reviewer IDs',
                },
            },
            required: ['repositoryId', 'sourceBranch', 'targetBranch', 'title'],
        },
    },
    {
        name: 'azure_add_pr_comment',
        description: 'Add a comment to a pull request.',
        inputSchema: {
            type: 'object',
            properties: {
                repositoryId: {
                    type: 'string',
                    description: 'Repository name or ID',
                },
                pullRequestId: {
                    type: 'number',
                    description: 'Pull request ID',
                },
                comment: {
                    type: 'string',
                    description: 'Comment text',
                },
            },
            required: ['repositoryId', 'pullRequestId', 'comment'],
        },
    },
    {
        name: 'azure_update_pull_request',
        description: 'Update a pull request status (complete, abandon, or reactivate).',
        inputSchema: {
            type: 'object',
            properties: {
                repositoryId: {
                    type: 'string',
                    description: 'Repository name or ID',
                },
                pullRequestId: {
                    type: 'number',
                    description: 'Pull request ID',
                },
                status: {
                    type: 'string',
                    enum: ['active', 'completed', 'abandoned'],
                    description: 'New status for the PR',
                },
                mergeCommitMessage: {
                    type: 'string',
                    description: 'Custom merge commit message (for completed status)',
                },
            },
            required: ['repositoryId', 'pullRequestId', 'status'],
        },
    },
    {
        name: 'azure_vote_pull_request',
        description: 'Vote on a pull request (approve, approve with suggestions, wait for author, or reject). Can optionally update PR status based on vote.',
        inputSchema: {
            type: 'object',
            properties: {
                repositoryId: {
                    type: 'string',
                    description: 'Repository name or ID',
                },
                pullRequestId: {
                    type: 'number',
                    description: 'Pull request ID',
                },
                vote: {
                    type: 'string',
                    enum: ['approve', 'approve-with-suggestions', 'no-vote', 'wait-for-author', 'reject'],
                    description: 'Vote type: approve (10), approve-with-suggestions (5), no-vote (0), wait-for-author (-5), reject (-10)',
                },
                updateStatus: {
                    type: 'boolean',
                    description: 'Automatically update PR status based on vote (reject -> abandoned, wait-for-author -> active)',
                },
            },
            required: ['repositoryId', 'pullRequestId', 'vote'],
        },
    },
    {
        name: 'azure_list_branches',
        description: 'List branches in a repository.',
        inputSchema: {
            type: 'object',
            properties: {
                repositoryId: {
                    type: 'string',
                    description: 'Repository name or ID',
                },
            },
            required: ['repositoryId'],
        },
    },
    {
        name: 'azure_get_commits',
        description: 'Get recent commits from a repository.',
        inputSchema: {
            type: 'object',
            properties: {
                repositoryId: {
                    type: 'string',
                    description: 'Repository name or ID',
                },
                branch: {
                    type: 'string',
                    description: 'Branch name (optional)',
                },
                top: {
                    type: 'number',
                    description: 'Maximum number of commits to return (default: 50)',
                },
            },
            required: ['repositoryId'],
        },
    },
    {
        name: 'playwright_run_tests',
        description: 'Run Playwright tests with flexible filtering by file path, market, test type, tags, or test name.',
        inputSchema: {
            type: 'object',
            properties: {
                testPath: {
                    type: 'string',
                    description: 'Specific test file path (e.g., "tests/ODA/UK/PurchaseFlow.spec.ts")',
                },
                testName: {
                    type: 'string',
                    description: 'Test name to run (grep filter)',
                },
                market: {
                    type: 'string',
                    enum: ['UK', 'PT', 'IE', 'GR', 'NL', 'CZ', 'ES', 'IT', 'RO'],
                    description: 'Market to run tests for',
                },
                testType: {
                    type: 'string',
                    enum: ['ODA', 'WebPortal'],
                    description: 'Test type (ODA or WebPortal)',
                },
                tags: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Tags to filter tests (e.g., ["@Sanity", "@Regression"])',
                },
                project: {
                    type: 'string',
                    description: 'Playwright project name to run',
                },
                headed: {
                    type: 'boolean',
                    description: 'Run tests in headed mode (show browser)',
                },
                debug: {
                    type: 'boolean',
                    description: 'Run tests in debug mode',
                },
                workers: {
                    type: 'number',
                    description: 'Number of parallel workers',
                },
            },
        },
    },
    {
        name: 'playwright_get_test_results',
        description: 'Get the latest test execution results with pass/fail statistics and failure details.',
        inputSchema: {
            type: 'object',
            properties: {},
        },
    },
    {
        name: 'playwright_list_tests',
        description: 'List all available Playwright tests with optional filtering by market, test type, or tags.',
        inputSchema: {
            type: 'object',
            properties: {
                market: {
                    type: 'string',
                    enum: ['UK', 'PT', 'IE', 'GR', 'NL', 'CZ', 'ES', 'IT', 'RO'],
                    description: 'Filter by market',
                },
                testType: {
                    type: 'string',
                    enum: ['ODA', 'WebPortal'],
                    description: 'Filter by test type',
                },
                tags: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Filter by tags',
                },
            },
        },
    },
    {
        name: 'playwright_get_test_report',
        description: 'Get information about the HTML test report location and how to open it.',
        inputSchema: {
            type: 'object',
            properties: {},
        },
    },
    {
        name: 'playwright_generate_test',
        description: 'Generate a complete Playwright test file from a description.',
        inputSchema: {
            type: 'object',
            properties: {
                description: {
                    type: 'string',
                    description: 'Description of what the test should do',
                },
                testType: {
                    type: 'string',
                    enum: ['ODA', 'WebPortal'],
                    description: 'Test type (ODA or WebPortal)',
                },
                market: {
                    type: 'string',
                    enum: ['UK', 'PT', 'IE', 'GR', 'NL', 'CZ', 'ES', 'IT', 'RO'],
                    description: 'Market for the test',
                },
                fileName: {
                    type: 'string',
                    description: 'Name for the test file',
                },
            },
            required: ['description'],
        },
    },
    {
        name: 'playwright_generate_locator',
        description: 'Generate Playwright locator suggestions for a given element description.',
        inputSchema: {
            type: 'object',
            properties: {
                elementDescription: {
                    type: 'string',
                    description: 'Description of the element (e.g., "button with text Submit", "input field labeled Email")',
                },
                context: {
                    type: 'string',
                    description: 'Additional context about where the element is located',
                },
            },
            required: ['elementDescription'],
        },
    },
    {
        name: 'playwright_generate_page_object',
        description: 'Generate a Page Object Model class with specified elements.',
        inputSchema: {
            type: 'object',
            properties: {
                pageName: {
                    type: 'string',
                    description: 'Name of the page (e.g., "Login", "Checkout")',
                },
                elements: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string',
                                description: 'Element name (e.g., "Submit Button", "Email Input")',
                            },
                            selector: {
                                type: 'string',
                                description: 'Playwright selector for the element',
                            },
                        },
                        required: ['name', 'selector'],
                    },
                    description: 'Array of page elements with names and selectors',
                },
            },
            required: ['pageName', 'elements'],
        },
    },
    {
        name: 'playwright_validate_locators',
        description: 'Analyze a test file to validate locators and suggest improvements.',
        inputSchema: {
            type: 'object',
            properties: {
                testFilePath: {
                    type: 'string',
                    description: 'Relative path to the test file (e.g., "tests/ODA/UK/PurchaseFlow.spec.ts")',
                },
            },
            required: ['testFilePath'],
        },
    },
    {
        name: 'playwright_get_config',
        description: 'Get Playwright configuration details including projects, workers, and timeouts.',
        inputSchema: {
            type: 'object',
            properties: {},
        },
    },
    {
        name: 'playwright_list_projects',
        description: 'List all configured Playwright projects (browsers and configurations).',
        inputSchema: {
            type: 'object',
            properties: {},
        },
    },
    {
        name: 'playwright_debug_test',
        description: 'Run a specific test in debug mode with UI and trace enabled.',
        inputSchema: {
            type: 'object',
            properties: {
                testPath: {
                    type: 'string',
                    description: 'Path to the test file to debug',
                },
                testName: {
                    type: 'string',
                    description: 'Specific test name to debug',
                },
            },
        },
    },
    {
        name: 'playwright_run_test_by_name',
        description: 'Run a specific test by its exact name.',
        inputSchema: {
            type: 'object',
            properties: {
                testName: {
                    type: 'string',
                    description: 'Exact test name to run',
                },
                testType: {
                    type: 'string',
                    enum: ['ODA', 'WebPortal'],
                    description: 'Test type to narrow down search',
                },
                market: {
                    type: 'string',
                    enum: ['UK', 'PT', 'IE', 'GR', 'NL', 'CZ', 'ES', 'IT', 'RO'],
                    description: 'Market to narrow down search',
                },
            },
            required: ['testName'],
        },
    },
    // Figma tools
    {
        name: 'figma_get_file',
        description: 'Get Figma file information including all pages, frames, and components. Use this to browse available designs for test documentation.',
        inputSchema: {
            type: 'object',
            properties: {
                fileKey: {
                    type: 'string',
                    description: 'Figma file key (from URL: figma.com/file/FILE_KEY/...) or full Figma URL',
                },
            },
            required: ['fileKey'],
        },
    },
    {
        name: 'figma_search_frames',
        description: 'Search for frames/components by name in a Figma file. Useful for finding specific test scenarios or flows.',
        inputSchema: {
            type: 'object',
            properties: {
                fileKey: {
                    type: 'string',
                    description: 'Figma file key or full URL',
                },
                searchTerm: {
                    type: 'string',
                    description: 'Search term to find in frame names (case-insensitive)',
                },
            },
            required: ['fileKey', 'searchTerm'],
        },
    },
    {
        name: 'figma_export_images',
        description: 'Export images from Figma frames/nodes. Perfect for including design screenshots in Zephyr test steps or automation test reports.',
        inputSchema: {
            type: 'object',
            properties: {
                fileKey: {
                    type: 'string',
                    description: 'Figma file key or full URL',
                },
                nodeIds: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Array of node IDs to export (get from figma_get_file or figma_search_frames)',
                },
                format: {
                    type: 'string',
                    enum: ['png', 'jpg', 'svg', 'pdf'],
                    description: 'Export format (default: png)',
                },
                scale: {
                    type: 'number',
                    description: 'Scale factor (1-4, default: 2 for retina)',
                },
            },
            required: ['fileKey', 'nodeIds'],
        },
    },
    {
        name: 'figma_get_components',
        description: 'Get all components from a Figma file. Useful for design system documentation and component testing.',
        inputSchema: {
            type: 'object',
            properties: {
                fileKey: {
                    type: 'string',
                    description: 'Figma file key or full URL',
                },
            },
            required: ['fileKey'],
        },
    },
    {
        name: 'figma_get_comments',
        description: 'Get all comments from a Figma file. Useful for tracking design feedback and linking to test cases.',
        inputSchema: {
            type: 'object',
            properties: {
                fileKey: {
                    type: 'string',
                    description: 'Figma file key or full URL',
                },
            },
            required: ['fileKey'],
        },
    },
    {
        name: 'figma_post_comment',
        description: 'Post a comment on a Figma file. Use to mark which designs have test coverage or link to test case IDs.',
        inputSchema: {
            type: 'object',
            properties: {
                fileKey: {
                    type: 'string',
                    description: 'Figma file key or full URL',
                },
                message: {
                    type: 'string',
                    description: 'Comment message (e.g., "✅ Test case WEBP-T123 covers this flow")',
                },
                nodeId: {
                    type: 'string',
                    description: 'Node ID to attach comment to (optional)',
                },
            },
            required: ['fileKey', 'message'],
        },
    },
    {
        name: 'figma_get_file_link',
        description: 'Generate a Figma web link for a file or specific node. Useful for embedding links in test documentation.',
        inputSchema: {
            type: 'object',
            properties: {
                fileKey: {
                    type: 'string',
                    description: 'Figma file key',
                },
                nodeId: {
                    type: 'string',
                    description: 'Node ID to link to (optional)',
                },
            },
            required: ['fileKey'],
        },
    },
    // WireMock Studio tools
    {
        name: 'wiremock_list_mock_apis',
        description: 'List all Mock APIs in your WireMock Studio workspace',
        inputSchema: {
            type: 'object',
            properties: {},
        },
    },
    {
        name: 'wiremock_get_mock_api',
        description: 'Get details of a specific Mock API',
        inputSchema: {
            type: 'object',
            properties: {
                mockApiId: {
                    type: 'string',
                    description: 'The ID of the Mock API',
                },
            },
            required: ['mockApiId'],
        },
    },
    {
        name: 'wiremock_list_stubs',
        description: 'List all stubs in a Mock API',
        inputSchema: {
            type: 'object',
            properties: {
                mockApiId: {
                    type: 'string',
                    description: 'The ID of the Mock API',
                },
                limit: {
                    type: 'number',
                    description: 'Maximum number of stubs to return (optional)',
                },
                offset: {
                    type: 'number',
                    description: 'Number of stubs to skip (optional)',
                },
            },
            required: ['mockApiId'],
        },
    },
    {
        name: 'wiremock_get_stub',
        description: 'Get a specific stub by ID',
        inputSchema: {
            type: 'object',
            properties: {
                mockApiId: {
                    type: 'string',
                    description: 'The ID of the Mock API',
                },
                stubId: {
                    type: 'string',
                    description: 'The ID of the stub',
                },
            },
            required: ['mockApiId', 'stubId'],
        },
    },
    {
        name: 'wiremock_create_stub',
        description: 'Create a new stub in a Mock API',
        inputSchema: {
            type: 'object',
            properties: {
                mockApiId: {
                    type: 'string',
                    description: 'The ID of the Mock API',
                },
                name: {
                    type: 'string',
                    description: 'Name/description for the stub (optional)',
                },
                method: {
                    type: 'string',
                    description: 'HTTP method (GET, POST, PUT, DELETE, etc.)',
                },
                url: {
                    type: 'string',
                    description: 'Exact URL to match (optional, use one of: url, urlPath, or urlPattern)',
                },
                urlPath: {
                    type: 'string',
                    description: 'URL path to match (optional, use one of: url, urlPath, or urlPattern)',
                },
                urlPattern: {
                    type: 'string',
                    description: 'URL regex pattern to match (optional, use one of: url, urlPath, or urlPattern)',
                },
                responseStatus: {
                    type: 'number',
                    description: 'HTTP response status code (e.g., 200, 404, 500)',
                },
                responseBody: {
                    type: 'string',
                    description: 'Response body (JSON string or plain text, optional)',
                },
                responseHeaders: {
                    type: 'object',
                    description: 'Response headers (optional)',
                },
                priority: {
                    type: 'number',
                    description: 'Stub priority - lower numbers are matched first (optional, default: 5)',
                },
                queryParams: {
                    type: 'object',
                    description: 'Query parameters to match (optional)',
                },
                requestHeaders: {
                    type: 'object',
                    description: 'Request headers to match (optional)',
                },
                requestBodyPatterns: {
                    type: 'array',
                    description: 'Request body patterns to match (optional)',
                },
            },
            required: ['mockApiId', 'method', 'responseStatus'],
        },
    },
    {
        name: 'wiremock_update_stub',
        description: 'Update an existing stub',
        inputSchema: {
            type: 'object',
            properties: {
                mockApiId: {
                    type: 'string',
                    description: 'The ID of the Mock API',
                },
                stubId: {
                    type: 'string',
                    description: 'The ID of the stub to update',
                },
                name: {
                    type: 'string',
                    description: 'New name/description (optional)',
                },
                method: {
                    type: 'string',
                    description: 'New HTTP method (optional)',
                },
                url: {
                    type: 'string',
                    description: 'New exact URL (optional)',
                },
                urlPath: {
                    type: 'string',
                    description: 'New URL path (optional)',
                },
                urlPattern: {
                    type: 'string',
                    description: 'New URL pattern (optional)',
                },
                responseStatus: {
                    type: 'number',
                    description: 'New response status (optional)',
                },
                responseBody: {
                    type: 'string',
                    description: 'New response body (optional)',
                },
                responseHeaders: {
                    type: 'object',
                    description: 'New response headers (optional)',
                },
                priority: {
                    type: 'number',
                    description: 'New priority (optional)',
                },
            },
            required: ['mockApiId', 'stubId'],
        },
    },
    {
        name: 'wiremock_import_stubs',
        description: 'Import multiple stubs from JSON (bulk create or replace)',
        inputSchema: {
            type: 'object',
            properties: {
                mockApiId: {
                    type: 'string',
                    description: 'The ID of the Mock API',
                },
                stubs: {
                    type: 'string',
                    description: 'JSON string containing an array of stub mappings',
                },
                mode: {
                    type: 'string',
                    enum: ['append', 'replace'],
                    description: 'Import mode: "append" adds to existing stubs, "replace" deletes all first (default: append)',
                },
            },
            required: ['mockApiId', 'stubs'],
        },
    },
    {
        name: 'wiremock_export_stubs',
        description: 'Export all stubs from a Mock API as JSON',
        inputSchema: {
            type: 'object',
            properties: {
                mockApiId: {
                    type: 'string',
                    description: 'The ID of the Mock API',
                },
            },
            required: ['mockApiId'],
        },
    },
];
// Create MCP server
const serverOptions = {
    name: 'mcp-project-management-automation-server',
    version: '2.0.0',
};
// Add tools capability (bypass typechecking issue with SDK version)
serverOptions.capabilities = {
    tools: true,
};
const server = new Server(serverOptions);
// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: TOOLS,
    };
});
// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        if (name === 'get_jira_issue') {
            const { issueKey, expand } = args;
            if (!issueKey || !/^[A-Z]+-[0-9]+$/.test(issueKey)) {
                throw new Error('Invalid issue key format. Expected format: PROJ-123');
            }
            const issue = await jiraClient.getIssue({ issueKey, expand });
            const formattedIssue = jiraClient.formatIssue(issue);
            return {
                content: [
                    {
                        type: 'text',
                        text: formattedIssue,
                    },
                ],
            };
        }
        if (name === 'create_zephyr_test_case') {
            const { projectKey, name: testName, objective, precondition, priority, labels, steps, } = args;
            const testScript = steps ? {
                type: 'STEP_BY_STEP',
                steps: steps.map((step) => ({
                    description: step.description,
                    testData: step.testData,
                    expectedResult: step.expectedResult,
                })),
            } : undefined;
            const testCase = await zephyrClient.createTestCase({
                projectKey,
                name: testName,
                objective,
                precondition,
                priority: priority || 'Normal',
                labels,
                testScript,
            });
            return {
                content: [
                    {
                        type: 'text',
                        text: `✅ Test case created successfully!\n\n${zephyrClient.formatTestCase(testCase)}`,
                    },
                ],
            };
        }
        if (name === 'get_zephyr_test_case') {
            const { testCaseKey } = args;
            const testCase = await zephyrClient.getTestCase(testCaseKey);
            const formatted = zephyrClient.formatTestCase(testCase);
            return {
                content: [
                    {
                        type: 'text',
                        text: formatted,
                    },
                ],
            };
        }
        if (name === 'update_zephyr_test_case') {
            const { testCaseKey, ...updates } = args;
            const testCase = await zephyrClient.updateTestCase(testCaseKey, updates);
            return {
                content: [
                    {
                        type: 'text',
                        text: `✅ Test case updated successfully!\n\n${zephyrClient.formatTestCase(testCase)}`,
                    },
                ],
            };
        }
        if (name === 'link_test_to_issue') {
            const { testCaseKey, issueKey } = args;
            await zephyrClient.linkTestCaseToIssue(testCaseKey, issueKey);
            return {
                content: [
                    {
                        type: 'text',
                        text: `✅ Successfully linked test case ${testCaseKey} to issue ${issueKey}`,
                    },
                ],
            };
        }
        if (name === 'get_test_executions') {
            const { testCaseKey } = args;
            const executions = await zephyrClient.getTestExecutions(testCaseKey);
            const formatted = executions.length > 0
                ? executions
                    .map((ex) => `- ${ex.key}: ${ex.status} (${ex.testCaseKey})`)
                    .join('\n')
                : 'No executions found for this test case.';
            return {
                content: [
                    {
                        type: 'text',
                        text: `# Test Executions for ${testCaseKey}\n\n${formatted}`,
                    },
                ],
            };
        }
        if (name === 'list_zephyr_folders') {
            const { projectKey } = args;
            const folders = await zephyrClient.getFolders(projectKey);
            if (folders.length === 0) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `No folders found for project ${projectKey}.\n\nCreate folders in Jira UI at:\n${process.env.JIRA_SERVER_URL}/projects/${projectKey}?selectedItem=com.kanoah.test-manager:test-case-folders`,
                        },
                    ],
                };
            }
            const formatted = folders
                .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
                .map((folder) => `- ${folder.name} (ID: ${folder.id})`)
                .join('\n');
            return {
                content: [
                    {
                        type: 'text',
                        text: `# Zephyr Scale Folders for ${projectKey}\n\n${formatted}\n\n**Note:** To create new folders, use the Jira UI:\n${process.env.JIRA_SERVER_URL}/projects/${projectKey}?selectedItem=com.kanoah.test-manager:test-case-folders`,
                    },
                ],
            };
        }
        if (name === 'add_jira_comment') {
            const { issueKey, comment } = args;
            // Show preview and ask for approval
            const preview = `📝 Comment Preview for ${issueKey}:\n\n${'-'.repeat(60)}\n${comment}\n${'-'.repeat(60)}\n\n⚠️  This comment will be posted to the JIRA issue.\nPlease confirm if you want to proceed.`;
            // Return preview first - user needs to approve
            // Note: MCP doesn't have built-in approval, so we'll just add the comment directly
            // In a real implementation, you'd need UI confirmation
            await jiraClient.addComment(issueKey, comment);
            return {
                content: [
                    {
                        type: 'text',
                        text: `✅ Comment added successfully to ${issueKey}!\n\nView issue: ${process.env.JIRA_SERVER_URL}/browse/${issueKey}`,
                    },
                ],
            };
        }
        // Azure DevOps tools
        if (!azureDevOpsClient) {
            if (name.startsWith('azure_')) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: 'Azure DevOps is not configured. Please set AZURE_DEVOPS_ORG_URL, AZURE_DEVOPS_TOKEN, and AZURE_DEVOPS_PROJECT in your .env file.',
                        },
                    ],
                    isError: true,
                };
            }
        }
        if (name === 'azure_list_repositories') {
            const repos = await azureDevOpsClient.listRepositories();
            const formatted = repos
                .map(repo => `- **${repo.name}** (${repo.id})\n  ${repo.webUrl}`)
                .join('\n');
            return {
                content: [
                    {
                        type: 'text',
                        text: `# Repositories\n\n${formatted}`,
                    },
                ],
            };
        }
        if (name === 'azure_get_repository') {
            const { repositoryId } = args;
            const repo = await azureDevOpsClient.getRepository(repositoryId);
            const formatted = azureDevOpsClient.formatRepository(repo);
            return {
                content: [
                    {
                        type: 'text',
                        text: formatted,
                    },
                ],
            };
        }
        if (name === 'azure_list_pull_requests') {
            const { repositoryId, status, top } = args;
            const prs = await azureDevOpsClient.listPullRequests(repositoryId, status || 'active', undefined, undefined, top);
            if (prs.length === 0) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `No pull requests found with status: ${status || 'active'}`,
                        },
                    ],
                };
            }
            const formatted = prs
                .map(pr => `- **PR ${pr.pullRequestId}**: ${pr.title}\n  Status: ${pr.status === 1 ? 'Active' : pr.status === 3 ? 'Completed' : 'Abandoned'}\n  Created by: ${pr.createdBy?.displayName}\n  ${pr.url}`)
                .join('\n\n');
            return {
                content: [
                    {
                        type: 'text',
                        text: `# Pull Requests (${prs.length})\n\n${formatted}`,
                    },
                ],
            };
        }
        if (name === 'azure_get_pull_request') {
            const { repositoryId, pullRequestId } = args;
            const pr = await azureDevOpsClient.getPullRequest(repositoryId, pullRequestId);
            const formatted = azureDevOpsClient.formatPullRequest(pr);
            return {
                content: [
                    {
                        type: 'text',
                        text: formatted,
                    },
                ],
            };
        }
        if (name === 'azure_create_pull_request') {
            const { repositoryId, sourceBranch, targetBranch, title, description, reviewers } = args;
            const pr = await azureDevOpsClient.createPullRequest(repositoryId, sourceBranch, targetBranch, title, description, reviewers);
            const formatted = azureDevOpsClient.formatPullRequest(pr);
            return {
                content: [
                    {
                        type: 'text',
                        text: `✅ Pull request created successfully!\n\n${formatted}`,
                    },
                ],
            };
        }
        if (name === 'azure_add_pr_comment') {
            const { repositoryId, pullRequestId, comment } = args;
            await azureDevOpsClient.addPullRequestComment(repositoryId, pullRequestId, comment);
            return {
                content: [
                    {
                        type: 'text',
                        text: `✅ Comment added to PR ${pullRequestId}`,
                    },
                ],
            };
        }
        if (name === 'azure_update_pull_request') {
            const { repositoryId, pullRequestId, status, mergeCommitMessage } = args;
            const pr = await azureDevOpsClient.updatePullRequest(repositoryId, pullRequestId, status, mergeCommitMessage);
            return {
                content: [
                    {
                        type: 'text',
                        text: `✅ Pull request ${pullRequestId} updated to status: ${status}`,
                    },
                ],
            };
        }
        if (name === 'azure_vote_pull_request') {
            const { repositoryId, pullRequestId, vote, updateStatus } = args;
            const result = await azureDevOpsClient.votePullRequest(repositoryId, pullRequestId, vote, updateStatus || false);
            const voteText = {
                'approve': '✅ Approved',
                'approve-with-suggestions': '👍 Approved with suggestions',
                'no-vote': '⏳ No vote',
                'wait-for-author': '⏸️ Waiting for author',
                'reject': '❌ Rejected'
            }[vote];
            let statusMessage = `${voteText} - Vote submitted for PR ${pullRequestId}`;
            if (updateStatus && result.pr) {
                const prStatus = result.pr.status === 1 ? 'Active' : result.pr.status === 3 ? 'Completed' : 'Abandoned';
                statusMessage += `\nPR status updated to: ${prStatus}`;
            }
            return {
                content: [
                    {
                        type: 'text',
                        text: statusMessage,
                    },
                ],
            };
        }
        if (name === 'azure_list_branches') {
            const { repositoryId } = args;
            const branches = await azureDevOpsClient.listBranches(repositoryId);
            const formatted = branches
                .map(branch => `- **${branch.name}**`)
                .join('\n');
            return {
                content: [
                    {
                        type: 'text',
                        text: `# Branches\n\n${formatted}`,
                    },
                ],
            };
        }
        if (name === 'azure_get_commits') {
            const { repositoryId, branch, top } = args;
            const commits = await azureDevOpsClient.getCommits(repositoryId, branch, top);
            const formatted = commits
                .map(commit => `- **${commit.commitId?.substring(0, 7)}**: ${commit.comment}\n  By: ${commit.author?.name} (${commit.author?.date?.toISOString()})`)
                .join('\n\n');
            return {
                content: [
                    {
                        type: 'text',
                        text: `# Commits${branch ? ` on ${branch}` : ''}\n\n${formatted}`,
                    },
                ],
            };
        }
        // Playwright tools
        if (!playwrightClient) {
            if (name.startsWith('playwright_')) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: 'Playwright client is not initialized. The MCP server must be run from the project root.',
                        },
                    ],
                    isError: true,
                };
            }
        }
        if (name === 'playwright_run_tests') {
            const options = args;
            const result = await playwrightClient.runTests(options);
            if (result.success) {
                // Get test results after execution
                const testResults = await playwrightClient.getTestResults();
                const formatted = playwrightClient.formatTestResults(testResults);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `✅ Tests executed successfully!\n\n${formatted}`,
                        },
                    ],
                };
            }
            else {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `⚠️ Tests completed with issues:\n\n${result.output}`,
                        },
                    ],
                };
            }
        }
        if (name === 'playwright_get_test_results') {
            const results = await playwrightClient.getTestResults();
            const formatted = playwrightClient.formatTestResults(results);
            return {
                content: [
                    {
                        type: 'text',
                        text: formatted,
                    },
                ],
            };
        }
        if (name === 'playwright_list_tests') {
            const { market, testType, tags } = args;
            const tests = await playwrightClient.listTests({ market, testType, tags });
            if (tests.length === 0) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: 'No tests found matching the specified criteria.',
                        },
                    ],
                };
            }
            const grouped = {};
            tests.forEach(test => {
                const key = `${test.testType || 'Other'}/${test.market || 'General'}`;
                if (!grouped[key])
                    grouped[key] = [];
                grouped[key].push(test);
            });
            let formatted = `# Available Tests (${tests.length} total)\n\n`;
            Object.entries(grouped).forEach(([key, testList]) => {
                formatted += `## ${key}\n\n`;
                testList.forEach(test => {
                    formatted += `- **${test.name}**\n`;
                    formatted += `  File: ${test.file}\n`;
                    if (test.tags && test.tags.length > 0) {
                        formatted += `  Tags: ${test.tags.join(', ')}\n`;
                    }
                    formatted += `\n`;
                });
            });
            return {
                content: [
                    {
                        type: 'text',
                        text: formatted,
                    },
                ],
            };
        }
        if (name === 'playwright_get_test_report') {
            const report = await playwrightClient.getTestReport();
            return {
                content: [
                    {
                        type: 'text',
                        text: report,
                    },
                ],
            };
        }
        if (name === 'playwright_generate_test') {
            const { description, testType, market, fileName } = args;
            const testCode = playwrightClient.generateTest(description, { testType, market, fileName });
            return {
                content: [
                    {
                        type: 'text',
                        text: `# Generated Test Code\n\n\`\`\`typescript\n${testCode}\n\`\`\`\n\nSave this to a file in your tests directory and modify as needed.`,
                    },
                ],
            };
        }
        if (name === 'playwright_generate_locator') {
            const { elementDescription, context } = args;
            const suggestions = playwrightClient.generateLocator(elementDescription, context);
            let formatted = `# Locator Suggestions for: "${elementDescription}"\n\n`;
            suggestions.forEach((sug, index) => {
                const confidenceEmoji = sug.confidence === 'high' ? '🟢' : sug.confidence === 'medium' ? '🟡' : '🔴';
                formatted += `## ${index + 1}. ${sug.strategy.toUpperCase()} Strategy ${confidenceEmoji}\n\n`;
                formatted += `**Selector:**\n\`\`\`typescript\n${sug.selector}\n\`\`\`\n\n`;
                formatted += `**Explanation:** ${sug.explanation}\n\n`;
            });
            return {
                content: [
                    {
                        type: 'text',
                        text: formatted,
                    },
                ],
            };
        }
        if (name === 'playwright_generate_page_object') {
            const { pageName, elements } = args;
            const pageObjectCode = playwrightClient.generatePageObject(pageName, elements);
            return {
                content: [
                    {
                        type: 'text',
                        text: `# Generated Page Object: ${pageName}Page\n\n\`\`\`typescript\n${pageObjectCode}\n\`\`\`\n\nSave this to src/pages/ directory.`,
                    },
                ],
            };
        }
        if (name === 'playwright_validate_locators') {
            const { testFilePath } = args;
            const validation = await playwrightClient.validateLocators(testFilePath);
            let formatted = `# Locator Validation Report: ${testFilePath}\n\n`;
            if (validation.valid.length > 0) {
                formatted += `## Valid Locators (${validation.valid.length})\n\n`;
                validation.valid.forEach(loc => {
                    formatted += `${loc}\n`;
                });
                formatted += `\n`;
            }
            if (validation.warnings.length > 0) {
                formatted += `## Warnings (${validation.warnings.length})\n\n`;
                validation.warnings.forEach(warn => {
                    formatted += `${warn}\n`;
                });
                formatted += `\n`;
            }
            if (validation.invalid.length > 0) {
                formatted += `## Invalid Locators (${validation.invalid.length})\n\n`;
                validation.invalid.forEach(loc => {
                    formatted += `❌ ${loc}\n`;
                });
            }
            return {
                content: [
                    {
                        type: 'text',
                        text: formatted,
                    },
                ],
            };
        }
        if (name === 'playwright_get_config') {
            const config = await playwrightClient.getConfig();
            return {
                content: [
                    {
                        type: 'text',
                        text: config,
                    },
                ],
            };
        }
        if (name === 'playwright_list_projects') {
            const config = await playwrightClient.getConfig();
            return {
                content: [
                    {
                        type: 'text',
                        text: config,
                    },
                ],
            };
        }
        if (name === 'playwright_debug_test') {
            const { testPath, testName } = args;
            const result = await playwrightClient.runTests({
                testPath,
                testName,
                debug: true,
                headed: true,
                workers: 1,
            });
            return {
                content: [
                    {
                        type: 'text',
                        text: result.success
                            ? `✅ Debug session started for test\n\n${result.output}`
                            : `⚠️ Debug session encountered issues:\n\n${result.output}`,
                    },
                ],
            };
        }
        if (name === 'playwright_run_test_by_name') {
            const { testName, testType, market } = args;
            const result = await playwrightClient.runTests({
                testName,
                testType,
                market,
            });
            if (result.success) {
                const testResults = await playwrightClient.getTestResults();
                const formatted = playwrightClient.formatTestResults(testResults);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `✅ Test executed: "${testName}"\n\n${formatted}`,
                        },
                    ],
                };
            }
            else {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `⚠️ Test execution had issues:\n\n${result.output}`,
                        },
                    ],
                };
            }
        }
        // Figma tools
        if (!figmaClient) {
            if (name.startsWith('figma_')) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: 'Figma is not configured. Please set FIGMA_ACCESS_TOKEN in your .env file.\n\nGet your token at: https://www.figma.com/settings (Personal access tokens section)',
                        },
                    ],
                    isError: true,
                };
            }
        }
        if (name === 'figma_get_file') {
            const { fileKey } = args;
            // Parse URL if full URL provided
            const parsed = FigmaClient.parseFigmaUrl(fileKey);
            const key = parsed?.fileKey || fileKey;
            const file = await figmaClient.getFile(key);
            const formatted = `# ${file.name}\n\n**Last Modified:** ${new Date(file.lastModified).toLocaleString()}\n**Version:** ${file.version}\n\n## Pages\n\n${file.pages.map((page) => {
                const frames = page.children.filter((c) => c.type === 'FRAME' || c.type === 'COMPONENT');
                return `### ${page.name}\n${frames.length > 0 ? frames.map((f) => `- **${f.name}** (${f.type}, ID: ${f.id})`).join('\n') : '  No frames'}`;
            }).join('\n\n')}`;
            return {
                content: [
                    {
                        type: 'text',
                        text: formatted,
                    },
                ],
            };
        }
        if (name === 'figma_search_frames') {
            const { fileKey, searchTerm } = args;
            const parsed = FigmaClient.parseFigmaUrl(fileKey);
            const key = parsed?.fileKey || fileKey;
            const result = await figmaClient.searchFrames(key, searchTerm);
            if (result.matches.length === 0) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `No frames found matching "${searchTerm}"`,
                        },
                    ],
                };
            }
            const formatted = `# Search Results for "${searchTerm}"\n\nFound ${result.matches.length} matches:\n\n${result.matches.map(m => `- **${m.name}** (${m.type})\n  Page: ${m.page}\n  Node ID: ${m.id}\n  Link: ${figmaClient.getFileLink(key, m.id)}`).join('\n\n')}`;
            return {
                content: [
                    {
                        type: 'text',
                        text: formatted,
                    },
                ],
            };
        }
        // TODO: Fix Figma API integration
        /*
        if (name === 'figma_export_images') {
          const { fileKey, nodeIds, format, scale } = args as {
            fileKey: string;
            nodeIds: string[];
            format?: 'png' | 'jpg' | 'svg' | 'pdf';
            scale?: number;
          };
          
          const parsed = FigmaClient.parseFigmaUrl(fileKey);
          const key = parsed?.fileKey || fileKey;
    
          const result = await figmaClient!.exportImages(key, nodeIds, format || 'png', scale || 2);
          
          const formatted = `# Exported Images\n\n${result.images.map(img =>
            `- **Node ${img.nodeId}**\n  URL: ${img.url}\n  _(Copy URL to download or embed in test documentation)_`
          ).join('\n\n')}\n\n**Note:** Image URLs are temporary and expire after ~14 days.`;
    
          return {
            content: [
              {
                type: 'text',
                text: formatted,
              },
            ],
          };
        }
        */
        if (name === 'figma_get_components') {
            const { fileKey } = args;
            const parsed = FigmaClient.parseFigmaUrl(fileKey);
            const key = parsed?.fileKey || fileKey;
            const result = await figmaClient.getComponents(key);
            if (result.components.length === 0) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: 'No components found in this file',
                        },
                    ],
                };
            }
            const formatted = `# Components (${result.components.length})\n\n${result.components.map(c => `- **${c.name}** (${c.type})\n  ID: ${c.id}${c.description ? `\n  Description: ${c.description}` : ''}`).join('\n\n')}`;
            return {
                content: [
                    {
                        type: 'text',
                        text: formatted,
                    },
                ],
            };
        }
        if (name === 'figma_get_comments') {
            const { fileKey } = args;
            const parsed = FigmaClient.parseFigmaUrl(fileKey);
            const key = parsed?.fileKey || fileKey;
            const result = await figmaClient.getComments(key);
            if (result.comments.length === 0) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: 'No comments found in this file',
                        },
                    ],
                };
            }
            const formatted = `# Comments (${result.comments.length})\n\n${result.comments.map((c) => `**${c.user}** - ${new Date(c.createdAt).toLocaleString()}${c.resolvedAt ? ' _(Resolved)_' : ''}\n${c.message}\n`).join('\n')}`;
            return {
                content: [
                    {
                        type: 'text',
                        text: formatted,
                    },
                ],
            };
        }
        // TODO: Fix Figma API integration
        /*
        if (name === 'figma_post_comment') {
          const { fileKey, message, nodeId } = args as { fileKey: string; message: string; nodeId?: string };
          
          const parsed = FigmaClient.parseFigmaUrl(fileKey);
          const key = parsed?.fileKey || fileKey;
    
          let clientMeta = undefined;
          if (nodeId) {
            clientMeta = { node_id: nodeId };
          }
    
          const result = await figmaClient!.postComment(key, message, clientMeta);
          
          return {
            content: [
              {
                type: 'text',
                text: `✅ Comment posted successfully\n\n**User:** ${result.user}\n**Message:** ${result.message}\n**Created:** ${new Date(result.createdAt).toLocaleString()}${nodeId ? `\n**Node ID:** ${nodeId}` : ''}`,
              },
            ],
          };
        }
        */
        if (name === 'figma_get_file_link') {
            const { fileKey, nodeId } = args;
            const link = figmaClient.getFileLink(fileKey, nodeId);
            return {
                content: [
                    {
                        type: 'text',
                        text: `# Figma Link\n\n${link}\n\n${nodeId ? '_(Links directly to the specified node)_' : '_(Links to the file root)_'}`,
                    },
                ],
            };
        }
        // WireMock Studio tools
        if (!wiremockClient) {
            if (name.startsWith('wiremock_')) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: '❌ WireMock Studio is not configured. Set WIREMOCK_STUDIO_URL and WIREMOCK_STUDIO_TOKEN in .env',
                        },
                    ],
                    isError: true,
                };
            }
        }
        else {
            // Helper function to resolve Mock API ID
            const resolveMockApiId = async (mockApiId, serviceName) => {
                if (mockApiId)
                    return mockApiId;
                if (serviceName)
                    return await wiremockClient.getMockApiIdByName(serviceName);
                return await wiremockClient.getMockApiIdByName(); // Use default
            };
            if (name === 'wiremock_list_mock_apis') {
                const mockApis = await wiremockClient.listMockAPIs();
                const summary = mockApis.map((api) => ({
                    id: api.id,
                    name: api.name,
                    publicUrl: api.publicUrl,
                    adminUrl: api.adminUrl,
                }));
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Found ${mockApis.length} Mock APIs:\n\n${JSON.stringify(summary, null, 2)}`,
                        },
                    ],
                };
            }
            if (name === 'wiremock_get_mock_api') {
                const { mockApiId } = args;
                const mockApi = await wiremockClient.getMockAPI(mockApiId);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(mockApi, null, 2),
                        },
                    ],
                };
            }
            if (name === 'wiremock_list_stubs') {
                const { mockApiId, serviceName, limit, offset } = args;
                const resolvedId = await resolveMockApiId(mockApiId, serviceName);
                const result = await wiremockClient.listStubs({ mockApiId: resolvedId, limit, offset });
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            }
            if (name === 'wiremock_get_stub') {
                const { mockApiId, serviceName, stubId } = args;
                const resolvedId = await resolveMockApiId(mockApiId, serviceName);
                const stub = await wiremockClient.getStub({ mockApiId: resolvedId, stubId });
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(stub, null, 2),
                        },
                    ],
                };
            }
            if (name === 'wiremock_create_stub') {
                const { mockApiId, serviceName, name: stubName, method, url, urlPath, urlPattern, responseStatus, responseBody, responseHeaders, priority, queryParams, requestHeaders, requestBodyPatterns, } = args;
                const resolvedId = await resolveMockApiId(mockApiId, serviceName);
                // Build request pattern
                const request = {
                    method: method.toUpperCase(),
                };
                if (url)
                    request.url = url;
                if (urlPath)
                    request.urlPath = urlPath;
                if (urlPattern)
                    request.urlPattern = urlPattern;
                if (queryParams)
                    request.queryParameters = queryParams;
                if (requestHeaders)
                    request.headers = requestHeaders;
                if (requestBodyPatterns)
                    request.bodyPatterns = requestBodyPatterns;
                // Build response definition
                const response = {
                    status: responseStatus,
                };
                if (responseBody) {
                    try {
                        response.jsonBody = JSON.parse(responseBody);
                    }
                    catch {
                        response.body = responseBody;
                    }
                }
                if (responseHeaders)
                    response.headers = responseHeaders;
                const created = await wiremockClient.createStub({
                    mockApiId: resolvedId,
                    stub: {
                        name: stubName,
                        priority,
                        request,
                        response,
                    },
                });
                return {
                    content: [
                        {
                            type: 'text',
                            text: `✅ Created stub ${created.id || created.uuid}\n\n${JSON.stringify(created, null, 2)}`,
                        },
                    ],
                };
            }
            if (name === 'wiremock_update_stub') {
                const { mockApiId, serviceName, stubId, name: stubName, method, url, urlPath, urlPattern, responseStatus, responseBody, responseHeaders, priority, } = args;
                const resolvedId = await resolveMockApiId(mockApiId, serviceName);
                const stub = {};
                if (stubName !== undefined)
                    stub.name = stubName;
                if (priority !== undefined)
                    stub.priority = priority;
                if (method || url || urlPath || urlPattern) {
                    stub.request = {};
                    if (method)
                        stub.request.method = method.toUpperCase();
                    if (url)
                        stub.request.url = url;
                    if (urlPath)
                        stub.request.urlPath = urlPath;
                    if (urlPattern)
                        stub.request.urlPattern = urlPattern;
                }
                if (responseStatus !== undefined || responseBody !== undefined || responseHeaders !== undefined) {
                    stub.response = {};
                    if (responseStatus !== undefined)
                        stub.response.status = responseStatus;
                    if (responseBody !== undefined) {
                        try {
                            stub.response.jsonBody = JSON.parse(responseBody);
                        }
                        catch {
                            stub.response.body = responseBody;
                        }
                    }
                    if (responseHeaders !== undefined)
                        stub.response.headers = responseHeaders;
                }
                const updated = await wiremockClient.updateStub({
                    mockApiId: resolvedId,
                    stubId,
                    stub,
                });
                return {
                    content: [
                        {
                            type: 'text',
                            text: `✅ Updated stub ${stubId}\n\n${JSON.stringify(updated, null, 2)}`,
                        },
                    ],
                };
            }
            if (name === 'wiremock_import_stubs') {
                const { mockApiId, serviceName, stubs, mode } = args;
                const resolvedId = await resolveMockApiId(mockApiId, serviceName);
                let stubsArray;
                try {
                    stubsArray = JSON.parse(stubs);
                }
                catch (error) {
                    throw new Error(`Invalid JSON for stubs: ${error.message}`);
                }
                const result = await wiremockClient.importStubs({
                    mockApiId: resolvedId,
                    stubs: stubsArray,
                    mode: mode || 'append',
                });
                return {
                    content: [
                        {
                            type: 'text',
                            text: `✅ Imported ${result.imported} stubs (mode: ${mode || 'append'})`,
                        },
                    ],
                };
            }
            if (name === 'wiremock_export_stubs') {
                const { mockApiId, serviceName } = args;
                const resolvedId = await resolveMockApiId(mockApiId, serviceName);
                const stubs = await wiremockClient.exportStubs({ mockApiId: resolvedId });
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({ stubs }, null, 2),
                        },
                    ],
                };
            }
        }
        throw new Error(`Unknown tool: ${name}`);
    }
    catch (error) {
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${error.message}`,
                },
            ],
            isError: true,
        };
    }
});
// Start the server
async function runServer() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Jira MCP Server running on stdio');
}
runServer().catch((error) => {
    console.error('Fatal error running server:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map