import { LocaleConfig } from '../tests/i18n/i18n.config';

const CJK_RANGE = /[㐀-鿿豈-﫿぀-ヿ가-힯]/;
const HAS_LETTERS = /[A-Za-zÀ-ɏ]/;

function cjkRatio(line: string): number {
    const chars = [...line].filter((c) => /\S/.test(c));
    if (chars.length === 0) return 1;
    const cjkChars = chars.filter((c) => CJK_RANGE.test(c));
    return cjkChars.length / chars.length;
}

function escapeRegExp(term: string): string {
    return term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Removes allowlisted words/phrases (whole-word, case-sensitive) and any digits from a line, so that
 * e.g. "Champions 5GB" or "5 Days" reduce to nothing once "Champions"/"Days" are allowlisted terms and
 * the numbers are stripped. What's left over is the part of the line that still needs to be judged
 * against the source page. Longer allowlist entries are removed first so a multi-word phrase isn't
 * partially eaten by one of its own words.
 */
function stripAllowlistedAndNumeric(line: string, allowlist: string[]): string {
    let residual = line;
    const byLengthDesc = [...allowlist].sort((a, b) => b.length - a.length);
    for (const term of byLengthDesc) {
        // Boundary is "not adjacent to a letter" rather than \b, since \b treats digits as word
        // characters and would otherwise miss e.g. 'GB' glued to a number in "5GB"/"50GB".
        residual = residual.replace(new RegExp(`(?<![\\p{L}])${escapeRegExp(term)}(?![\\p{L}])`, 'gu'), ' ');
    }
    residual = residual.replace(/[0-9]+/g, ' ');
    return residual.replace(/[^\p{L}]+/gu, ' ').trim();
}

/**
 * Flags target-locale lines that look untranslated:
 * - present verbatim on the English page, not fully explained by allowlisted words/numbers, OR
 * - (for 'cjk' locales) mostly Latin script when it should be mostly CJK.
 *
 * Allowlist entries match as whole words/phrases anywhere in a line (not just whole-line), so a single
 * entry like "Days" also covers "5 Days", "50 Days", etc. — no need to enumerate every numeric variant.
 * This also covers cognates: country/brand names that are spelled identically in the target language
 * (e.g. "Europe", "Portugal") are allowlisted the same way as brand terms.
 */
export function findSuspiciousLines(
    sourceLines: string[],
    targetLines: string[],
    locale: LocaleConfig,
    allowlist: string[],
    cjkRatioThreshold: number,
): string[] {
    const sourceSet = new Set(sourceLines);
    const suspicious = new Set<string>();

    for (const line of targetLines) {
        if (sourceSet.has(line)) {
            const residual = stripAllowlistedAndNumeric(line, allowlist);
            if (residual.length === 0) continue;
            suspicious.add(line);
            continue;
        }

        if (locale.checkMode === 'cjk' && HAS_LETTERS.test(line) && cjkRatio(line) < cjkRatioThreshold) {
            suspicious.add(line);
        }
    }

    return [...suspicious];
}
