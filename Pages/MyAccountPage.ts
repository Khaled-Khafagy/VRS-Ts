import { test, Page } from '@playwright/test';
import { BasePage } from './BasePage';
export class MyAccountPage extends BasePage {
    private readonly myAccountPageLocators = {
        btnSignOut: this.page.getByRole('button', { name: 'Sign Out' }),
        lnkEsims:  this.page.locator('#myAccount_eSIMs_icon'),
    };

    constructor(page: Page) {
        super(page);
    }

    async signOutFromAccount() {
        await test.step('Sign Out from My Account', async () => {
            await this.myAccountPageLocators.btnSignOut.click();
        });
    }

    async clickEsimsTab() {
        await test.step('Navigate to eSIMs tab', async () => {
            await this.myAccountPageLocators.lnkEsims.click();
        });
    }
}