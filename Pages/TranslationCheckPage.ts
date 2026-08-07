import { expect, Page, test } from '@playwright/test';
import { BasePage } from './BasePage';
import { RouteConfig, ALLOWLIST, CJK_RATIO_THRESHOLD, LocaleConfig, MIN_LINE_LENGTH } from '../tests/i18n/i18n.config';
import { findSuspiciousLines } from '../utils/translationCompare';
import { LoginPage } from './LoginPage';
import { HomePage } from './HomePage';
import { MyAccountPage } from './MyAccountPage';
import { AppUrls, ValidLoginDetails } from '../data/credentials';

export class TranslationCheckPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    /** Logs in via Vodafone ID on the given page — shared by both the throwaway English source page and the locale-scoped target page for routes whose `access` requires it. */
    private async login(page: Page) {
        await test.step('Log in for translation check', async () => {
            await new LoginPage(page).navigateAndLogin(AppUrls.login, ValidLoginDetails);
        });
    }

    /**
     * Signs out of the given page's Vodafone ID session as soon as it's done being used. Vodafone ID
     * blocks the account for ~1 hour if it sees two sessions open in parallel, and each authenticated
     * route in this suite logs in twice (once for the English baseline, once for the target locale) —
     * so the first session must be fully closed server-side (not just have its browser context torn
     * down) before the second one logs in.
     */
    private async logout(page: Page) {
        await test.step('Log out to close the Vodafone ID session before the next login', async () => {
            const signOutButton = page.getByRole('button', { name: 'Sign Out' });
            if (!(await signOutButton.isVisible().catch(() => false))) {
                await new HomePage(page).navigateToMyAccountTab();
            }
            await new MyAccountPage(page).signOutFromAccount();
        });
    }

    /**
     * Navigates the given page to a route, honouring both how the page is reached (`path` under a
     * locale prefix, and/or a `navigate` click sequence) and whether it needs a login first.
     */
    private async goto(page: Page, route: RouteConfig, baseUrl: string, localeUrlPrefix: string, authenticated: boolean) {
        if (authenticated) await this.login(page);
        if (route.path !== undefined) {
            await test.step(`Navigate to ${localeUrlPrefix || '(source)'}${route.path || '/'}`, async () => {
                await page.goto(`${baseUrl}${localeUrlPrefix}${route.path}`, { waitUntil: 'networkidle' });
                // addLocatorHandler only fires as a side-effect of a Playwright *action* (click, fill, ...);
                // a plain goto never performs one, so the banner must be dismissed explicitly here.
                await this.acceptCookies(page.locator('#onetrust-accept-btn-handler'));
            });
        }
        if (route.navigate) await route.navigate(page, authenticated);
    }

    /** Navigates the current (locale-scoped) page to a route, logging in first if `authenticated`. */
    async gotoRoute(route: RouteConfig, baseUrl: string, localeUrlPrefix: string, authenticated: boolean) {
        await this.goto(this.page, route, baseUrl, localeUrlPrefix, authenticated);
    }

    /**
     * Reads the English baseline version of a route in a throwaway browser context, so the locale-scoped
     * `page` fixture used for the rest of the test is never touched by it. Logs in fresh (same as
     * `gotoRoute` does for the target locale) when `authenticated` is set.
     */
    async fetchSourceLines(route: RouteConfig, baseUrl: string, authenticated: boolean): Promise<string[]> {
        return test.step(`Fetch English baseline text for ${route.label}`, async () => {
            const browser = this.page.context().browser();
            // Explicit locale: without it, Playwright Test defaults this manually-created context to the
            // enclosing test's `test.use({ locale })`, so the "English baseline" silently becomes the
            // target locale too and every line falsely matches as "untranslated".
            // storageState carried over from the current (fixture-provided) context: on environments
            // gated behind Cloudflare Access (e.g. the Test env), that context holds the SSO session set
            // up by auth.setup.ts. A brand-new context without it hits the Cloudflare/Azure login page
            // instead of the real site, so every route/locale would fail here, not just authenticated ones.
            const sourceContext = await browser!.newContext({ locale: 'en-US', storageState: await this.page.context().storageState() });
            const sourcePage = await sourceContext.newPage();
            try {
                await this.goto(sourcePage, route, baseUrl, '', authenticated);
                return await this.extractStableLines(sourcePage);
            } finally {
                // Best-effort: sign out before the context is torn down so Vodafone ID closes this
                // session server-side before the target-locale login below opens a second one.
                if (authenticated) await this.logout(sourcePage).catch(() => {});
                await sourceContext.close();
            }
        });
    }

    /** Confirms the site actually redirected into the locale's URL prefix instead of falling back to English. */
    async verifyLocaleUrlApplied(localeUrlPrefix: string) {
        await test.step(`Verify URL fell into the ${localeUrlPrefix} locale prefix`, async () => {
            expect(this.page.url(), 'Page did not redirect into the expected locale prefix — likely fell back to English').toContain(localeUrlPrefix);
        });
    }

    /** Compares the current page's visible text against the English baseline and fails on untranslated-looking lines. */
    async verifyNoUntranslatedContent(sourceLines: string[], locale: LocaleConfig, authenticated: boolean) {
        try {
            await test.step(`Verify no untranslated content for ${locale.label}`, async () => {
                const targetLines = await this.extractStableLines(this.page);
                const suspicious = findSuspiciousLines(sourceLines, targetLines, locale, ALLOWLIST, CJK_RATIO_THRESHOLD);
                expect(suspicious, `Untranslated-looking line(s) found:\n${suspicious.join('\n')}`).toEqual([]);
            });
        } finally {
            // Best-effort, and run whether the assertion passed or failed, so this session is always
            // closed server-side — otherwise a failed assertion here would leave it open indefinitely.
            if (authenticated) await this.logout(this.page).catch(() => {});
        }
    }

    /**
     * Discovers every country slug listed under the Countries tab of /our-destinations (in a throwaway
     * English context), so the per-country translation check doesn't need a hardcoded ~200-item list.
     */
    private async discoverCountrySlugs(baseUrl: string): Promise<string[]> {
        return test.step('Discover country slugs from the Countries tab', async () => {
            const browser = this.page.context().browser();
            // storageState carried over — see the same fix/reasoning in fetchSourceLines() above.
            const context = await browser!.newContext({ locale: 'en-US', storageState: await this.page.context().storageState() });
            const page = await context.newPage();
            try {
                await page.goto(`${baseUrl}/our-destinations`, { waitUntil: 'networkidle' });
                await this.acceptCookies(page.locator('#onetrust-accept-btn-handler'));
                await page.getByRole('tab', { name: 'Countries' }).click();
                await page.waitForTimeout(1000);
                const hrefs = await page
                    .getByRole('tabpanel')
                    .locator('a[href^="/our-destinations/"]')
                    .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
                return [...new Set(hrefs.filter((href): href is string => !!href).map((href) => href.replace('/our-destinations/', '')))];
            } finally {
                await context.close();
            }
        });
    }

    /**
     * Crawls every country page under /our-destinations for a single locale and asserts once at the
     * end, so ~200 countries don't explode into ~200 separate test cases in the report. Reuses one
     * source (English) page and the fixture's locale-scoped page across all countries instead of
     * spinning up a context per country, since that's the dominant cost at this page count.
     */
    async verifyNoUntranslatedContentAcrossCountries(baseUrl: string, localeUrlPrefix: string, locale: LocaleConfig) {
        await test.step(`Verify no untranslated content across all country pages for ${locale.label}`, async () => {
            const slugs = await this.discoverCountrySlugs(baseUrl);
            const browser = this.page.context().browser();
            // storageState carried over — see the same fix/reasoning in fetchSourceLines() above.
            const sourceContext = await browser!.newContext({ locale: 'en-US', storageState: await this.page.context().storageState() });
            const sourcePage = await sourceContext.newPage();
            const failures: string[] = [];
            try {
                for (const slug of slugs) {
                    await test.step(`Country: ${slug}`, async () => {
                        const route = `/our-destinations/${slug}`;

                        await sourcePage.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
                        await this.acceptCookies(sourcePage.locator('#onetrust-accept-btn-handler'));
                        const sourceLines = await this.extractStableLines(sourcePage);

                        await this.page.goto(`${baseUrl}${localeUrlPrefix}${route}`, { waitUntil: 'networkidle' });
                        await this.acceptCookies();
                        if (!this.page.url().includes(localeUrlPrefix)) {
                            failures.push(`${slug}: page did not redirect into the ${localeUrlPrefix} locale prefix`);
                            return;
                        }

                        const targetLines = await this.extractStableLines(this.page);
                        const suspicious = findSuspiciousLines(sourceLines, targetLines, locale, ALLOWLIST, CJK_RATIO_THRESHOLD);
                        if (suspicious.length > 0) {
                            failures.push(`${slug}:\n  ${suspicious.join('\n  ')}`);
                        }
                    });
                }
            } finally {
                await sourceContext.close();
            }
            expect(failures, `Untranslated-looking content found on ${failures.length} country page(s):\n\n${failures.join('\n\n')}`).toEqual([]);
        });
    }

    /** Deduped, trimmed visible text lines from the page. */
    private async extractVisibleLines(page: Page): Promise<string[]> {
        const rawText = await page.evaluate(() => document.body.innerText);
        const lines = rawText
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.length >= MIN_LINE_LENGTH);
        return [...new Set(lines)];
    }

    /**
     * Some plan/price cards render via a fetch that resolves after `networkidle` fires, so a single
     * fixed-delay read can catch a page mid-render. Polls until two consecutive reads agree.
     */
    private async extractStableLines(page: Page, maxAttempts = 4, pollDelayMs = 1000): Promise<string[]> {
        let previous = await this.extractVisibleLines(page);
        for (let attempt = 1; attempt < maxAttempts; attempt++) {
            await page.waitForTimeout(pollDelayMs);
            const current = await this.extractVisibleLines(page);
            if (current.length === previous.length && current.every((line, i) => line === previous[i])) {
                return current;
            }
            previous = current;
        }
        return previous;
    }
}
