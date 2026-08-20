import {test, expect,Page  } from '@playwright/test';
import { BasePage } from './BasePage';
import { LoginInfo } from './index';
import { navigationTimeout } from '../playwright.config';



export class LoginPage extends BasePage {
    private readonly loginPageLocators = {
        // Login page locators
        txtEmail: this.page.getByLabel('Email'),
        txtPassword: this.page.getByRole('textbox', { name: 'Password' }),
        lnkForgetPassword: this.page.getByTestId('link-resetPassword'),
        btnContinue: this.page.getByRole('button', { name: 'Continue' }),
        btnLoginGoogle: this.page.getByRole('button', { name: 'Login with Google' }),
        btnLoginApple: this.page.getByRole('button', { name: 'Login with Apple' }),
        btnCancel: this.page.getByRole('button', { name: 'Cancel' }),
        invalidLoginErrorMessage: this.page.getByText('Invalid Credentials', { exact: true }),
        emailErrorMessage: this.page.getByText('Email or phone number is required', { exact: true }),
        passwordErrorMessage: this.page.getByText('Password is required', { exact: true }),



        
    };

    constructor(page: Page) {
        super(page);
    }


    async navigateAndLogin(loginUrl: string, credentials: LoginInfo) {
        await test.step('Navigate to VRS login page and sign in', async () => {
            await this.navigateToUrl(loginUrl);
            await this.page.locator('#login_btn').click();
            await this.verifyRedirectionAndCompleteLoadToLoginPage();
            await this.fillLoginDetailsAndSubmit(credentials);
            const baseUrl = (process.env.BASE_URL ?? '').replace(/\/$/, '');
            await this.page.waitForURL(
                url => url.toString().startsWith(baseUrl) && !url.toString().includes('/login'),
                { timeout: navigationTimeout, waitUntil: 'commit' }
            );
            await this.page.waitForLoadState('domcontentloaded');
        });
    }

    async fillLoginDetailsAndSubmit(info: LoginInfo) {
        await test.step('Fill Login Details and Submit', async () => {
        await this.loginPageLocators.txtEmail.fill(info.email);
        await this.loginPageLocators.txtPassword.fill(info.password);
        await this.loginPageLocators.btnContinue.click();
        
    });
    }   

    async verifyRedirectionAndCompleteLoadToLoginPage() {
        await test.step('Verify redirect to login page', async () => {
        // Title dropped: it reads "Vodafone ID" on production but "Vodafone | Log in to your account"
        // on the Test env's IDP (xm.pre.idp.vodafone.com) — the URL check below already confirms the
        // meaningful fact (redirected to the identity provider) without hardcoding an env-specific title.
        await expect (this.page).toHaveURL(/.*idp.vodafone.com/);

        });
    }
    async verifyErrorMessageForInvalidUsername(expectedErrorMessage: string) {
        await test.step('Verify error message for invalid username', async () => {
        const errorMessageLocator = this.loginPageLocators.invalidLoginErrorMessage;
        await expect(errorMessageLocator).toBeVisible();
        await expect(errorMessageLocator).toHaveText(expectedErrorMessage);
        });
    }

    async verifyErrorMessageForEmptyEmail(expectedErrorMessage: string) {
        await test.step('Verify error message for empty email', async () => {
            const errorMessageLocator = this.loginPageLocators.emailErrorMessage;
            await expect(errorMessageLocator).toBeVisible();
            await expect(errorMessageLocator).toHaveText(expectedErrorMessage);
        });
    }

    async verifyErrorMessageForEmptyPassword(expectedErrorMessage: string) {
        await test.step('Verify error message for empty password', async () => {
            const errorMessageLocator = this.loginPageLocators.passwordErrorMessage;
            await expect(errorMessageLocator).toBeVisible();
            await expect(errorMessageLocator).toHaveText(expectedErrorMessage);
        });
    }

    async clickForgotPasswordLink() {
        await test.step('Click Forgot Password link', async () => {
            await this.loginPageLocators.lnkForgetPassword.click();
        });
    }

    async clickCancelButton() {
        await test.step('Click Cancel button', async () => {
            await this.loginPageLocators.btnCancel.click();
        });
    }

    async clickLoginWithGoogle() {
        await test.step('Click Login with Google button', async () => {
            await this.loginPageLocators.btnLoginGoogle.click();
        });
    }

    async clickLoginWithApple() {
        await test.step('Click Login with Apple button', async () => {
            await this.loginPageLocators.btnLoginApple.click();
        });
    }

    async verifyRedirectionToGoogleSignIn() {
        await test.step('Verify redirect to Google sign-in', async () => {
            await expect(this.page).toHaveURL(/^https:\/\/accounts\.google\.com\//);
        });
    }

    async verifyRedirectionToAppleSignIn() {
        await test.step('Verify redirect to Apple sign-in', async () => {
            await expect(this.page).toHaveURL(/^https:\/\/appleid\.apple\.com\//);
        });
    }

    async verifyNavigationBackToVRS() {
        await test.step('Verify navigation back to VRS site', async () => {
            await expect(this.page).toHaveURL(/.*vrs.preprod.travel.vodafone.com/);
        });
    }

    async verifyNavigationToForgotPasswordPage() {
        await test.step('Verify navigation to forgot password page', async () => {
            await expect(this.page).not.toHaveURL(/.*idp.vodafone.com\/login/);
            await expect(this.page).toHaveURL(/.*idp.vodafone.com/);
        });
    }
}   