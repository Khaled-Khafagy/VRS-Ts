import {test, expect,Page  } from '@playwright/test';
import { BasePage } from './BasePage';
import { loginInfo } from './index';



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



        
    };

    constructor(page: Page) {
        super(page);
    }


    async fillLoginDetailsAndSubmit(info: loginInfo) {
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
    async verifyErrorMessageForInvalidCredentials(expectedErrorMessage: string) {
        await test.step('Verify error message for invalid credentials', async () => {
        const errorMessageLocator = this.page.getByTestId('error-message');
        await expect(errorMessageLocator).toBeVisible();
        await expect(errorMessageLocator).toHaveText(expectedErrorMessage);
        });
    }   
}   