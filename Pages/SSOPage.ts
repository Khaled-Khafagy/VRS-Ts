import { Page, test, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { SSOInfo } from './index';

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
            await expect(this.page).toHaveURL(/login\.microsoftonline\.com/, { timeout: 15000 });
            await this.ssoLocators.txtEmailOrPhone.fill(credentials.email);

            // Click "Sign-in options" to avoid the passkey/FIDO flow entirely,
            // then choose password — no native Windows Security dialog is triggered.
            await this.ssoLocators.btnSignInOptions.click();
            await this.ssoLocators.lnkSignInWithPassword.click();

            await expect(this.ssoLocators.txtPassword).toBeVisible({ timeout: 10000 });
            await this.ssoLocators.txtPassword.fill(credentials.pin);
            await this.ssoLocators.btnSignIn.click();

            await this.ssoLocators.btnYes.click();
            await expect(this.page).toHaveURL(/vrs\.preprod\.travel\.vodafone\.com/, { timeout: 15000 });
        });
    }
}
