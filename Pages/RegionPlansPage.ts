import { expect, Page, test } from "@playwright/test";
import { BasePage } from "./BasePage"; 

export class RegionPlansPage extends BasePage {
    private readonly regionPlansPageLocators = {
        // Generic locators for any region
        regionHeading: (regionName: string) => this.page.locator(`h1:has-text("${regionName}")`),
        allPlansAddToCartButtons: this.page.locator('button').filter({ hasText: 'Add to cart' }),
        planCards: this.page.locator('[data-testid="plan-card"], article, div[class*="plan"]'),
        btnGoToCheckout: this.page.getByRole('button', { name: 'Go to checkout' }),
        planPrice: (planIndex: number) => this.page.locator('button').filter({ hasText: 'Add to cart' }).nth(planIndex).locator('..').getByText(/\$[\d.]+/),
        planName: (planIndex: number) => this.page.locator('button').filter({ hasText: 'Add to cart' }).nth(planIndex).locator('..').getByRole('heading'),
        
        // Specific locators (backward compatibility)
        hdgEurope: this.page.locator('h1:has-text("Europe")'),
        btnFirstEuropePlan: this.page.locator('button').filter({ hasText: 'Add to cart' }).first(),
    };

    /**
     * Proceed to checkout (existing functionality maintained)
     */
    async proceedToCheckout(): Promise<void> {
        await test.step('Proceed to checkout', async () => {
            await this.regionPlansPageLocators.btnGoToCheckout.waitFor({ state: 'visible' });
            await this.regionPlansPageLocators.btnGoToCheckout.click();
        });
    }

    /**
     * Select a plan in Europe region and go to checkout (backward compatibility)
     */
    async selectPlanInEuropeRegion(): Promise<void> {
        await test.step('Select a plan in Europe Region and Go to Checkout', async () => {
            await expect(this.regionPlansPageLocators.hdgEurope).toBeVisible();
            await this.regionPlansPageLocators.btnFirstEuropePlan.waitFor({ state: 'visible' });
            await this.regionPlansPageLocators.btnFirstEuropePlan.click();
            await this.proceedToCheckout();
        });
    }

}
