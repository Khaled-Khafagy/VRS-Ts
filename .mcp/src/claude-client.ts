import { execSync } from 'node:child_process';
import { writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export class CopilotClient {
    private readonly ghToken: string;

    constructor(ghToken: string) {
        if (!ghToken) throw new Error('GH_TOKEN is required for Copilot CLI');
        this.ghToken = ghToken;
    }

    async invoke(systemPrompt: string, userPrompt: string, _maxTokens = 4096): Promise<string> {
        const fullPrompt = `System instructions: ${systemPrompt}\n\n${userPrompt}`;
        const tempFile = join(tmpdir(), `copilot_${Date.now()}.txt`);

        writeFileSync(tempFile, fullPrompt, 'utf-8');

        let output: string;
        try {
            output = execSync(`type "${tempFile}" | copilot --yolo -s`, {
                env: { ...process.env, GH_TOKEN: this.ghToken },
                timeout: 120_000,
                encoding: 'utf-8',
                windowsHide: true,
                shell: 'cmd.exe',
            });
        } catch (err: any) {
            // execSync throws on non-zero exit; stdout may still contain the response
            output = (err.stdout as string) ?? '';
            if (!output || output.trim().length < 10) {
                throw new Error(`Copilot CLI failed: ${err.message ?? String(err)}`);
            }
        } finally {
            try { unlinkSync(tempFile); } catch { /* ignore */ }
        }

        return this.extractResponse(output);
    }

    /** Strip ANSI codes and the Copilot stats footer from raw CLI output. */
    private extractResponse(raw: string): string {
        const cleaned = raw.replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, '');

        const lines = cleaned.split('\n');
        const responseLines: string[] = [];
        for (const line of lines) {
            if (/^(Changes|Requests|Tokens|Files)\s/.test(line.trim())) break;
            responseLines.push(line);
        }

        return responseLines.join('\n').trim();
    }

    // ── High-level prompt methods ────────────────────────────────────────────

    async analyzeRequirement(
        ticketKey: string,
        summary: string,
        description: string,
        acceptanceCriteria: string,
    ): Promise<string> {
        const systemPrompt =
            'You are a senior QA analyst. Output ONLY the formatted analysis. ' +
            'Start with bold text (**text**) for headers, not markdown headers. ' +
            'Use emojis, bullets (•), and horizontal separator lines (────).';

        const userPrompt = `You are a senior QA analyst reviewing a Jira ticket before test case creation.

Ticket: ${ticketKey}
Summary: ${summary}
Description: ${description}
Acceptance Criteria: ${acceptanceCriteria || 'Not provided'}

Review this requirement and identify issues in these categories:
1. Ambiguities (unclear or vague statements)
2. Missing information (things a tester would need to know)
3. Untestable acceptance criteria
4. Edge cases not covered in the ACs
5. Risks (potential risks or challenges in implementation or testing)

FORMATTING REQUIREMENTS:
- Use clear section headers with bold text and emojis
- Use bullet points (•) instead of nested numbering
- Add blank lines between sections for readability
- Keep each point concise (1-2 sentences max)

REQUIRED FORMAT:
**📋 Review Findings - [Complete/Incomplete/Critical Issues]**
────────────────────────────────────────────────────────
**🔍 Ambiguities**
• [Point 1]

**❓ Missing Information**
• [Point 1]

**⚠️ Untestable Acceptance Criteria**
• [Point 1]

**🎯 Edge Cases Not Covered**
• [Point 1]

**🚩 Risks**
• [Point 1]
────────────────────────────────────────────────────────

If the requirement is clear and complete, respond with:
**✓ Review Complete - No Issues Found**

CRITICAL: Start your response IMMEDIATELY with the findings. NO introductory text.`;

        return this.invoke(systemPrompt, userPrompt);
    }

    async generateTestCases(
        ticketKey: string,
        summary: string,
        description: string,
        acceptanceCriteria: string,
        reviewFindings?: string,
    ): Promise<string> {
        const systemPrompt =
            'You are a professional QA engineer following industry standards. ' +
            'Output ONLY valid JSON. No text before or after the JSON array. ' +
            'No markdown code blocks. No explanations. ' +
            'Just the raw JSON array starting with [ and ending with ].';

        const findingsSection = reviewFindings
            ? `\nReview Findings (address these in your test cases):\n${reviewFindings}\n`
            : '';

        const userPrompt = `You are a professional QA engineer. Generate comprehensive, professional test cases for this Jira ticket.

Ticket: ${ticketKey}
Summary: ${summary}
Description: ${description}
Acceptance Criteria: ${acceptanceCriteria || 'Not provided'}
${findingsSection}
QA PROFESSIONAL STANDARDS - STRICTLY FOLLOW:
1. Test case titles MUST start with: "Verify", "Validate", "Ensure", "Confirm", "Check"
2. Steps must be numbered, clear, and actionable
3. Expected results must be specific and measurable
4. Cover: positive scenarios, negative scenarios, edge cases

CRITICAL: Your response must be ONLY a valid JSON array starting with [ and ending with ].

Each item must have:
{
  "title": "Verify/Validate/Ensure [specific functionality]",
  "type": "positive|negative|edge",
  "steps": ["1. [Action]", "2. [Action]"],
  "expected_result": "[Specific, measurable outcome]"
}`;

        return this.invoke(systemPrompt, userPrompt);
    }

    async refineReview(
        ticketKey: string,
        summary: string,
        description: string,
        acceptanceCriteria: string,
        currentFindings: string,
        userMessage: string,
    ): Promise<string> {
        const systemPrompt =
            "You are a QA analyst. When updating findings, respond ONLY with the formatted findings starting with '**📋'. " +
            'Use bold text (**text**) for headers, emojis, bullets (•), and horizontal separator lines (────). No conversational preamble.';

        const userPrompt = `You are a senior QA analyst. You previously reviewed a Jira ticket and provided findings.

Ticket: ${ticketKey}
Summary: ${summary}
Description: ${description}
Acceptance Criteria: ${acceptanceCriteria || 'Not provided'}

Your previous findings:
${currentFindings}

User question/comment: ${userMessage}

CRITICAL INSTRUCTIONS:
- If the user is asking a question or wants clarification, respond conversationally.
- If the user wants to UPDATE or MODIFY the findings, respond ONLY with the complete updated findings.
- Start IMMEDIATELY with "**" when updating findings — NO preamble.`;

        return this.invoke(systemPrompt, userPrompt);
    }

    async refineTestCases(
        ticketKey: string,
        summary: string,
        description: string,
        acceptanceCriteria: string,
        currentTestCases: string,
        userMessage: string,
    ): Promise<string> {
        const systemPrompt =
            'You are a QA engineer. When updating test cases, respond ONLY with a valid JSON array starting with [. ' +
            'When answering questions, respond naturally. No markdown code blocks.';

        const userPrompt = `You are a professional QA engineer. You previously generated test cases for a Jira ticket.

Ticket: ${ticketKey}
Summary: ${summary}
Description: ${description}
Acceptance Criteria: ${acceptanceCriteria || 'Not provided'}

Current test cases:
${currentTestCases}

User message: ${userMessage}

CRITICAL INSTRUCTIONS:
- If the user is asking a QUESTION or wants CLARIFICATION, respond conversationally.
- If the user wants to UPDATE, MODIFY, ADD, REMOVE, or CHANGE test cases, respond ONLY with a valid JSON array.
- Include ALL test cases (not just changed ones). Start with [ and end with ].`;

        return this.invoke(systemPrompt, userPrompt);
    }
}
