# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: website/Regression/login.spec.ts >> Login with empty password
- Location: tests/website/Regression/login.spec.ts:37:5

# Error details

```
Error: expect(page).toHaveTitle(expected) failed

Expected: "Vodafone ID"
Received: "Vodafone | Log in to your account"
Timeout:  5000ms

Call log:
  - Expect "toHaveTitle" with timeout 5000ms
    5 × unexpected value ""
    3 × unexpected value "Vodafone | Log in to your account"

```

# Page snapshot

```yaml
- application [ref=e2]:
  - generic [ref=e3]:
    - navigation
    - main [ref=e4]:
      - region "scrollable content" [ref=e9]:
        - generic [ref=e11]:
          - generic [ref=e12]:
            - heading "Log in to your account" [level=1] [ref=e15]
            - generic [ref=e18]:
              - text: Don't have a My Vodafone account?
              - link "Create account" [ref=e19] [cursor=pointer]:
                - /url: "#"
          - generic [ref=e20]:
            - generic [ref=e23]:
              - generic [ref=e24]:
                - generic [ref=e25]:
                  - generic [ref=e26]: Email
                  - textbox "Email" [ref=e28]
                  - generic [ref=e29]: Enter your email, phone number or username
                - generic [ref=e31]:
                  - generic [ref=e32]: Password
                  - generic [ref=e33]:
                    - textbox "Password" [ref=e34]
                    - button "Show password" [ref=e35] [cursor=pointer]
                  - generic [ref=e37]: Enter your password
                - link "Forgot your password?" [ref=e39] [cursor=pointer]:
                  - /url: "#"
              - generic [ref=e40]:
                - button "Continue" [ref=e42] [cursor=pointer]
                - generic [ref=e43]:
                  - generic [ref=e44]: or
                  - button "Login with Google" [ref=e46] [cursor=pointer]:
                    - generic [ref=e47]:
                      - img [ref=e49]
                      - text: Login with Google
                  - button "Login with Apple" [ref=e56] [cursor=pointer]:
                    - generic [ref=e57]:
                      - img [ref=e59]
                      - text: Login with Apple
                - button "Cancel" [ref=e63] [cursor=pointer]
            - generic [ref=e64]:
              - list [ref=e67]:
                - listitem [ref=e68]:
                  - link "Privacy Policy" [ref=e69] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e70]:
                  - link "Cookie Policy" [ref=e71] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e72]:
                  - link "View Cookies" [ref=e73] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e74]:
                  - link "Terms & Conditions" [ref=e75] [cursor=pointer]:
                    - /url: "#"
              - generic [ref=e76]: © 2026 Vodafone
```

# Test source

```ts
  1  | import {test, expect,Page  } from '@playwright/test';
  2  | import { BasePage } from './BasePage';
  3  | import { LoginInfo } from './index';
  4  | 
  5  | 
  6  | 
  7  | export class LoginPage extends BasePage {
  8  |     private readonly loginPageLocators = {
  9  |         // Login page locators
  10 |         txtEmail: this.page.getByLabel('Email'),
  11 |         txtPassword: this.page.getByRole('textbox', { name: 'Password' }),
  12 |         lnkForgetPassword: this.page.getByTestId('link-resetPassword'),
  13 |         btnContinue: this.page.getByRole('button', { name: 'Continue' }),
  14 |         btnLoginGoogle: this.page.getByRole('button', { name: 'Login with Google' }),
  15 |         btnLoginApple: this.page.getByRole('button', { name: 'Login with Apple' }),
  16 |         btnCancel: this.page.getByRole('button', { name: 'Cancel' }),
  17 |         invalidLoginErrorMessage: this.page.getByText('Invalid Credentials', { exact: true }),
  18 |         emailErrorMessage: this.page.getByText('Email or phone number is required', { exact: true }),
  19 |         passwordErrorMessage: this.page.getByText('Password is required', { exact: true }),
  20 | 
  21 | 
  22 | 
  23 |         
  24 |     };
  25 | 
  26 |     constructor(page: Page) {
  27 |         super(page);
  28 |     }
  29 | 
  30 | 
  31 |     async fillLoginDetailsAndSubmit(info: LoginInfo) {
  32 |         await test.step('Fill Login Details and Submit', async () => {
  33 |         await this.loginPageLocators.txtEmail.fill(info.email);
  34 |         await this.loginPageLocators.txtPassword.fill(info.password);
  35 |         await this.loginPageLocators.btnContinue.click();
  36 |         
  37 |     });
  38 |     }   
  39 | 
  40 |     async verifyRedirectionAndCompleteLoadToLoginPage() {
  41 |         await test.step('Verify redirect to login page', async () => {
> 42 |         await expect(this.page).toHaveTitle('Vodafone ID');
     |                                 ^ Error: expect(page).toHaveTitle(expected) failed
  43 |         await expect (this.page).toHaveURL(/.*idp.vodafone.com/);
  44 | 
  45 |         });
  46 |     }
  47 |     async verifyErrorMessageForInvalidUsername(expectedErrorMessage: string) {
  48 |         await test.step('Verify error message for invalid username', async () => {
  49 |         const errorMessageLocator = this.loginPageLocators.invalidLoginErrorMessage;
  50 |         await expect(errorMessageLocator).toBeVisible();
  51 |         await expect(errorMessageLocator).toHaveText(expectedErrorMessage);
  52 |         });
  53 |     }
  54 | 
  55 |     async verifyErrorMessageForEmptyEmail(expectedErrorMessage: string) {
  56 |         await test.step('Verify error message for empty email', async () => {
  57 |             const errorMessageLocator = this.loginPageLocators.emailErrorMessage;
  58 |             await expect(errorMessageLocator).toBeVisible();
  59 |             await expect(errorMessageLocator).toHaveText(expectedErrorMessage);
  60 |         });
  61 |     }
  62 | 
  63 |     async verifyErrorMessageForEmptyPassword(expectedErrorMessage: string) {
  64 |         await test.step('Verify error message for empty password', async () => {
  65 |             const errorMessageLocator = this.loginPageLocators.passwordErrorMessage;
  66 |             await expect(errorMessageLocator).toBeVisible();
  67 |             await expect(errorMessageLocator).toHaveText(expectedErrorMessage);
  68 |         });
  69 |     }
  70 | 
  71 |     async clickForgotPasswordLink() {
  72 |         await test.step('Click Forgot Password link', async () => {
  73 |             await this.loginPageLocators.lnkForgetPassword.click();
  74 |         });
  75 |     }
  76 | 
  77 |     async clickCancelButton() {
  78 |         await test.step('Click Cancel button', async () => {
  79 |             await this.loginPageLocators.btnCancel.click();
  80 |         });
  81 |     }
  82 | 
  83 |     async verifyNavigationBackToVRS() {
  84 |         await test.step('Verify navigation back to VRS site', async () => {
  85 |             await expect(this.page).toHaveURL(/.*vrs.preprod.travel.vodafone.com/);
  86 |         });
  87 |     }
  88 | 
  89 |     async verifyNavigationToForgotPasswordPage() {
  90 |         await test.step('Verify navigation to forgot password page', async () => {
  91 |             await expect(this.page).not.toHaveURL(/.*idp.vodafone.com\/login/);
  92 |             await expect(this.page).toHaveURL(/.*idp.vodafone.com/);
  93 |         });
  94 |     }
  95 | }   
```