import { Page, test, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { SSOInfo } from './index';
import { actionTimeout, navigationTimeout } from '../playwright.config';

export class SSOPage extends BasePage {
    private readonly ssoLocators = {
        txtEmailOrPhone: this.page.getByRole('textbox', { name: 'Enter your email, phone, or' }),
        // Bypasses passkey flow — visible on the email page before clicking Next
        btnSignInOptions: this.page.getByText('Sign-in options'),
        // Shown in the sign-in options panel
        lnkSignInWithPassword: this.page.getByText('Sign in with a password'),
        txtPassword: this.page.getByRole('textbox', { name: 'Password' }),
        btnSignIn: this.page.getByRole('button', { name: 'Sign in' }),
        btnYes: this.page.getByRole('button', { name: 'Yes' }),
    };

    constructor(page: Page) {
        super(page);
    }

    async completeSSO(credentials: SSOInfo) {
        await test.step('Complete Microsoft SSO authentication', async () => {
            await expect(this.page).toHaveURL(/login\.microsoftonline\.com/, { timeout: navigationTimeout });
            await this.ssoLocators.txtEmailOrPhone.fill(credentials.email);
            await this.page.getByRole('button', { name: 'Next' }).click();

            // Wait for whichever flow appears: Windows shows "Sign-in options", Mac shows device cert option
            const signInOptions = this.ssoLocators.btnSignInOptions;
            const deviceCertOption = this.page.getByLabel('11');

            await Promise.race([
                signInOptions.waitFor({ state: 'visible', timeout: actionTimeout }),
                deviceCertOption.waitFor({ state: 'visible', timeout: actionTimeout }),
            ]);

            if (await signInOptions.isVisible()) {
                // Windows flow: sign-in options → password
                await signInOptions.click();
                await this.ssoLocators.lnkSignInWithPassword.click();
                await expect(this.ssoLocators.txtPassword).toBeVisible({ timeout: actionTimeout });
                await this.ssoLocators.txtPassword.fill(credentials.pin);
                await this.ssoLocators.btnSignIn.click();
            } else {
                // Mac flow: device certificate authentication
                await deviceCertOption.click();
                await this.page.locator('#lightbox').click();
                await this.page.goto('https://login.microsoftonline.com/common/DeviceAuthTls/reprocess');
            }

            await this.ssoLocators.btnYes.click();
            await this.page.waitForURL(url => !url.toString().includes('microsoftonline.com'), { timeout: navigationTimeout });
        });
    }
}
