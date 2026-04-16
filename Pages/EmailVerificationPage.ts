import {expect, Page,test} from '@playwright/test';
import { BasePage } from './BasePage';
import { GuestInfo, BillingAddressInfo, NonExistingUser } from './index';   
export class EmailVerificationPage extends BasePage { 

    private readonly emailVerificationPageLocators = {
        hdgOtpNonExisting: this.page.getByRole('heading', { name: 'Email Verification' }),
        hdgOtpExisting: this.page.getByRole('heading', { name: /Welcome back, you already have an account\./i }),
        btnLoginExistingAccountInEmailVerification: this.page.locator('button.sc-eveRyO.kQGlvY.sc-bAnUEN.gckoeR'),
        verifyButton : this. page.locator('#checkout_email_continue_btn')
    };


    constructor(page: Page) {
        super(page);
    }


async handleOTPVerificationNonExistingUser(){
    await test.step('Handle OTP Verification during Checkout', async () => {
    await expect(this.emailVerificationPageLocators.hdgOtpNonExisting).toBeVisible({timeout:10000});
    await this.enterMagicOTP();
    await this.continueToPayment();
});}



async handleOTPVerificationExistingUser(){
    await test.step('Handle OTP Verification for Existing User during Checkout', async () => {
    await expect(this.emailVerificationPageLocators.hdgOtpExisting).toBeVisible({timeout:10000});
    await this.emailVerificationPageLocators.btnLoginExistingAccountInEmailVerification.click();

});}

private async enterMagicOTP() {
    const magicPin = "000000";
    const digits = magicPin.split(''); // Creates ['0', '0', '0', '0', '0', '0']

    // Get all OTP input fields - using getByRole for better reliability
    const otpInputs = this.page.locator('input[type="text"][inputmode="numeric"]');
    
    for (let i = 0; i < digits.length; i++) {
        const box = otpInputs.nth(i);
        
        // Wait for visibility
        await box.waitFor({ state: 'visible', timeout: 5000 });
        
        // Clear and fill with the digit
        await box.fill(digits[i]); 
        
        // Press Tab to move to next field (triggers field validation)
        await box.press('Tab');
        
        // Allow field processing
        await this.page.waitForTimeout(200);
    }
    
    // Press Enter on the last field to submit OTP
    const lastBox = otpInputs.nth(5);
    await lastBox.press('Enter');
    
    // Wait for OTP processing and navigation
    await this.page.waitForTimeout(2000);
}


private async continueToPayment() {
    // Assuming there's a "Verify" button after OTP verification    
    await this.emailVerificationPageLocators.verifyButton.click();  

}








}