import { test as base } from '@playwright/test';
import type { Page, TestInfo } from '@playwright/test';

// Every Page object calls `test.step(...)` imported directly from '@playwright/test', not from
// fixtures/page-manager — so the only way to attach a screenshot after *every* step, in every
// Page file, without touching each call site, is to patch the shared `test.step` once here.
// Node module caching means '@playwright/test' resolves to the same object everywhere, so this
// patch (installed from fixtures/page-manager.ts) applies globally.

const pageByTestId = new Map<string, Page>();

export function registerPageForStepScreenshots(testInfo: TestInfo, page: Page): void {
    pageByTestId.set(testInfo.testId, page);
}

export function unregisterPageForStepScreenshots(testInfo: TestInfo): void {
    pageByTestId.delete(testInfo.testId);
}

let installed = false;

export function installStepScreenshots(): void {
    if (installed) return;
    installed = true;

    const originalStep = base.step.bind(base);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (base as any).step = (title: string, body: (...args: any[]) => any, options?: any) => {
        return originalStep(
            title,
            async (...args: any[]) => {
                try {
                    return await body(...args);
                } finally {
                    await attachStepScreenshot(title);
                }
            },
            options
        );
    };
}

async function attachStepScreenshot(title: string): Promise<void> {
    const testInfo = base.info();
    const page = pageByTestId.get(testInfo.testId);
    if (!page || page.isClosed()) return;

    try {
        // fullPage, not viewport-only: most steps are pure `expect(...).toBeVisible()` checks,
        // which don't scroll the page the way a click/fill would — so a viewport screenshot would
        // just show whatever was on screen from the last real interaction, not the thing being
        // verified. Capturing the whole page guarantees the verified element is actually in shot.
        const screenshot = await page.screenshot({ fullPage: true });
        // Playwright auto-wraps every testInfo.attach() call in its own step named after the
        // attachment — naming it differently from `title` keeps that from reading as a duplicate
        // of the step it belongs to.
        await testInfo.attach(`Screenshot — ${title}`, { body: screenshot, contentType: 'image/png' });
    } catch {
        // Page may be mid-navigation or already closing between steps — skip rather than fail the test.
    }
}
