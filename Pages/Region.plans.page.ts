import { expect,Page } from "@playwright/test";
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
    await expect (this.regionPlansPageLocators.EuropeHeading).toBeVisible();
    console.log("Europe region plans page is visible.");
    await this.regionPlansPageLocators.firstEuropePlanCard.click();
    console.log("First plan in Europe region added to cart.");
    await this.regionPlansPageLocators.goToCheckoutButton.click();
    console.log("Proceeded to checkout from Europe region plans page.");
}








};
