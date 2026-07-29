import { Project, PropertyAssignment, SyntaxKind } from 'ts-morph';
import { LocatorDescriptor } from './types';

function renderLocatorSource(descriptor: LocatorDescriptor): string {
    switch (descriptor.strategy) {
        case 'testId':
            return `this.page.getByTestId(${JSON.stringify(descriptor.testId)})`;
        case 'role': {
            const name = descriptor.accessibleName ? `, { name: ${JSON.stringify(descriptor.accessibleName)} }` : '';
            return `this.page.getByRole(${JSON.stringify(descriptor.role)}${name})`;
        }
        case 'text':
            return `this.page.getByText(${JSON.stringify(descriptor.text)})`;
        case 'css':
            return `this.page.locator(${JSON.stringify(descriptor.cssPath)})`;
    }
}

export interface PatchRequest {
    filePath: string;
    key: string;
    descriptor: LocatorDescriptor;
    dryRun?: boolean;
}

export interface PatchResult {
    applied: boolean;
    filePath: string;
    key: string;
    oldSource?: string;
    newSource?: string;
    reason?: string;
}

/**
 * Rewrites a single locator property's initializer in a Page Object source file,
 * using the healed descriptor. Only the matched property is touched — everything
 * else in the file (formatting, comments, other locators) is left untouched.
 */
export function patch(request: PatchRequest): PatchResult {
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(request.filePath);

    const property = findLocatorProperty(sourceFile, request.key);
    if (!property) {
        return {
            applied: false,
            filePath: request.filePath,
            key: request.key,
            reason: `No locator property named "${request.key}" found in a *Locators object literal.`,
        };
    }

    const initializer = property.getInitializerOrThrow();
    const oldSource = initializer.getText();
    const newSource = renderLocatorSource(request.descriptor);

    if (request.dryRun) {
        return { applied: false, filePath: request.filePath, key: request.key, oldSource, newSource };
    }

    initializer.replaceWithText(newSource);
    const truncatedOld = oldSource.length > 80 ? `${oldSource.slice(0, 80)}...` : oldSource;
    property.replaceWithText(`${property.getText()} // healed on ${new Date().toISOString().slice(0, 10)} — was: ${truncatedOld}`);

    project.saveSync();
    return { applied: true, filePath: request.filePath, key: request.key, oldSource, newSource };
}

function findLocatorProperty(sourceFile: ReturnType<Project['addSourceFileAtPath']>, key: string): PropertyAssignment | undefined {
    for (const classDecl of sourceFile.getClasses()) {
        for (const prop of classDecl.getProperties()) {
            if (!/Locators$/.test(prop.getName())) continue;
            const initializer = prop.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
            if (!initializer) continue;
            const match = initializer
                .getProperties()
                .find((p) => p.asKind(SyntaxKind.PropertyAssignment)?.getName() === key);
            if (match) return match.asKindOrThrow(SyntaxKind.PropertyAssignment);
        }
    }
    return undefined;
}
