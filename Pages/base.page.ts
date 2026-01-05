import { Page, Locator, expect } from "@playwright/test";   
import { beforeEach } from "node:test";
export abstract class BasePage {
  protected page: Page;
  protected readonly commonCookieButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.commonCookieButton = this.page.getByRole('button', { name: 'Accept All Cookies' });
  }

  async navigateTo(url: string){
    await this.page.goto(url);
  }
  
async acceptCookies(customLocator?: Locator) {
        const button = customLocator || this.commonCookieButton;
        try {
            await button.waitFor({ state: 'visible', timeout: 10000 });
            await button.click({ force: true });
            console.log("Cookies accepted.");
        } catch (e) {
            console.log("Cookie banner not found or already dismissed.");
        }
    }
};