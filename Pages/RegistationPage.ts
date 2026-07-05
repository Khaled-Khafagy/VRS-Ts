import { test, expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { RegistrationInfo } from './index';
import { RegistrationTestData } from '../data/credentials';
import { generateAliasEmail } from '../utils/testDataGenerator';
import { actionTimeout, emailTestTimeout, shortDelay, animationDelay } from '../playwright.config';
import { waitForEmail } from '../utils/gmailHelper';

export class RegistationPage extends BasePage {

    private readonly locators = {
        // Form fields
        txtFirstName:        this.page.getByTestId('field-firstName'),
        txtLastName:         this.page.getByTestId('field-lastName'),
        txtEmail:            this.page.getByTestId('field-identifier'),
        txtPassword:         this.page.getByTestId('field-password'),
        txtConfirmPassword:  this.page.getByTestId('field-confirmPassword'),

        // Dropdowns
        ddCountry:           this.page.getByRole('combobox', { name: 'Country' }),
        ddStateProvince:     this.page.getByRole('combobox', { name: 'State Province' }),

        // Buttons
        btnContinue:         this.page.getByTestId('button-submit'),
        btnJoinWithGoogle:   this.page.getByRole('button', { name: 'Join with Google' }),
        btnJoinWithApple:    this.page.getByRole('button', { name: 'Join with Apple' }),

        // In-form links
        lnkLogin:            this.page.locator('#link-vodafone-login'),
        lnkTermsAndConditions: this.page.getByTestId('link-dynamic-termsAndConditionsUrl'),
        lnkPrivacyNotice:    this.page.getByTestId('link-dynamic-privacyNoticeUrl'),

        // Footer links
        lnkFooterPrivacyPolicy:      this.page.getByTestId('legal-link-privacy-policy'),
        lnkFooterCookiePolicy:       this.page.getByTestId('legal-link-cookie-policy'),
        lnkFooterManageCookies:      this.page.getByTestId('legal-link-manage-cookies'),
        lnkFooterTermsAndConditions: this.page.getByTestId('legal-link-terms-and-conditions'),
        btnCookieManagerClose:       this.page.getByTestId('cookie-manager__btn_close'),

        // OTP
        otpInputs: this.page.locator('input[type="text"][inputmode="numeric"]'),
        resendOTPlink: this.page.getByRole('link', { name: 'Resend' }),

        // Validation messages
        msgEmailAlreadyExists: this.page.getByRole('heading', { name: 'Your e-mail address already exists' }),
        msgInvalidEmailFormat: this.page.getByText('Format is invalid. Please, enter a valid one.', { exact: true }),
        msgPasswordMismatch:   this.page.getByText('Password does not match', { exact: true }),
        msgRequiredFirstName:      this.page.getByText('First name is required', { exact: true }),
        msgRequiredLastName:       this.page.getByText('Family name is required', { exact: true }),
        msgRequiredEmail:          this.page.getByText('Email is required', { exact: true }),
        msgRequiredPassword:       this.page.getByText('Password is required', { exact: true }),
        msgRequiredConfirmPassword: this.page.getByText('Confirmed password is required', { exact: true }),

        // Success
        hdgSuccess: this.page.getByRole('heading', { name: 'All done! Your Travel Mobility profile is now complete.' }),
        continueToAccountBtn: this.page.getByRole('button', { name: 'Continue' }),

    };

    constructor(page: Page) {
        super(page);
    }

    private readonly countriesRequiringState = ['USA', 'Canada'];

    async fillRegistrationForm(info: RegistrationInfo) {
        await test.step('Fill Registration Form', async () => {
            await this.locators.txtFirstName.fill(info.firstName);
            await this.locators.txtLastName.fill(info.lastName);
            await this.locators.txtEmail.fill(info.email);

            await this.selectCountry(info.country);

            if (this.countriesRequiringState.includes(info.country)) {
                if (!info.stateProvince) throw new Error(`stateProvince is required when country is "${info.country}"`);
                await this.selectStateProvince(info.stateProvince);
            }

            await this.locators.txtPassword.fill(info.password);
            await this.locators.txtConfirmPassword.fill(info.confirmPassword);
        });
    }

    async fillDefaultForm(overrides: Partial<RegistrationInfo> = {}) {
        await this.fillRegistrationForm({
            firstName:       RegistrationTestData.firstName,
            lastName:        RegistrationTestData.lastName,
            email:           generateAliasEmail(),
            country:         RegistrationTestData.country,
            stateProvince:   RegistrationTestData.stateProvince,
            password:        RegistrationTestData.validPassword,
            confirmPassword: RegistrationTestData.validPassword,
            ...overrides,
        });
    }

    async selectCountry(country: string) {
        await test.step(`Select Country: ${country}`, async () => {
            await this.locators.ddCountry.click();
            await this.page.locator('#dropdown-country-listbox [role="option"]')
                .filter({ hasText: country }).first().click();
        });
    }

    async selectStateProvince(state: string) {
        await test.step(`Select State Province: ${state}`, async () => {
            await this.locators.ddStateProvince.click();
            await this.page.locator('[role="listbox"] [role="option"]')
                .filter({ hasText: state }).first().click();
        });
    }

    async isStateProvinceVisible(): Promise<boolean> {
        return this.locators.ddStateProvince.isVisible();
    }

    async submitForm() {
        await test.step('Click Continue', async () => {
            await this.locators.btnContinue.click();
        });
    }

    // Keep old name as alias so existing tests don't break
    async submitRegistrationForm() {
        await this.submitForm();
    }

    async clickJoinWithGoogle() {
        await test.step('Click Join with Google', async () => {
            await this.locators.btnJoinWithGoogle.click();
        });
    }

    async clickJoinWithApple() {
        await test.step('Click Join with Apple', async () => {
            await this.locators.btnJoinWithApple.click();
        });
    }

    async clickLoginLink() {
        await test.step('Click Login link (already have an account)', async () => {
            await this.locators.lnkLogin.click();
        });
    }

    async clickTermsAndConditionsLink() {
        return test.step('Click Terms and Conditions link', async () => {
            const popup = this.page.waitForEvent('popup');
            await this.locators.lnkTermsAndConditions.click();
            return popup;
        });
    }

    async clickPrivacyNoticeLink() {
        return test.step('Click Privacy Notice link', async () => {
            const popup = this.page.waitForEvent('popup');
            await this.locators.lnkPrivacyNotice.click();
            return popup;
        });
    }

    async clickFooterPrivacyPolicy() {
        return test.step('Click Footer Privacy Policy', async () => {
            const popup = this.page.waitForEvent('popup');
            await this.locators.lnkFooterPrivacyPolicy.click();
            return popup;
        });
    }

    async clickFooterCookiePolicy() {
        return test.step('Click Footer Cookie Policy', async () => {
            const popup = this.page.waitForEvent('popup');
            await this.locators.lnkFooterCookiePolicy.click();
            return popup;
        });
    }

    async clickFooterTermsAndConditions() {
        return test.step('Click Footer Terms and Conditions', async () => {
            const popup = this.page.waitForEvent('popup');
            await this.locators.lnkFooterTermsAndConditions.click();
            return popup;
        });
    }

    async openManageCookies() {
        await test.step('Open Manage Cookies panel', async () => {
            await this.locators.lnkFooterManageCookies.click();
        });
    }

    async closeManageCookies() {
        await test.step('Close Manage Cookies panel', async () => {
            await this.locators.btnCookieManagerClose.press('Escape');
        });
    }

    async enterOTP(otp: string) {
        await test.step('Enter OTP Code', async () => {
            const digits = otp.split('');
            for (let i = 0; i < digits.length; i++) {
                const box = this.locators.otpInputs.nth(i);
                await box.waitFor({ state: 'visible', timeout: actionTimeout });
                await box.fill(digits[i]);
                await box.press('Tab');
                await this.page.waitForTimeout(shortDelay);
            }
            await this.locators.otpInputs.nth(5).press('Enter');
            await this.page.waitForTimeout(animationDelay);
        });
    }

    async verifyStateProvinceVisible(shouldBeVisible: boolean) {
        await test.step(`Verify State Province dropdown is ${shouldBeVisible ? 'visible' : 'hidden'}`, async () => {
            if (shouldBeVisible) {
                await expect(this.locators.ddStateProvince).toBeVisible();
            } else {
                await expect(this.locators.ddStateProvince).not.toBeVisible();
            }
        });
    }

    async verifyRegistrationSuccess() {
        await test.step('Verify Registration Success', async () => {
            await expect(this.locators.hdgSuccess).toBeVisible();
        });
    }

    async verifyErrorMessageForExistingEmail(expectedErrorMessage: string) {
        await test.step('Verify Error Message for Existing Email', async () => {
            await expect(this.locators.msgEmailAlreadyExists).toBeVisible();
            await expect(this.locators.msgEmailAlreadyExists).toHaveText(expectedErrorMessage);
        });
    }

    async verifyErrorMessageForInvalidEmailFormat(expectedErrorMessage: string) {
        await test.step('Verify Error Message for Invalid Email Format', async () => {
            await expect(this.locators.msgInvalidEmailFormat).toBeVisible();
            await expect(this.locators.msgInvalidEmailFormat).toHaveText(expectedErrorMessage);
        });
    }

    async verifyErrorMessageForPasswordMismatch(expectedErrorMessage: string) {
        await test.step('Verify Error Message for Password Mismatch', async () => {
            await expect(this.locators.msgPasswordMismatch).toBeVisible();
            await expect(this.locators.msgPasswordMismatch).toHaveText(expectedErrorMessage);
        });
    }

    async verifyErrorMessageForRequiredFields() {
        await test.step('Verify Error Message for Required Fields', async () => {
            await expect(this.locators.msgRequiredFirstName).toBeVisible();
            await expect(this.locators.msgRequiredLastName).toBeVisible();
            await expect(this.locators.msgRequiredEmail).toBeVisible();
            await expect(this.locators.msgRequiredPassword).toBeVisible();
            await expect(this.locators.msgRequiredConfirmPassword).toBeVisible();
        });
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

    async verifyWelcomeEmailReceived(email: string, sentAt: number) {
        await test.step('Verify welcome email is received', async () => {
            const received = await waitForEmail({
                to: email,
                subject: /welcome/i,
                timeout: emailTestTimeout,
                afterTimestamp: sentAt,
            });
            expect(received.subject).toMatch(/welcome/i);
            expect(received.body).toContain('Thank you for making an account with Vodafone Travel');
        });
    }
}
