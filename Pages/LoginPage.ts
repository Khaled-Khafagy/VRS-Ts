import {test, expect,Page  } from '@playwright/test';
import { BasePage } from './BasePage';
import { LoginInfo } from './index';



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


    async fillLoginDetailsAndSubmit(info: LoginInfo) {
        await test.step('Fill Login Details and Submit', async () => {
        await this.loginPageLocators.txtEmail.fill(info.email);
        await this.loginPageLocators.txtPassword.fill(info.password);
        await this.loginPageLocators.btnContinue.click();
        
    });
    }   

    async verifyRedirectionAndCompleteLoadToLoginPage() {
        await test.step('Verify redirect to login page', async () => {
        await expect(this.page).toHaveTitle('Vodafone ID');
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