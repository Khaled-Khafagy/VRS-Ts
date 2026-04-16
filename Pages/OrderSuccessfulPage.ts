import {test, Page, expect} from "@playwright/test";
import { BasePage } from "./BasePage";

export class OrderSuccessfulPage extends BasePage {
    private readonly orderSuccessfulPageLocators = {
        // Order Successful page locators
        hdgOrderSuccess: this.page.getByRole('heading', { name: /Thank you for your order!/i }),
        hdgOrderSuccessMessage: this.page.getByRole('heading', { name: 'Your eSIM is sent by the following address:', exact: false }),
        orderSuccessMessage: this.page.getByText(/Your eSIM is sent by the following address:/, { exact: false }),
        hdgOrderNumber: this.page.getByRole('heading', { name: 'Need help? Contact support with your order number', exact: false }),
        orderNumberText: this.page.getByText(/Need help\? Contact support with your order number/, { exact: false }),
        btnCreatePasswordGuest: this.page.getByRole('button', { name: 'Create Password' }),
        createPasswordBtnForGuest: this.page.getByRole('button', { name: /Create Password/i }),
    };    
    constructor(page: Page) {
        super(page);
    }

    async verifyOrderSuccessfulPageDisplayedForLoggedinUsers() {
        await test.step('Verify Order Successful Page is Displayed', async () => {
            await expect(this.orderSuccessfulPageLocators.hdgOrderSuccess).toBeVisible();
            await expect(this.orderSuccessfulPageLocators.hdgOrderSuccessMessage).toBeVisible();
            await expect(this.orderSuccessfulPageLocators.hdgOrderNumber).toBeVisible();
        });
    }
    async verifyOrderSuccessfulPageDisplayedForGuestUsers() {
        await test.step('Verify Order Successful Page is Displayed for Guest Users', async () => {
            await expect(this.orderSuccessfulPageLocators.hdgOrderSuccess).toBeVisible();
            await expect(this.orderSuccessfulPageLocators.orderSuccessMessage).toBeVisible();
            await expect(this.orderSuccessfulPageLocators.orderNumberText).toBeVisible();
            await this.verifyCreatePasswordButtonForGuestIsDisplayed();
        });
    }


    private async verifyCreatePasswordButtonForGuestIsDisplayed() {
        await test.step('Verify Create Password Button is Displayed for Guest Users', async () => {
            await expect(this.orderSuccessfulPageLocators.createPasswordBtnForGuest).toBeVisible();
        });
    }
} 
    


