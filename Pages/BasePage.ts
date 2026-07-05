import { Page, Locator, test } from "@playwright/test";
import { actionTimeout } from '../playwright.config';

export abstract class BasePage {
  protected page: Page;
  protected readonly btnAcceptCookies: Locator;

  constructor(page: Page) {
    this.page = page;
    this.btnAcceptCookies = this.page.getByRole('button', { name: 'Accept All Cookies' });
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