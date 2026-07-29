import { Page, Locator, test } from "@playwright/test";
import { actionTimeout } from '../playwright.config';
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
    this.btnAcceptCookies = this.page.getByRole('button', { name: 'Accept All Cookies' });
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
    await this.page.addLocatorHandler(
      this.btnAcceptCookies,
      async () => { await this.btnAcceptCookies.click(); }
    );
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async acceptCookies(customLocator?: Locator) {
    await test.step('Accept cookies', async () => {
      const button = customLocator || this.btnAcceptCookies;
      try {
        await button.waitFor({ state: 'visible', timeout: actionTimeout });
        await button.click();
      } catch {
        // Banner not present or already dismissed
      }
    });
  }
}      