/**
 * Extracts the first balanced top-level JSON object from arbitrary LLM output,
 * tolerating code fences and surrounding prose. Returns null when none parses.
 */
function extractJsonObject(raw: string): any | null {
    let text = raw.trim();
    const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fence) text = fence[1].trim();

    const start = text.indexOf('{');
    if (start === -1) return null;

    let depth = 0;
    let inStr = false;
    let escape = false;
    for (let i = start; i < text.length; i++) {
        const ch = text[i];
        if (escape) { escape = false; continue; }
        if (ch === '\\') { escape = true; continue; }
        if (ch === '"') { inStr = !inStr; continue; }
        if (inStr) continue;
        if (ch === '{') depth++;
        else if (ch === '}') {
            depth--;
            if (depth === 0) {
                const candidate = text.slice(start, i + 1);
                try { return JSON.parse(candidate); } catch { return null; }
            }
        }
    }
    return null;
}

export class ClaudeClient {
    private readonly apiKey: string;

    constructor(apiKey: string) {
        if (!apiKey) throw new Error('ANTHROPIC_API_KEY (or ANTHROPIC_AUTH_TOKEN) is required');
        this.apiKey = apiKey;
    }

    async invoke(systemPrompt: string, userPrompt: string, maxTokens = 4096): Promise<string> {
        return this.invokeAnthropic(this.apiKey, systemPrompt, userPrompt, maxTokens);
    }

    private async invokeAnthropic(apiKey: string, systemPrompt: string, userPrompt: string, maxTokens: number): Promise<string> {
        const isOAuth = apiKey.startsWith('sk-ant-oat');
        const headers: Record<string, string> = {
            'content-type': 'application/json',
            'anthropic-version': '2023-06-01',
        };
        if (isOAuth) {
            headers['authorization'] = `Bearer ${apiKey}`;
            headers['anthropic-beta'] = 'oauth-2025-04-20';
        } else {
            headers['x-api-key'] = apiKey;
        }

        const res = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                model: process.env.ANTHROPIC_MODEL || 'claude-opus-4-8',
                max_tokens: maxTokens,
                system: systemPrompt,
                messages: [{ role: 'user', content: userPrompt }],
            }),
            signal: AbortSignal.timeout(120_000),
        });

        if (!res.ok) {
            const body = await res.text();
            throw new Error(`Anthropic API ${res.status}: ${body}`);
        }
        const data = await res.json() as any;
        return (data.content || [])
            .filter((b: any) => b.type === 'text')
            .map((b: any) => b.text)
            .join('')
            .trim();
    }

    // ── High-level prompt methods ────────────────────────────────────────────

    /** Drafts a Jira bug report from test-execution context. Returns JSON {summary, description}. */
    async draftBugReport(context: {
        testCaseKey: string;
        testCaseName: string;
        testCycleKey?: string;
        notes?: string;
        environment?: string;
    }): Promise<{ summary: string; description: string }> {
        const systemPrompt =
            'You are a senior QA engineer at Vodafone writing a high-quality, production-ready ' +
            'Jira bug report. Return ONLY a single JSON object, no prose before or after, no ' +
            'code fences: {"summary": "...", "description": "..."}.\n' +
            'summary: a concise, specific one-liner in the form "[Area] Problem — condition".\n' +
            'description: rich Jira wiki markup with these exact sections in order:\n' +
            'h3. Summary — one short paragraph of what is broken and its user impact.\n' +
            'h3. Pre-conditions — bulleted (*) setup/state needed.\n' +
            'h3. Steps to Reproduce — a numbered list (# ) of concrete UI steps.\n' +
            'h3. Expected Result — what should happen per the test case.\n' +
            'h3. Actual Result — what actually happened, from the tester brief.\n' +
            'h3. Severity / Priority — a reasoned suggestion (Blocker/Critical/Major/Minor).\n' +
            'h3. Evidence — state that a screen recording GIF is attached.\n' +
            'Write in clear professional English. Infer realistic steps from the test case name ' +
            'and the tester brief; where a detail is genuinely unknown, add {color:#de350b}[TO VERIFY]{color}.';

        const userPrompt = [
            `A test execution FAILED. Draft the bug report from the following context.`,
            `Test case: ${context.testCaseKey} — ${context.testCaseName}`,
            context.testCycleKey ? `Test cycle: ${context.testCycleKey}` : '',
            context.environment ? `Environment: ${context.environment}` : '',
            context.notes
                ? `Tester brief / observed behaviour (PRIMARY source — base Actual Result on this): ${context.notes}`
                : 'No tester brief was provided; infer conservatively from the test case name.',
        ].filter(Boolean).join('\n');

        const raw = await this.invoke(systemPrompt, userPrompt);
        const parsed = extractJsonObject(raw);
        if (!parsed || !parsed.summary || !parsed.description) {
            throw new Error('Draft missing summary/description');
        }
        return { summary: String(parsed.summary), description: String(parsed.description) };
    }

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
