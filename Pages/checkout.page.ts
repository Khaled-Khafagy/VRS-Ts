import {expect, Page} from '@playwright/test';
import { BasePage } from './base.page';
import { info, time } from 'node:console';

 export interface GuestInfo {
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    state?: string;
    }

export class CheckoutPage extends BasePage {
    
    private readonly checkoutPageLocators = {
        
        // Define locators for checkout page here
        firstNameInput: this.page.getByLabel('First name'),
        lastNameInput: this.page.getByLabel('Last name'),
        emailinput: this.page.getByRole('textbox', { name: 'Email' }),
        billingCountryDropdown: this.page.getByLabel('Country'),
        billingStateDropdown: this.page.getByLabel('State'),
        agreementConsentBox: this.page.getByText('I have read, understood and accepted the Agreement and the Privacy Policy & Cookie Policy', { exact: true }),
        personalizedOffersConsentBox: this.page.getByLabel('I would like to receive emails with offers, updates and personalised recommendations.'),
        continueToPaymentButton: this.page.getByLabel('Continue to payment'),
        otpPop_up: this.page.getByRole('heading', { name: 'Email Verification' })
    };
     
    constructor(page: Page) {
        super(page);
    }
    
    
    async fillBillingDetails(info: GuestInfo) {

    await this.checkoutPageLocators.firstNameInput.fill(info.firstName);
    await this.checkoutPageLocators.lastNameInput.fill(info.lastName);
    await this.checkoutPageLocators.emailinput.fill(info.email);
    await this.checkoutPageLocators.billingCountryDropdown.selectOption({ value:info.country });
    const stateField = this.checkoutPageLocators.billingStateDropdown;
if (await stateField.isVisible()) {
    await stateField.selectOption({ label: info.state });
}
    await this.checkoutPageLocators.agreementConsentBox.check();
    console.log("Billing details filled for guest checkout.");
};

async proceedToPayment(){
    await this.assertContinueToPaymentButtonIsEnabled();
    await this.checkoutPageLocators.continueToPaymentButton.click();
    console.log("Proceeded to payment from checkout page.");
}


async assertContinueToPaymentButtonIsEnabled(){
    await this.checkoutPageLocators.continueToPaymentButton.isEnabled();
    console.log("Continue to payment button is enabled in checkout page.");
}






async handleOTPVerification(){
    await expect(this.checkoutPageLocators.otpPop_up).toBeVisible({timeout:10000});
    console.log("OTP popup is visible.");
    await this.enterMagicOTP();
    console.log("OTP entered.");
}








async enterMagicOTP() {
    const magicPin = "000000";
    const digits = magicPin.split(''); // Creates ['0', '0', '0', '0', '0', '0']

    for (let i = 0; i < digits.length; i++) {
        // Use the ID discovered in your SelectorsHub screenshot
        const box = this.page.locator(`#number-example-${i}`);
        
        // Ensure the box is ready before filling
        await box.fill(digits[i]); 
    }
}
}




