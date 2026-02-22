import {test, Page, expect} from "@playwright/test";
import { BasePage } from "./base.page";

export class OrderSuccessfulPage extends BasePage {
    private readonly orderSuccessfulPageLocators = {
        // Order Successful page locators
        orderSuccessHeading: this.page.getByRole('heading', { name: 'Thank you for your order!' }),
        orderSuccessMessage: this.page.getByRole('heading', { name: 'Your eSIM is sent by the following address:', exact: false }),
        orderNumberText: this.page.getByRole('heading', { name: 'Need help? Contact support with your order number', exact: false }),
        createPasswordBtnForGuest: this.page.getByRole('button', { name: 'Create Password' }),




    };    
    constructor(page: Page) {
        super(page);
    }

    async verifyOrderSuccessfulPageDisplayedForLoggedinUsers(){
        await test.step('Verify Order Successful Page is Displayed', async () => {
        await expect(this.orderSuccessfulPageLocators.orderSuccessHeading).toBeVisible();
        await expect(this.orderSuccessfulPageLocators.orderSuccessMessage).toBeVisible();
        await expect(this.orderSuccessfulPageLocators.orderNumberText).toBeVisible();
        console.log("Order Successful page is displayed with all relevant information.");
    })

}
async verifyOrderSuccessfulPageDisplayedForGuestUsers(){
    await test.step('Verify Order Successful Page is Displayed for Guest Users', async () => {
        await expect(this.orderSuccessfulPageLocators.orderSuccessHeading).toBeVisible();
        await expect(this.orderSuccessfulPageLocators.orderSuccessMessage).toBeVisible();
        await expect(this.orderSuccessfulPageLocators.orderNumberText).toBeVisible();
        await this.verifyCreatePasswordButtonForGuestIsDisplayed();
        console.log("Order Successful page is displayed with all relevant information for guest users.");
    })  
}


private async verifyCreatePasswordButtonForGuestIsDisplayed(){
    await test.step('Verify Create Password Button is Displayed for Guest Users', async () => {
        await expect(this.orderSuccessfulPageLocators.createPasswordBtnForGuest).toBeVisible();
        console.log("Create Password button is visible for guest users on order successful page.");
    })  
}  
} 
    


