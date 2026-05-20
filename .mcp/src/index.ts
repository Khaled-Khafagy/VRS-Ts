import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { JiraClient } from './jira-client.js';
import { ZephyrClient } from './zephyr-client.js';
import { CopilotClient } from './claude-client.js';
import { GeneratedTestCase } from './types.js';

const JIRA_BASE_URL = process.env.JIRA_BASE_URL || '';
const JIRA_PAT = process.env.JIRA_PAT || '';
const GH_TOKEN = process.env.GH_TOKEN || '';

if (!JIRA_PAT) {
    process.stderr.write('ERROR: JIRA_PAT environment variable is required\n');
    process.exit(1);
}
if (!GH_TOKEN) {
    process.stderr.write('ERROR: GH_TOKEN environment variable is required\n');
    process.exit(1);
}
if (!JIRA_BASE_URL) {
    process.stderr.write('ERROR: JIRA_BASE_URL environment variable is required\n');
    process.exit(1);
}

const jira = new JiraClient(JIRA_BASE_URL, JIRA_PAT);
const zephyr = new ZephyrClient(JIRA_BASE_URL, JIRA_PAT);
const claude = new CopilotClient(GH_TOKEN);

const server = new Server(
    { name: 'vrs-tc-generator', version: '2.0.0' },
    { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
        {
            name: 'analyze_jira_ticket',
            description:
                'Fetches a Jira ticket and uses Claude to analyze the requirement for ambiguities, missing info, ' +
                'untestable ACs, uncovered edge cases, and risks. Returns the ticket details plus AI review findings. ' +
                'Always call this first before generating test cases.',
            inputSchema: {
                type: 'object',
                properties: {
                    jira_ticket_url: {
                        type: 'string',
                        description: 'Full Jira ticket URL or plain issue key, e.g. "https://jira.company.com/browse/PROJ-123" or "PROJ-123"',
                    },
                },
                required: ['jira_ticket_url'],
            },
        },
        {
            name: 'generate_test_cases',
            description:
                'Generates comprehensive test cases (positive, negative, edge) using Claude based on a Jira ticket. ' +
                'Returns a JSON array of test cases. Call after analyze_jira_ticket.',
            inputSchema: {
                type: 'object',
                properties: {
                    ticket_key: { type: 'string', description: 'Jira issue key, e.g. "PROJ-123"' },
                    ticket_summary: { type: 'string', description: 'Ticket summary/title' },
                    ticket_description: { type: 'string', description: 'Full ticket description' },
                    acceptance_criteria: { type: 'string', description: 'Acceptance criteria from the ticket' },
                    review_findings: {
                        type: 'string',
                        description: 'Optional: review findings from analyze_jira_ticket to help guide TC generation',
                    },
                },
                required: ['ticket_key', 'ticket_summary', 'ticket_description', 'acceptance_criteria'],
            },
        },
        {
            name: 'refine_review',
            description:
                'Discuss or update the requirement review findings with Claude. ' +
                'Use to ask questions about the findings or request changes (add/remove/modify points).',
            inputSchema: {
                type: 'object',
                properties: {
                    ticket_key: { type: 'string' },
                    ticket_summary: { type: 'string' },
                    ticket_description: { type: 'string' },
                    acceptance_criteria: { type: 'string' },
                    current_findings: { type: 'string', description: 'The current review findings text' },
                    user_message: { type: 'string', description: 'Your question or requested change' },
                },
                required: ['ticket_key', 'ticket_summary', 'ticket_description', 'acceptance_criteria', 'current_findings', 'user_message'],
            },
        },
        {
            name: 'refine_test_cases',
            description:
                'Discuss or update generated test cases with Claude. ' +
                'Use to ask questions about the test cases or request modifications (add/remove/change tests). ' +
                'Returns either a conversational answer or an updated JSON array of test cases.',
            inputSchema: {
                type: 'object',
                properties: {
                    ticket_key: { type: 'string' },
                    ticket_summary: { type: 'string' },
                    ticket_description: { type: 'string' },
                    acceptance_criteria: { type: 'string' },
                    current_test_cases: {
                        type: 'string',
                        description: 'JSON string of the current test cases array',
                    },
                    user_message: { type: 'string', description: 'Your question or requested change' },
                },
                required: ['ticket_key', 'ticket_summary', 'ticket_description', 'acceptance_criteria', 'current_test_cases', 'user_message'],
            },
        },
        {
            name: 'post_test_cases_to_zephyr',
            description:
                'Creates test cases in Zephyr Scale and links them to the Jira requirement. ' +
                'Call ONLY after the user has reviewed and approved the generated test cases. ' +
                'Uses the 2-call approach (create then link) to avoid traceability link bugs.',
            inputSchema: {
                type: 'object',
                properties: {
                    issue_key: { type: 'string', description: 'Jira issue key to link test cases to' },
                    test_cases: {
                        type: 'array',
                        description: 'Array of test cases from generate_test_cases',
                        items: {
                            type: 'object',
                            properties: {
                                title: { type: 'string' },
                                type: { type: 'string', enum: ['positive', 'negative', 'edge'] },
                                steps: { type: 'array', items: { type: 'string' } },
                                expected_result: { type: 'string' },
                            },
                            required: ['title', 'type', 'steps', 'expected_result'],
                        },
                    },
                    folder_path: {
                        type: 'string',
                        description: 'Optional Zephyr folder path, e.g. "/TeamName/Sprint-24". Will be created if it does not exist.',
                    },
                },
                required: ['issue_key', 'test_cases'],
            },
        },
        {
            name: 'post_findings_comment',
            description: 'Posts the AI review findings as a comment on the Jira ticket for team visibility.',
            inputSchema: {
                type: 'object',
                properties: {
                    issue_key: { type: 'string', description: 'Jira issue key' },
                    findings: { type: 'string', description: 'Review findings text to post as a comment' },
                },
                required: ['issue_key', 'findings'],
            },
        },
        {
            name: 'list_zephyr_folders',
            description: 'Lists available Zephyr Scale folders in a hierarchical structure to help choose a target folder for test cases.',
            inputSchema: {
                type: 'object',
                properties: {
                    project_key: {
                        type: 'string',
                        description: 'Optional Jira project key to filter folders, e.g. "PROJ"',
                    },
                },
                required: [],
            },
        },
        {
            name: 'create_test_cycle',
            description: 'Creates a Test Cycle (Test Run) in Zephyr Scale and links the generated test cases to it.',
            inputSchema: {
                type: 'object',
                properties: {
                    project_key: { type: 'string', description: 'Jira/Zephyr project key' },
                    cycle_name: { type: 'string', description: 'Name for the test cycle' },
                    test_case_keys: {
                        type: 'array',
                        items: { type: 'string' },
                        description: 'List of Zephyr test case keys to include, e.g. ["PROJ-T1", "PROJ-T2"]',
                    },
                    issue_key: { type: 'string', description: 'Optional Jira issue key for traceability link' },
                    folder_path: { type: 'string', description: 'Optional folder path for the cycle' },
                },
                required: ['project_key', 'cycle_name', 'test_case_keys'],
            },
        },
        {
            name: 'create_test_plan',
            description: 'Creates a Test Plan in Zephyr Scale and links a test cycle to it.',
            inputSchema: {
                type: 'object',
                properties: {
                    project_key: { type: 'string', description: 'Jira/Zephyr project key' },
                    plan_name: { type: 'string', description: 'Name for the test plan' },
                    cycle_key: { type: 'string', description: 'Test cycle key to link, e.g. "PROJ-R1"' },
                    issue_key: { type: 'string', description: 'Optional Jira issue key for traceability' },
                    folder_path: { type: 'string', description: 'Optional folder path for the plan' },
                },
                required: ['project_key', 'plan_name', 'cycle_key'],
            },
        },
    ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        // ── 1. analyze_jira_ticket ─────────────────────────────────────────────
        if (name === 'analyze_jira_ticket') {
            const input = args?.jira_ticket_url as string;
            const ticketKey = JiraClient.extractTicketKey(input);
            const issue = await jira.fetchIssue(ticketKey);

            const reviewFindings = await claude.analyzeRequirement(
                issue.key,
                issue.summary,
                issue.description,
                issue.acceptanceCriteria,
            );

            return {
                content: [{
                    type: 'text',
                    text: [
                        `## Jira Ticket: ${issue.key}`,
                        `**Summary:** ${issue.summary}`,
                        `**Type:** ${issue.issueType}  |  **Status:** ${issue.status}  |  **Priority:** ${issue.priority}`,
                        `**Project:** ${issue.projectKey}`,
                        '',
                        `### Description`,
                        issue.description,
                        '',
                        `### Acceptance Criteria`,
                        issue.acceptanceCriteria,
                        '',
                        `---`,
                        '',
                        `### AI Review Findings`,
                        reviewFindings,
                        '',
                        `---`,
                        `**ticket_key:** ${issue.key}`,
                        `**ticket_summary:** ${issue.summary}`,
                        `**ticket_description:** ${issue.description}`,
                        `**acceptance_criteria:** ${issue.acceptanceCriteria}`,
                        `**review_findings:** ${reviewFindings}`,
                    ].join('\n'),
                }],
            };
        }

        // ── 2. generate_test_cases ─────────────────────────────────────────────
        if (name === 'generate_test_cases') {
            const { ticket_key, ticket_summary, ticket_description, acceptance_criteria, review_findings } = args as any;

            const raw = await claude.generateTestCases(
                ticket_key,
                ticket_summary,
                ticket_description,
                acceptance_criteria,
                review_findings,
            );

            // Strip markdown code fences if Claude wraps the JSON
            let cleaned = raw.trim();
            if (cleaned.startsWith('```')) {
                cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
            }

            let testCases: GeneratedTestCase[];
            try {
                testCases = JSON.parse(cleaned);
            } catch {
                return {
                    content: [{
                        type: 'text',
                        text: `**Error:** Could not parse test cases as JSON.\n\nRaw response:\n${raw}`,
                    }],
                    isError: true,
                };
            }

            const lines = [
                `## Generated Test Cases for ${ticket_key}`,
                `Generated **${testCases.length}** test case(s):`,
                '',
                ...testCases.map((tc, i) => [
                    `### ${i + 1}. ${tc.title}`,
                    `**Type:** ${tc.type}`,
                    '',
                    `**Steps:**`,
                    ...tc.steps.map(s => `- ${s}`),
                    '',
                    `**Expected Result:** ${tc.expected_result}`,
                    '',
                ].join('\n')),
                '---',
                '**test_cases_json:**',
                '```json',
                JSON.stringify(testCases, null, 2),
                '```',
            ];

            return { content: [{ type: 'text', text: lines.join('\n') }] };
        }

        // ── 3. refine_review ───────────────────────────────────────────────────
        if (name === 'refine_review') {
            const { ticket_key, ticket_summary, ticket_description, acceptance_criteria, current_findings, user_message } = args as any;

            const response = await claude.refineReview(
                ticket_key,
                ticket_summary,
                ticket_description,
                acceptance_criteria,
                current_findings,
                user_message,
            );

            return { content: [{ type: 'text', text: response }] };
        }

        // ── 4. refine_test_cases ───────────────────────────────────────────────
        if (name === 'refine_test_cases') {
            const { ticket_key, ticket_summary, ticket_description, acceptance_criteria, current_test_cases, user_message } = args as any;

            const response = await claude.refineTestCases(
                ticket_key,
                ticket_summary,
                ticket_description,
                acceptance_criteria,
                current_test_cases,
                user_message,
            );

            // Check if response is updated JSON array
            const trimmed = response.trim();
            if (trimmed.startsWith('[')) {
                try {
                    const updated: GeneratedTestCase[] = JSON.parse(trimmed);
                    return {
                        content: [{
                            type: 'text',
                            text: [
                                `## Updated Test Cases`,
                                `**${updated.length}** test case(s) after refinement:`,
                                '',
                                ...updated.map((tc, i) => [
                                    `### ${i + 1}. ${tc.title}`,
                                    `**Type:** ${tc.type}`,
                                    `**Steps:** ${tc.steps.join(' → ')}`,
                                    `**Expected Result:** ${tc.expected_result}`,
                                ].join('\n')),
                                '',
                                '**updated_test_cases_json:**',
                                '```json',
                                JSON.stringify(updated, null, 2),
                                '```',
                            ].join('\n'),
                        }],
                    };
                } catch {
                    // Fall through to return as text
                }
            }

            return { content: [{ type: 'text', text: response }] };
        }

        // ── 5. post_test_cases_to_zephyr ───────────────────────────────────────
        if (name === 'post_test_cases_to_zephyr') {
            const issueKey = args?.issue_key as string;
            const testCases = args?.test_cases as GeneratedTestCase[];
            const folderPath = args?.folder_path as string | undefined;

            const projectKey = await jira.fetchProjectKey(issueKey);

            // Ensure folder exists before creating test cases
            if (folderPath) {
                await zephyr.ensureFolder(projectKey, folderPath, 'TEST_CASE');
            }

            const created = [];
            for (const tc of testCases) {
                const result = await zephyr.createTestCase(projectKey, tc, issueKey, folderPath);
                created.push(result);
            }

            const lines = [
                `## Test Cases Created in Zephyr Scale`,
                `Successfully created **${created.length}** test case(s) linked to **${issueKey}**:`,
                '',
                ...created.map((tc, i) => `${i + 1}. **${tc.key}** — ${tc.name}\n   ${tc.url}`),
                '',
                `**created_test_case_keys:** ${created.map(tc => tc.key).join(', ')}`,
                '',
                `Use these keys with \`create_test_cycle\` to create a test cycle.`,
            ];

            return { content: [{ type: 'text', text: lines.join('\n') }] };
        }

        // ── 6. post_findings_comment ───────────────────────────────────────────
        if (name === 'post_findings_comment') {
            const issueKey = args?.issue_key as string;
            const findings = args?.findings as string;

            await jira.postComment(issueKey, `QA Review Findings (AI-generated)\n\n${findings}`);

            return {
                content: [{
                    type: 'text',
                    text: `✓ Review findings posted as a comment on **${issueKey}**.`,
                }],
            };
        }

        // ── 7. list_zephyr_folders ─────────────────────────────────────────────
        if (name === 'list_zephyr_folders') {
            const projectKey = args?.project_key as string | undefined;
            const folders = await zephyr.listFolders(projectKey);

            const renderFolders = (items: typeof folders, indent = ''): string[] => {
                const lines: string[] = [];
                for (const f of items) {
                    lines.push(`${indent}- ${f.path}`);
                    if (f.children.length > 0) {
                        lines.push(...renderFolders(f.children, indent + '  '));
                    }
                }
                return lines;
            };

            const folderLines = renderFolders(folders);
            return {
                content: [{
                    type: 'text',
                    text: folderLines.length
                        ? `## Zephyr Folders\n\n${folderLines.join('\n')}`
                        : 'No folders found. You can enter a folder path manually — it will be created automatically.',
                }],
            };
        }

        // ── 8. create_test_cycle ───────────────────────────────────────────────
        if (name === 'create_test_cycle') {
            const { project_key, cycle_name, test_case_keys, issue_key, folder_path } = args as any;

            if (folder_path) {
                await zephyr.ensureFolder(project_key, folder_path, 'TEST_RUN');
            }

            const cycle = await zephyr.createTestCycle(
                project_key,
                cycle_name,
                test_case_keys,
                issue_key,
                undefined,
                folder_path,
            );

            if (issue_key) {
                await jira.addRemoteLink(issue_key, `Test Cycle: ${cycle_name}`, cycle.url, 'Test Cycle');
            }

            return {
                content: [{
                    type: 'text',
                    text: [
                        `## Test Cycle Created`,
                        `**Cycle:** ${cycle.key} — ${cycle.name}`,
                        `**URL:** ${cycle.url}`,
                        `**Test Cases:** ${test_case_keys.join(', ')}`,
                        issue_key ? `\nLinked back to **${issue_key}** as a remote link.` : '',
                        '',
                        `**cycle_key:** ${cycle.key}`,
                    ].join('\n'),
                }],
            };
        }

        // ── 9. create_test_plan ────────────────────────────────────────────────
        if (name === 'create_test_plan') {
            const { project_key, plan_name, cycle_key, issue_key, folder_path } = args as any;

            if (folder_path) {
                await zephyr.ensureFolder(project_key, folder_path, 'TEST_PLAN');
            }

            const plan = await zephyr.createTestPlan(project_key, plan_name, cycle_key, issue_key, folder_path);

            return {
                content: [{
                    type: 'text',
                    text: [
                        `## Test Plan Created`,
                        `**Plan:** ${plan.key} — ${plan.name}`,
                        `**URL:** ${plan.url}`,
                        `**Linked Cycle:** ${cycle_key}`,
                        issue_key ? `**Linked Issue:** ${issue_key}` : '',
                    ].join('\n'),
                }],
            };
        }

        throw new Error(`Unknown tool: ${name}`);

    } catch (error) {
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
    process.stderr.write('VRS TC Generator MCP server running (Claude-powered)\n');
}

main().catch((err) => {
    process.stderr.write(`Fatal: ${err}\n`);
    process.exit(1);
});
