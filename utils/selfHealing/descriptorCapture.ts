import { Locator } from '@playwright/test';
import { LocatorDescriptor } from './types';

function parseAriaSnapshot(snapshot: string): { role?: string; name?: string } {
    // First line of an ariaSnapshot() looks like: `- heading "Thank you for your order!" [level=1]`
    const firstLine = snapshot.split('\n')[0] ?? '';
    const match = firstLine.match(/^-\s+([a-zA-Z]+)(?:\s+"([^"]*)")?/);
    if (!match) return {};
    return { role: match[1], name: match[2] };
}

/**
 * Resolves the currently-live element behind a Locator into a LocatorDescriptor,
 * preferring the most resilient strategy available (testId > role/name > text > css).
 */
export async function captureDescriptor(key: string, locator: Locator): Promise<LocatorDescriptor | undefined> {
    const target = locator.first();
    try {
        const [testId, tagName, text, ariaSnapshot] = await Promise.all([
            target.getAttribute('data-testid').catch(() => null),
            target.evaluate((el) => el.tagName.toLowerCase()).catch(() => undefined),
            target.textContent().catch(() => null),
            target.ariaSnapshot().catch(() => ''),
        ]);

        const capturedAt = new Date().toISOString();
        const trimmedText = text?.trim().slice(0, 160) || undefined;
        const { role, name } = parseAriaSnapshot(ariaSnapshot);

        if (testId) {
            return { key, strategy: 'testId', testId, tagName, capturedAt };
        }
        if (role && name) {
            return { key, strategy: 'role', role, accessibleName: name, tagName, capturedAt };
        }
        if (trimmedText) {
            return { key, strategy: 'text', text: trimmedText, tagName, capturedAt };
        }

        const cssPath = await buildCssPathFallback(locator).catch(() => undefined);
        if (cssPath) {
            return { key, strategy: 'css', cssPath, tagName, capturedAt };
        }
        return undefined;
    } catch {
        return undefined;
    }
}

async function buildCssPathFallback(locator: Locator): Promise<string | undefined> {
    const target = locator.first();
    return target.evaluate((el) => {
        const id = el.getAttribute('id');
        if (id) return `#${id}`;
        const className = (el.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean)[0];
        const tag = el.tagName.toLowerCase();
        return className ? `${tag}.${className}` : tag;
    });
}
