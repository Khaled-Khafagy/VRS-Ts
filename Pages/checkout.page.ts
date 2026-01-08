import {expect, Page,test} from '@playwright/test';
import { BasePage } from './base.page';


 export interface GuestInfo {
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    state?: string;
    }
export interface billingAdressInfo {
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
        otpPop_upForNonExistingUser: this.page.getByRole('heading', { name: 'Email Verification' }),
        otpPop_upForExistingUser: this.page.getByRole('heading', { name: 'Welcome back, you already have an account.' }),
        loginButtonOnExistingUserOTPpopup: this.page.getByRole('button', { name: 'Login' }),
    
    };

    constructor(page: Page) {
        super(page);
    }
    
    
    async fillPersonalDetailsForNonExistingUser(userdata : any) {
        await test.step('Fill Personal Details for Non existing user', async () => {
    await this.checkoutPageLocators.firstNameInput.fill(userdata.firstName);
    await this.checkoutPageLocators.lastNameInput.fill(userdata.lastName);
    await this.checkoutPageLocators.emailinput.fill(userdata.email);
console.log('guest data used :', {  firstName: userdata.firstName}, {lastName: userdata.lastName},{email: userdata.email});
    return { firstName: userdata.firstName, lastName: userdata.lastName, email: userdata.email };
    
});
    }
     async fillPersonalDetailsForExistingUser(info: GuestInfo) {
        await test.step('Fill Personal Details for exisiting user', async () => {
    await this.checkoutPageLocators.firstNameInput.fill(info.firstName);
    await this.checkoutPageLocators.lastNameInput.fill(info.lastName);
    await this.checkoutPageLocators.emailinput.fill(info.email);
    
});}

async fillBillingDetailsForUserAndProceedToPayment(info: billingAdressInfo) {
    await test.step('Fill Billing Details for user', async () => {
await this.checkoutPageLocators.billingCountryDropdown.selectOption({ value:info.country });
    const stateField = this.checkoutPageLocators.billingStateDropdown;
if (await stateField.isVisible()) {
    await stateField.selectOption({ label: info.state });
}
await this.checkoutPageLocators.agreementConsentBox.check();
    await this.proceedToPayment();


});}

async proceedToPayment(){
    await test.step('Proceed to Payment from Checkout Page', async () => {
    await this.assertContinueToPaymentButtonIsEnabled();
    await this.checkoutPageLocators.continueToPaymentButton.click();
    
});}


async assertContinueToPaymentButtonIsEnabled(){
    await this.checkoutPageLocators.continueToPaymentButton.isEnabled();
    
}




async handleOTPVerificationNonExistingUser(){
    await test.step('Handle OTP Verification during Checkout', async () => {
    await expect(this.checkoutPageLocators.otpPop_upForNonExistingUser).toBeVisible({timeout:10000});
    console.log("OTP popup is visible.");
    await this.enterMagicOTP();
    console.log("OTP entered.");
});}



async handleOTPVerificationExistingUser(){
    await test.step('Handle OTP Verification for Existing User during Checkout', async () => {
    await expect(this.checkoutPageLocators.otpPop_upForExistingUser).toBeVisible({timeout:10000});
    console.log("OTP popup for existing user is visible.");
    await this.checkoutPageLocators.loginButtonOnExistingUserOTPpopup.click();
    console.log("Login button clicked on existing user OTP popup.");
});}




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




