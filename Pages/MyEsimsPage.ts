import { test, expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyEsimsPage extends BasePage {
    private readonly myEsimsPageLocators = {
        hdgMyEsims:this.page.getByRole('heading', { name: /eSIM/i }),
        badgeNotInstalled:this.page.locator('[data-test-id="pill"]').first(),
        btnViewDetails:this.page.getByRole('button', { name: 'View Details' }).first(),
    };

    constructor(page: Page) {
        super(page);
    }

    async verifyMyEsimsPageLoaded() {
        await test.step('Verify My eSIMs page is loaded', async () => {
            await expect(this.myEsimsPageLocators.hdgMyEsims).toBeVisible({ timeout: 30000 });
        });
    }

    async verifyNotInstalledEsimPresent() {
        await test.step('Verify at least one Not Installed eSIM is present', async () => {
            await expect(this.myEsimsPageLocators.badgeNotInstalled).toBeVisible({ timeout: 15000 });
        });
    }

    async clickViewDetailsOnFirstNotInstalledEsim() {
        await test.step('Click View Details on first Not Installed eSIM', async () => {
            await this.myEsimsPageLocators.btnViewDetails.click();
        });
    }
}
