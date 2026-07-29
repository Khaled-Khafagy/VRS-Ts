import { Locator, Page } from '@playwright/test';
import { SelfHealingConfig } from './config';
import { captureDescriptor } from './descriptorCapture';
import * as strategyBuilder from './strategyBuilder';
import * as snapshotStore from './snapshotStore';
import { recordEvent } from './healReporter';
import { findBestMatch } from './aiMatcher';
import { HealEvent, LocatorDescriptor } from './types';

export interface HealOptions {
    key: string;
    primary: Locator;
    pageName: string;
    sourceFilePath: string;
    testTitle?: string;
}

async function isAlive(locator: Locator, timeoutMs: number): Promise<boolean> {
    try {
        await locator.first().waitFor({ state: 'attached', timeout: timeoutMs });
        return true;
    } catch {
        return false;
    }
}

function nowIso(): string {
    return new Date().toISOString();
}

/** Fire-and-forget: refreshes the stored descriptor for a locator that resolved successfully. */
function captureAndStoreSnapshot(opts: HealOptions): void {
    captureDescriptor(opts.key, opts.primary)
        .then((descriptor) => {
            if (descriptor) return snapshotStore.upsertDescriptor(opts.pageName, descriptor);
        })
        .catch(() => {
            // Snapshot capture is best-effort only; never let it affect the test run.
        });
}

export async function healLocator(page: Page, opts: HealOptions): Promise<Locator> {
    const timeout = SelfHealingConfig.fastCheckTimeoutMs;
    const baseEvent: Omit<HealEvent, 'outcome'> = {
        pageName: opts.pageName,
        key: opts.key,
        timestamp: nowIso(),
        testTitle: opts.testTitle,
        sourceFile: opts.sourceFilePath,
    };

    // 1. Fast liveness check on the primary locator.
    if (await isAlive(opts.primary, timeout)) {
        captureAndStoreSnapshot(opts);
        recordEvent({ ...baseEvent, outcome: 'primary-ok' });
        return opts.primary;
    }

    // 2. Stored "last known good" descriptor.
    const snapshot = await snapshotStore.read(opts.pageName);
    const storedDescriptor: LocatorDescriptor | undefined = snapshot.locators[opts.key];
    if (storedDescriptor) {
        const candidate = strategyBuilder.build(page, storedDescriptor);
        if (await isAlive(candidate, timeout)) {
            recordEvent({
                ...baseEvent,
                outcome: 'healed-snapshot',
                usedDescriptor: storedDescriptor,
                previousDescriptor: storedDescriptor,
            });
            snapshotStore.upsertDescriptor(opts.pageName, storedDescriptor).catch(() => {});
            return candidate;
        }
    }

    // 3. Snapshot-derived alternates (looser matches based on the stale descriptor).
    for (const alt of strategyBuilder.deriveAlternates(page, opts.key, storedDescriptor)) {
        if (await isAlive(alt.locator, timeout)) {
            recordEvent({
                ...baseEvent,
                outcome: 'healed-snapshot',
                usedDescriptor: alt.descriptor,
                previousDescriptor: storedDescriptor,
            });
            snapshotStore.upsertDescriptor(opts.pageName, alt.descriptor).catch(() => {});
            return alt.locator;
        }
    }

    // 4. AI-assisted, last resort (gated behind AI_HEAL + ANTHROPIC_API_KEY).
    if (SelfHealingConfig.aiHealEnabled) {
        const aiResult = await findBestMatch(page, opts.key, storedDescriptor);
        if (aiResult && (await isAlive(aiResult.locator, timeout))) {
            recordEvent({
                ...baseEvent,
                outcome: 'healed-ai',
                usedDescriptor: aiResult.descriptor,
                previousDescriptor: storedDescriptor,
            });
            snapshotStore.upsertDescriptor(opts.pageName, aiResult.descriptor).catch(() => {});
            return aiResult.locator;
        }
    }

    // 5. Nothing worked — return the original locator so Playwright's own
    //    timeout error (with its normal actionable diagnostics) surfaces at the call site.
    recordEvent({ ...baseEvent, outcome: 'failed', previousDescriptor: storedDescriptor });
    return opts.primary;
}
