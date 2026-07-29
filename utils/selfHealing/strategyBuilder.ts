import { Locator, Page } from '@playwright/test';
import { LocatorDescriptor } from './types';

/** Rebuilds a real Playwright Locator from a stored descriptor. */
export function build(page: Page, descriptor: LocatorDescriptor): Locator {
    switch (descriptor.strategy) {
        case 'testId':
            return page.getByTestId(descriptor.testId!);
        case 'role':
            return page.getByRole(descriptor.role as any, {
                name: descriptor.nameIsRegex ? new RegExp(descriptor.accessibleName!) : descriptor.accessibleName,
            });
        case 'text':
            return page.getByText(descriptor.textIsRegex ? new RegExp(descriptor.text!) : descriptor.text!);
        case 'css':
            return page.locator(descriptor.cssPath!);
    }
}

interface Candidate {
    locator: Locator;
    descriptor: LocatorDescriptor;
}

/**
 * Given a stale descriptor, derive a handful of looser candidate locators to try
 * before escalating to the AI matcher (e.g. partial text match, role without a name).
 */
export function deriveAlternates(page: Page, key: string, stale?: LocatorDescriptor): Candidate[] {
    if (!stale) return [];
    const candidates: Candidate[] = [];
    const capturedAt = new Date().toISOString();

    if (stale.text) {
        const words = stale.text.split(/\s+/).filter(Boolean);
        const snippet = words.slice(0, Math.max(1, Math.min(4, words.length))).join(' ');
        if (snippet) {
            candidates.push({
                locator: page.getByText(snippet, { exact: false }),
                descriptor: { key, strategy: 'text', text: snippet, textIsRegex: false, capturedAt },
            });
        }
    }

    if (stale.role) {
        candidates.push({
            locator: page.getByRole(stale.role as any).first(),
            descriptor: { key, strategy: 'role', role: stale.role, capturedAt },
        });
    }

    return candidates;
}
