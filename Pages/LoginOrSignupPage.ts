import { Page, test } from "@playwright/test";
import { BasePage } from "./BasePage";     
export class LoginOrSignupPage extends BasePage {
    private readonly loginPageLocators = {
        // Login And SignUp page locators
        signUpBtn: this.page.getByRole('button', { name: 'Sign up' }),
        loginBtn: this.page.locator('#login_btn'),

        
       
    };

    constructor(page: Page) {
        super(page);
    }

    async navigateToLoginOrSignUpPage(URL: string) {
        await test.step('Navigate to Login or Sign Up Page', async () => {
            await this.navigateToUrl(URL);
            await this.acceptCookies();
        });
    }   
    async proceedWithLogin(){
        await test.step('Proceed with Login', async () => {
    await this.loginPageLocators.loginBtn.click();
});}

async ProceedWithSignUp(){
    await test.step('Proceed with Sign Up', async () => {
    await this.loginPageLocators.signUpBtn.click();
});}
    
    }