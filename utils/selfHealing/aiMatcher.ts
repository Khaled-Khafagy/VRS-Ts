import Anthropic from '@anthropic-ai/sdk';
import { Locator, Page } from '@playwright/test';
import { SelfHealingConfig } from './config';
import { LocatorDescriptor } from './types';

let client: Anthropic | undefined;
function getClient(): Anthropic {
    if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    return client;
}

interface AiMatchResult {
    locator: Locator;
    descriptor: LocatorDescriptor;
}

const MATCH_TOOL = {
    name: 'report_match',
    description: 'Reports the single best-matching element for the requested locator, or that none was found.',
    input_schema: {
        type: 'object' as const,
        properties: {
            found: { type: 'boolean' as const },
            role: { type: 'string' as const, description: 'ARIA role of the matched element, e.g. "heading", "button".' },
            accessibleName: { type: 'string' as const, description: 'Accessible name / visible text of the matched element.' },
            confidence: { type: 'number' as const, description: '0-1 confidence that this is the correct replacement element.' },
            reasoning: { type: 'string' as const },
        },
        required: ['found', 'confidence', 'reasoning'],
    },
};

/**
 * Last-resort locator healer: shows Claude an ARIA snapshot of the page plus the
 * broken locator's key/last-known descriptor, and asks it to name the single best
 * replacement element. The suggestion is NEVER trusted blindly — the caller must
 * still verify the returned locator resolves to a live element before using it.
 */
export async function findBestMatch(
    page: Page,
    key: string,
    staleDescriptor?: LocatorDescriptor,
): Promise<AiMatchResult | undefined> {
    if (!SelfHealingConfig.aiHealEnabled) return undefined;

    let ariaSnapshot: string;
    try {
        ariaSnapshot = await page.locator('body').ariaSnapshot();
    } catch {
        return undefined;
    }

    const context = staleDescriptor
        ? `Its last known description was: strategy=${staleDescriptor.strategy}, role=${staleDescriptor.role ?? 'n/a'}, accessibleName=${staleDescriptor.accessibleName ?? 'n/a'}, text=${staleDescriptor.text ?? 'n/a'}, testId=${staleDescriptor.testId ?? 'n/a'}.`
        : 'No prior descriptor is available for this locator.';

    let response;
    try {
        response = await getClient().messages.create({
            model: SelfHealingConfig.aiHealModel,
            max_tokens: 1024,
            tools: [MATCH_TOOL],
            tool_choice: { type: 'tool', name: 'report_match' },
            messages: [
                {
                    role: 'user',
                    content:
                        `A Playwright test locator named "${key}" no longer resolves to any element on the page.\n` +
                        `${context}\n\n` +
                        `Here is the current page's ARIA accessibility tree:\n${ariaSnapshot}\n\n` +
                        `Find the single element that most likely replaced it (e.g. a renamed heading or button with the ` +
                        `same intent). Call report_match with your answer. If nothing plausible matches, set found=false.`,
                },
            ],
        });
    } catch {
        return undefined;
    }

    const toolUse = response.content.find((block) => block.type === 'tool_use');
    if (!toolUse || toolUse.type !== 'tool_use') return undefined;

    const input = toolUse.input as {
        found: boolean;
        role?: string;
        accessibleName?: string;
        confidence: number;
        reasoning: string;
    };

    if (!input.found || !input.role || !input.accessibleName) return undefined;
    if (input.confidence < SelfHealingConfig.aiMinConfidence) return undefined;

    const descriptor: LocatorDescriptor = {
        key,
        strategy: 'role',
        role: input.role,
        accessibleName: input.accessibleName,
        capturedAt: new Date().toISOString(),
    };

    return {
        locator: page.getByRole(input.role as any, { name: input.accessibleName }),
        descriptor,
    };
}
