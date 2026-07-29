export type LocatorStrategy = 'role' | 'testId' | 'text' | 'css';

export interface LocatorDescriptor {
    key: string;
    strategy: LocatorStrategy;
    role?: string;
    accessibleName?: string;
    nameIsRegex?: boolean;
    testId?: string;
    text?: string;
    textIsRegex?: boolean;
    tagName?: string;
    cssPath?: string;
    capturedAt: string;
}

export type HealOutcome = 'primary-ok' | 'healed-snapshot' | 'healed-ai' | 'failed';

export interface HealEvent {
    pageName: string;
    key: string;
    outcome: HealOutcome;
    usedDescriptor?: LocatorDescriptor;
    previousDescriptor?: LocatorDescriptor;
    timestamp: string;
    testTitle?: string;
    sourceFile?: string;
}

export interface SnapshotFile {
    pageName: string;
    updatedAt: string;
    locators: Record<string, LocatorDescriptor>;
}
