import fs from 'fs';
import path from 'path';
import { LocatorDescriptor, SnapshotFile } from './types';

const SNAPSHOT_DIR = path.resolve(__dirname, 'snapshots');

// Per-page in-process mutex so concurrent async heals within one worker
// don't interleave read-modify-write cycles on the same snapshot file.
const locks = new Map<string, Promise<void>>();

function filePathFor(pageName: string): string {
    return path.join(SNAPSHOT_DIR, `${pageName}.json`);
}

function readSync(pageName: string): SnapshotFile {
    const file = filePathFor(pageName);
    if (!fs.existsSync(file)) {
        return { pageName, updatedAt: new Date().toISOString(), locators: {} };
    }
    try {
        return JSON.parse(fs.readFileSync(file, 'utf-8'));
    } catch {
        return { pageName, updatedAt: new Date().toISOString(), locators: {} };
    }
}

export async function read(pageName: string): Promise<SnapshotFile> {
    return readSync(pageName);
}

/**
 * Merges a descriptor into the page's snapshot file and writes it atomically
 * (temp file + rename). Safe against interleaving within this process; across
 * concurrent worker processes this is last-write-wins, which is acceptable —
 * this store is an opportunistic "last known good" cache, not a source of truth.
 */
export async function upsertDescriptor(pageName: string, descriptor: LocatorDescriptor): Promise<void> {
    const previous = locks.get(pageName) ?? Promise.resolve();
    const next = previous
        .catch(() => {})
        .then(() => writeMerged(pageName, descriptor));
    locks.set(pageName, next);
    return next;
}

async function writeMerged(pageName: string, descriptor: LocatorDescriptor): Promise<void> {
    fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
    const current = readSync(pageName);
    current.locators[descriptor.key] = descriptor;
    current.updatedAt = new Date().toISOString();

    const file = filePathFor(pageName);
    const tempFile = `${file}.${process.pid}.${Date.now()}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(current, null, 2));
    fs.renameSync(tempFile, file);
}
