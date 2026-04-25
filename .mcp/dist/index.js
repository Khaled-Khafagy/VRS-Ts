import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { JiraClient } from './jira-client.js';
import { ZephyrClient } from './zephyr-client.js';
const JIRA_BASE_URL = process.env.JIRA_BASE_URL || 'https://cps.jira.agile.vodafone.com';
const JIRA_PAT = process.env.JIRA_PAT || '';
if (!JIRA_PAT) {
    process.stderr.write('ERROR: JIRA_PAT environment variable is required\n');
    process.exit(1);
}
const jira = new JiraClient(JIRA_BASE_URL, JIRA_PAT);
const zephyr = new ZephyrClient(JIRA_BASE_URL, JIRA_PAT);
const server = new Server({ name: 'vrs-jira-zephyr', version: '1.0.0' }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
        {
            name: 'fetch_jira_ticket',
            description: 'Fetches a Jira ticket by issue key and returns its summary, description, and acceptance criteria so test cases can be generated.',
            inputSchema: {
                type: 'object',
                properties: {
                    issue_key: {
                        type: 'string',
                        description: 'Jira issue key, e.g. TE-406',
                    },
                },
                required: ['issue_key'],
            },
        },
        {
            name: 'push_test_cases_to_zephyr',
            description: 'Creates test cases in Zephyr Scale and links them to the Jira ticket. Call this ONLY after the user has reviewed and approved the generated test cases.',
            inputSchema: {
                type: 'object',
                properties: {
                    issue_key: {
                        type: 'string',
                        description: 'Jira issue key the test cases relate to, e.g. TE-406',
                    },
                    project_key: {
                        type: 'string',
                        description: 'Jira/Zephyr project key, e.g. TE',
                    },
                    test_cases: {
                        type: 'array',
                        description: 'Array of test cases to create',
                        items: {
                            type: 'object',
                            properties: {
                                name: { type: 'string' },
                                objective: { type: 'string' },
                                precondition: { type: 'string' },
                                priority: { type: 'string', enum: ['Low', 'Normal', 'High'] },
                                steps: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            description: { type: 'string' },
                                            testData: { type: 'string' },
                                            expectedResult: { type: 'string' },
                                        },
                                        required: ['description', 'expectedResult'],
                                    },
                                },
                                labels: { type: 'array', items: { type: 'string' } },
                            },
                            required: ['name', 'objective', 'priority', 'steps'],
                        },
                    },
                },
                required: ['issue_key', 'project_key', 'test_cases'],
            },
        },
        {
            name: 'create_test_cycle',
            description: 'Creates a test cycle in Zephyr Scale, adds the given test case keys to it, and links it back to the original Jira ticket.',
            inputSchema: {
                type: 'object',
                properties: {
                    issue_key: {
                        type: 'string',
                        description: 'Jira issue key to link the cycle to, e.g. TE-406',
                    },
                    project_key: {
                        type: 'string',
                        description: 'Jira/Zephyr project key, e.g. TE',
                    },
                    cycle_name: {
                        type: 'string',
                        description: 'Name for the test cycle',
                    },
                    description: {
                        type: 'string',
                        description: 'Short description of the test cycle',
                    },
                    test_case_keys: {
                        type: 'array',
                        items: { type: 'string' },
                        description: 'List of Zephyr test case keys to include, e.g. ["TE-T1", "TE-T2"]',
                    },
                },
                required: ['issue_key', 'project_key', 'cycle_name', 'description', 'test_case_keys'],
            },
        },
    ],
}));
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        if (name === 'fetch_jira_ticket') {
            const issueKey = args?.issue_key;
            const issue = await jira.fetchIssue(issueKey);
            return {
                content: [{
                        type: 'text',
                        text: [
                            `## Jira Ticket: ${issue.key}`,
                            `**Type:** ${issue.issueType}  |  **Status:** ${issue.status}  |  **Priority:** ${issue.priority}`,
                            `**Reporter:** ${issue.reporter}${issue.assignee ? `  |  **Assignee:** ${issue.assignee}` : ''}`,
                            '',
                            `### Summary`,
                            issue.summary,
                            '',
                            `### Description`,
                            issue.description,
                            '',
                            `### Acceptance Criteria`,
                            issue.acceptanceCriteria,
                        ].join('\n'),
                    }],
            };
        }
        if (name === 'push_test_cases_to_zephyr') {
            const issueKey = args?.issue_key;
            const projectKey = args?.project_key;
            const testCases = args?.test_cases;
            const created = [];
            for (const tc of testCases) {
                const result = await zephyr.createTestCase(projectKey, tc, issueKey);
                created.push(result);
            }
            const lines = [
                `## Test Cases Created in Zephyr`,
                `Successfully created **${created.length}** test case(s) linked to **${issueKey}**:`,
                '',
                ...created.map((tc, i) => `${i + 1}. **${tc.key}** — ${tc.name}\n   ${tc.url}`),
                '',
                `**Test case keys:** ${created.map(tc => tc.key).join(', ')}`,
                '',
                `Use these keys with \`create_test_cycle\` to create a test cycle.`,
            ];
            return { content: [{ type: 'text', text: lines.join('\n') }] };
        }
        if (name === 'create_test_cycle') {
            const issueKey = args?.issue_key;
            const projectKey = args?.project_key;
            const cycleName = args?.cycle_name;
            const description = args?.description;
            const testCaseKeys = args?.test_case_keys;
            const cycle = await zephyr.createTestCycle(projectKey, cycleName, description, testCaseKeys, issueKey);
            await jira.addRemoteLink(issueKey, `Test Cycle: ${cycleName}`, cycle.url, 'Test Cycle');
            return {
                content: [{
                        type: 'text',
                        text: [
                            `## Test Cycle Created`,
                            `**Cycle:** ${cycle.key} — ${cycle.name}`,
                            `**URL:** ${cycle.url}`,
                            `**Test Cases:** ${testCaseKeys.join(', ')}`,
                            '',
                            `The cycle has been linked back to **${issueKey}** as a remote link.`,
                        ].join('\n'),
                    }],
            };
        }
        throw new Error(`Unknown tool: ${name}`);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
            content: [{ type: 'text', text: `**Error:** ${message}` }],
            isError: true,
        };
    }
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    process.stderr.write('VRS Jira+Zephyr MCP server running\n');
}
main().catch((err) => {
    process.stderr.write(`Fatal: ${err}\n`);
    process.exit(1);
});
