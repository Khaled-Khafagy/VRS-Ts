import { test, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { orderStatusDelay } from '../playwright.config';
export class MyAccountPage extends BasePage {
    protected readonly pageName = 'MyAccountPage';
    protected readonly sourceFilePath = __filename;

    private readonly myAccountPageLocators = {
        btnSignOut: this.page.getByRole('button', { name: 'Sign Out' }),
        lnkEsims:  this.page.locator('#myAccount_eSIMs_icon'),
        lnkOrders: this.page.locator('#myAccount_orders_icon'),
    };

    constructor(page: Page) {
        super(page);
    }

    async signOutFromAccount() {
        await test.step('Sign Out from My Account', async () => {
            await (await this.heal('btnSignOut', this.myAccountPageLocators.btnSignOut)).click();
        });
    }

    async waitForOrderToReflect() {
        await test.step(`Wait ${orderStatusDelay / 1000}s for order to reflect in system`, async () => {
            await this.page.waitForTimeout(orderStatusDelay);
        });
    }

    async clickOrdersTab() {
        await test.step('Navigate to Orders tab', async () => {
            const baseUrl = this.page.url().split('/my-account')[0];
            await this.navigateToUrl(`${baseUrl}/my-account/orders`);
        });
    }

    async clickEsimsTab() {
        await test.step('Navigate to eSIMs tab', async () => {
            await (await this.heal('lnkEsims', this.myAccountPageLocators.lnkEsims)).click();
        });
    }
}
