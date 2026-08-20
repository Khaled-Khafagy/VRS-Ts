import {expect, Page,test} from '@playwright/test';
import { BasePage } from './BasePage';
import { waitForEmail } from '../utils/gmailHelper';
import { emailTestTimeout } from '../playwright.config';
export class EmailVerificationPage extends BasePage { 

    private readonly emailVerificationPageLocators = {
        hdgOtpNonExisting:                          this.page.getByRole('heading', { name: 'Email Verification' }),
        hdgOtpExisting:                             this.page.getByRole('heading', { name: /Welcome back, you already have an account\./i }),
        btnLoginExistingAccountInEmailVerification: this.page.getByRole('button', { name: 'Login' }).last(),
        // OTP input fields — id-based as no accessible-name alternative exists on this form
        otpInput0:                                  this.page.locator('#otp-code-input-0'),
        otpInput1:                                  this.page.locator('#otp-code-input-1'),
        otpInput2:                                  this.page.locator('#otp-code-input-2'),
        otpInput3:                                  this.page.locator('#otp-code-input-3'),
        otpInput4:                                  this.page.locator('#otp-code-input-4'),
        otpInput5:                                  this.page.locator('#otp-code-input-5'),
        btnVerify:                                  this.page.getByRole('button', { name: 'Verify' }),
    };


    constructor(page: Page) {
        super(page);
    }


async handleOTPVerificationNonExistingUser(email: string, sentAt: number){
    await test.step('Handle OTP Verification during Checkout', async () => {
    // otpInput0 instead of the 'Email Verification' heading text — the heading gets translated on
    // non-English locales, but the OTP fields are id-based and stay the same everywhere.
    await expect(this.emailVerificationPageLocators.otpInput0).toBeVisible();
    const otp = await this.getOTPFromEmail(email, sentAt);
    await this.enterOTP(otp);
    await this.continueToPayment();
});}



async handleOTPVerificationExistingUser(){
    await test.step('Handle OTP Verification for Existing User during Checkout', async () => {
    await expect(this.emailVerificationPageLocators.hdgOtpExisting).toBeVisible();
    await this.emailVerificationPageLocators.btnLoginExistingAccountInEmailVerification.click();

});}

private async enterOTP(otp: string) {
    const inputs = [
        this.emailVerificationPageLocators.otpInput0,
        this.emailVerificationPageLocators.otpInput1,
        this.emailVerificationPageLocators.otpInput2,
        this.emailVerificationPageLocators.otpInput3,
        this.emailVerificationPageLocators.otpInput4,
        this.emailVerificationPageLocators.otpInput5,
    ];
    const digits = otp.split('');
    for (let i = 0; i < inputs.length; i++) {
        await inputs[i].waitFor({ state: 'visible' });
        await inputs[i].fill(digits[i]);
    }
}

private async getOTPFromEmail(email: string, sentAt: number): Promise<string> {
    const received = await waitForEmail({
        to: email,
        subject: /Vodafone Travel One-Time PIN/i,
        timeout: emailTestTimeout,
        afterTimestamp: sentAt,
    });

    const otpMatch = received.body.match(/Your One-Time PIN is\s*:?\s*(\d{6})/i);
    if (!otpMatch) {
        throw new Error(`Could not extract OTP from email body: ${received.body}`);
    }
    return otpMatch[1];
}


async verifyOTPEmailReceived(email: string, sentAt: number) {
    await test.step('Verify OTP email is received', async () => {
        const received = await waitForEmail({
            to: email,
            subject: /Vodafone Travel One-Time PIN/i,
            timeout: emailTestTimeout,
            afterTimestamp: sentAt,
        });
        expect(received.subject).toContain('Vodafone Travel One-Time PIN');
        expect(received.body).toContain('Your One-Time PIN is');
    });
}

private async continueToPayment() {
    await this.emailVerificationPageLocators.btnVerify.click();
}








}