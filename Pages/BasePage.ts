import { Page, Locator, test } from "@playwright/test";
import { healLocator } from '../utils/selfHealing';

export abstract class BasePage {
  protected page: Page;
  protected readonly btnAcceptCookies: Locator;

  /** Override in migrated subclasses, e.g. `protected readonly pageName = 'OrderSuccessfulPage';` — used to namespace healing snapshots. */
  protected readonly pageName: string = this.constructor.name;
  /** Override in migrated subclasses, e.g. `protected readonly sourceFilePath = __filename;` — the file the auto-heal codemod may patch. */
  protected readonly sourceFilePath: string = '';

  constructor(page: Page) {
    this.page = page;
    // OneTrust CMP button id — stable across locales, unlike its accessible name ("Accept All Cookies" in English only).
    this.btnAcceptCookies = this.page.locator('#onetrust-accept-btn-handler');
    // Registered here (not in navigateToUrl) so it also covers direct page.goto() calls, e.g. from TranslationCheckPage.
    void this.page.addLocatorHandler(
      this.btnAcceptCookies,
      async () => { await this.btnAcceptCookies.click(); }
    );
  }

  /**
   * Self-healing locator access: if `locator` no longer resolves, tries a stored
   * last-known-good descriptor, then looser alternates, then (if AI_HEAL is on)
   * an AI-assisted match — returning the first working Locator, or the original
   * locator unchanged if nothing heals (so the normal Playwright error surfaces).
   */
  protected async heal(key: string, locator: Locator): Promise<Locator> {
    return healLocator(this.page, {
      key,
      primary: locator,
      pageName: this.pageName,
      sourceFilePath: this.sourceFilePath,
      testTitle: test.info()?.title,
    });
  }

  async navigateToUrl(url: string) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async acceptCookies(customLocator?: Locator) {
    await test.step('Accept cookies', async () => {
      const button = customLocator || this.btnAcceptCookies;
      try {
        // Short timeout: this is a best-effort dismiss, not a required action — the banner only
        // shows once per session, so most calls correctly find nothing and should fail fast rather
        // than block for the full actionTimeout (60s) on every subsequent navigation.
        await button.waitFor({ state: 'visible', timeout: 5000 });
        await button.click();
      } catch {
        // Banner not present or already dismissed
      }
    });
  }
}      