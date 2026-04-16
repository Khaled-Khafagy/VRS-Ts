import { Page, Locator,test } from "@playwright/test";   
export abstract class BasePage {
  protected page: Page;
  protected readonly btnAcceptCookies: Locator;

  constructor(page: Page) {
    this.page = page;
    this.btnAcceptCookies = this.page.getByRole('button', { name: 'Accept All Cookies' });
    
  }

  async navigateToUrl(url: string){
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });

  }
  
async acceptCookies(customLocator?: Locator) {
  await test.step('Navigate to URL and Accept cookies', async () => {
        const button = customLocator || this.btnAcceptCookies;
        try {
            await button.waitFor({ state: 'visible', timeout: 4000 });
            await button.click();
            console.log("Cookies accepted.");
        } catch (e) {
            console.log("Cookie banner not found or already dismissed.");
        }
})}      
};      