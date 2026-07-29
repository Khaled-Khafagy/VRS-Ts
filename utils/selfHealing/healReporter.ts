import fs from 'fs';
import path from 'path';
import { HealEvent } from './types';

const EVENTS_DIR = path.resolve(__dirname, '../../test-results/heal-events');
const inProcessEvents: HealEvent[] = [];

export function recordEvent(event: HealEvent): void {
    inProcessEvents.push(event);
    try {
        fs.mkdirSync(EVENTS_DIR, { recursive: true });
        fs.appendFileSync(path.join(EVENTS_DIR, `${process.pid}.jsonl`), JSON.stringify(event) + '\n');
    } catch {
        // Reporting must never break a test run.
    }
}

export function getInProcessEvents(): HealEvent[] {
    return inProcessEvents;
}

export function clearEventsDir(): void {
    if (fs.existsSync(EVENTS_DIR)) fs.rmSync(EVENTS_DIR, { recursive: true, force: true });
}

/** Aggregates every worker's JSONL file into one list. Call from the main process (reporter onEnd). */
export function readAllEvents(): HealEvent[] {
    if (!fs.existsSync(EVENTS_DIR)) return [];
    const events: HealEvent[] = [];
    for (const file of fs.readdirSync(EVENTS_DIR)) {
        if (!file.endsWith('.jsonl')) continue;
        const lines = fs.readFileSync(path.join(EVENTS_DIR, file), 'utf-8').split('\n').filter(Boolean);
        for (const line of lines) {
            try {
                events.push(JSON.parse(line));
            } catch {
                // skip malformed line
            }
        }
    }
    return events;
}
