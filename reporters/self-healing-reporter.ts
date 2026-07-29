import { Reporter } from '@playwright/test/reporter';
import { SelfHealingConfig } from '../utils/selfHealing/config';
import { clearEventsDir, readAllEvents } from '../utils/selfHealing/healReporter';
import { patch } from '../utils/selfHealing/codemodPatcher';
import { HealEvent } from '../utils/selfHealing/types';

class SelfHealingReporter implements Reporter {
    onBegin() {
        clearEventsDir();
    }

    onEnd() {
        const events = readAllEvents();
        if (events.length === 0) return;

        const healed = events.filter((e) => e.outcome === 'healed-snapshot' || e.outcome === 'healed-ai');
        const failed = events.filter((e) => e.outcome === 'failed');

        console.log(`\n[self-healing] ${healed.length} locator(s) healed, ${failed.length} locator(s) failed to heal, ${events.length} total heal checks.`);
        for (const e of healed) {
            console.log(`  ✔ healed ${e.pageName}.${e.key} via ${e.outcome === 'healed-ai' ? 'AI match' : 'snapshot'}`);
        }
        for (const e of failed) {
            console.log(`  ✘ could not heal ${e.pageName}.${e.key}`);
        }

        if (!SelfHealingConfig.autoHealPatch) return;
        this.applyPatches(healed);
    }

    private applyPatches(healed: HealEvent[]) {
        // Only patch once per (sourceFile, key) — keep the last successful heal.
        const latestByTarget = new Map<string, HealEvent>();
        for (const event of healed) {
            if (!event.sourceFile || !event.usedDescriptor) continue;
            latestByTarget.set(`${event.sourceFile}::${event.key}`, event);
        }

        for (const event of latestByTarget.values()) {
            const result = patch({
                filePath: event.sourceFile!,
                key: event.key,
                descriptor: event.usedDescriptor!,
            });
            if (result.applied) {
                console.log(`[self-healing] patched ${result.filePath} (${result.key}): ${result.oldSource} -> ${result.newSource}`);
            } else if (result.reason) {
                console.log(`[self-healing] could not patch ${event.sourceFile} (${event.key}): ${result.reason}`);
            }
        }
    }
}

export default SelfHealingReporter;
