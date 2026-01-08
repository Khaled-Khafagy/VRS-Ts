import { expect,Page,test } from "@playwright/test";
import { BasePage } from "./base.page"; 

export class RegionPlansPage extends BasePage {
    private readonly regionPlansPageLocators = {
        // Europe region plans page locators
        EuropeHeading: this.page.locator('h1:has-text("Europe")'),
        firstEuropePlanCard: this.page.locator('button').filter({ hasText: 'Add to cart' }).first(),
        goToCheckoutButton: this.page.getByRole('button', { name: 'Go to checkout' }),



    };

    constructor(page: Page) {
        super(page);
    }

async selectplanInEuropeRegion(){
    await test.step('Select a plan in Europe Region and Go to Checkout', async () => {  
    await expect (this.regionPlansPageLocators.EuropeHeading).toBeVisible();
    await this.regionPlansPageLocators.firstEuropePlanCard.click();
    await this.regionPlansPageLocators.goToCheckoutButton.click();
  
});}








};
