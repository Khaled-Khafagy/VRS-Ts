import {test, expect,Page  } from '@playwright/test';
import { BasePage } from './base.page';
export interface loginInfo {
    email: string;
    password: string;
}



export class LoginPage extends BasePage {
    private readonly loginPageLocators = {
        // Login page locators
        loginFormHeading: this.page.getByRole('heading', { name: 'Log in to your account' }),
        emailInputField: this.page.getByLabel('Email'),
        passwordInputField: this.page.getByLabel('Password'),
        forgetYourPasswordLink: this.page.getByTestId('link-resetPassword'),
        continueButton: this.page.getByRole('button', { name: 'Continue' }),
        loginWithGoogleButton: this.page.getByRole('button', { name: 'Login with Google' }),
        loginWithAppleButton: this.page.getByRole('button', { name: 'Login with Apple' }),
        cancelButton: this.page.getByRole('button', { name: 'Cancel' }),



        
    };

    constructor(page: Page) {
        super(page);
    }


    async fillLoginDetailsAndSubmit(info: loginInfo) {
        await test.step('Fill Login Details and Submit', async () => {
        await this.loginPageLocators.emailInputField.fill(info.email);
        await this.loginPageLocators.passwordInputField.fill(info.password);
        await this.loginPageLocators.continueButton.click();
        console.log("Login details filled and submitted.");
    });
    }   





















    async verifyRedirectionAndCompleteLoadToLoginPage() {
        await test.step('Verify redirect to login page', async () => {
        await expect(this.page).toHaveTitle(/Log in to your account/);
        await expect (this.page).toHaveURL(/.*idp.vodafone.com/);
        await expect(this.loginPageLocators.loginFormHeading).toBeVisible();
        console.log("Redirected to Login page as expected.");

        });
    }
}   