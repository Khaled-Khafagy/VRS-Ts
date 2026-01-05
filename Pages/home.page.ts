import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class HomePage extends BasePage {

private readonly herBannerHeading : Locator = this.page.getByRole('heading', { name: 'Save 20% on travel internet' });


constructor(page: Page) {
    super(page);
  }
  async goto() {
    await this.navigateTo('https://r10-test.digitalretail.vodafone.com/vrs-portal/');
    await this.acceptCookies();

  }


};


