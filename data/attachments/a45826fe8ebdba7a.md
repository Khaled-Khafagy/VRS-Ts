# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: website/Regression/guestCheckout.spec.ts >> Guest checkout login with existing account
- Location: tests/website/Regression/guestCheckout.spec.ts:34:5

# Error details

```
TimeoutError: page.waitForURL: Timeout 30000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
============================================================
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
            - generic [active] [ref=e20]:
              - generic [ref=e21]:
                - img "Warning" [ref=e24]
                - generic [ref=e29]: Invalid Credentials
              - generic [ref=e32]: Username or password is incorrect. Please try again.
          - generic [ref=e33]:
            - generic [ref=e36]:
              - generic [ref=e37]:
                - generic [ref=e38]:
                  - generic [ref=e39]: Email
                  - textbox "Email" [ref=e41]: your test account email
                  - generic [ref=e42]: Enter your email, phone number or username
                - generic [ref=e44]:
                  - generic [ref=e45]: Password
                  - generic [ref=e46]:
                    - textbox "Password" [ref=e47]
                    - button "Show password" [ref=e48] [cursor=pointer]
                  - generic [ref=e50]: Enter your password
                - link "Forgot your password?" [ref=e52] [cursor=pointer]:
                  - /url: "#"
              - generic [ref=e53]:
                - button "Continue" [ref=e55] [cursor=pointer]
                - generic [ref=e56]:
                  - generic [ref=e57]: or
                  - button "Login with Google" [ref=e59] [cursor=pointer]:
                    - generic [ref=e60]:
                      - img [ref=e62]
                      - text: Login with Google
                  - button "Login with Apple" [ref=e69] [cursor=pointer]:
                    - generic [ref=e70]:
                      - img [ref=e72]
                      - text: Login with Apple
                - button "Cancel" [ref=e76] [cursor=pointer]
            - generic [ref=e77]:
              - list [ref=e80]:
                - listitem [ref=e81]:
                  - link "Privacy Policy" [ref=e82] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e83]:
                  - link "Cookie Policy" [ref=e84] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e85]:
                  - link "View Cookies" [ref=e86] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e87]:
                  - link "Terms & Conditions" [ref=e88] [cursor=pointer]:
                    - /url: "#"
              - generic [ref=e89]: © 2026 Vodafone
```

# Test source

```ts
  16  |         txtLastName: this.page.getByRole('textbox', { name: 'Wick' }),
  17  |         txtEmail: this.page.getByRole('textbox', { name: 'john.wich@gmail.com' }),
  18  | 
  19  |         // Billing address form fields
  20  |         selBillingCountry: this.page.getByRole('combobox'),
  21  |         selBillingState: this.page.locator('#state'),
  22  |         txtBillingCity: this.page.getByRole('textbox', { name: 'Johannesburg' }),
  23  |         txtBillingAddressLine1: this.page.getByRole('textbox', { name: 'The Paddocks' }),
  24  |         txtBillingAddressLine2: this.page.getByRole('textbox', { name: 'Address Line 2' }),
  25  |         txtBillingZipCode: this.page.getByRole('textbox', { name: '02340' }),
  26  | 
  27  |         
  28  |         // Target the hidden <input> by stable value attribute — works for both guest and logged-in states.
  29  |         // The label wraps hyperlinks so clicking the label navigates; force:true on the input checks the box directly.
  30  |         chkAgreementConsentBox: this.page.locator('input[value="consolidated"]'),
  31  |         chkPersonalizedOffersBox: this.page.locator('input[value="offers"]'),
  32  | 
  33  |         // Action buttons
  34  |         btnContinueToPayment: this.page.locator("//button[@id='checkout_payment_btn']"),
  35  |     
  36  |     
  37  |     };
  38  |     constructor(page: Page) {
  39  |         super(page);
  40  |     }
  41  |     
  42  |     async fillPersonalDetailsForNonExistingUser(info :NonExistingUser) {
  43  |         await test.step('Fill Personal Details for Non existing user', async () => {
  44  |     await this.checkoutPageLocators.txtFirstName.fill(info.firstName);
  45  |     await this.checkoutPageLocators.txtLastName.fill(info.lastName);
  46  |     await this.checkoutPageLocators.txtEmail.fill(info.email);    
  47  | });
  48  |     }
  49  |      async fillPersonalDetailsForExistingUser(info: GuestInfo) {
  50  |         await test.step('Fill Personal Details for existing user', async () => {
  51  |     await this.checkoutPageLocators.txtFirstName.fill(info.firstName);
  52  |     await this.checkoutPageLocators.txtLastName.fill(info.lastName);
  53  |     await this.checkoutPageLocators.txtEmail.fill(info.email);
  54  |     
  55  | });}
  56  | 
  57  | 
  58  | async guestCheckoutLoginWithExistingAccount(){
  59  |     await test.step('Login with existing account during Guest Checkout', async () => {
  60  |     await this.checkoutPageLocators.lnkLogin.click();
  61  | });}
  62  | 
  63  | async fillBillingAddressDetailsForUserAndProceedToPayment(info: BillingAddressInfo) {
  64  |     await test.step('Fill Billing Details for user', async () => {
  65  |         // Select country
  66  |         await this.checkoutPageLocators.selBillingCountry.click();
  67  |         await this.page.getByRole('option', { name: info.country.toUpperCase() }).click();
  68  |         
  69  |         // Fill city
  70  |         await this.checkoutPageLocators.txtBillingCity.click();
  71  |         await this.checkoutPageLocators.txtBillingCity.fill(info.city || '');
  72  |         
  73  |         // Select state
  74  |         const stateField = this.checkoutPageLocators.selBillingState;
  75  |         if (await stateField.isVisible()) {
  76  |             await stateField.click();
  77  |             await stateField.fill(info.state?.toUpperCase() || '');
  78  |             await this.page.getByRole('option', { name: info.state?.toUpperCase() }).click();
  79  |         }
  80  |         
  81  |         // Fill address line 1
  82  |         if (info.addressLine1) {
  83  |             await this.checkoutPageLocators.txtBillingAddressLine1.click();
  84  |             await this.checkoutPageLocators.txtBillingAddressLine1.fill(info.addressLine1);
  85  |         }
  86  |         
  87  |         // Fill ZIP code
  88  |         if (info.zipCode) {
  89  |             await this.checkoutPageLocators.txtBillingZipCode.click();
  90  |             await this.checkoutPageLocators.txtBillingZipCode.fill(info.zipCode);
  91  |         }
  92  |         await this.proceedToPaymentAsGuest();
  93  | 
  94  |         
  95  | 
  96  |     });
  97  | }
  98  | 
  99  | 
  100 | async proceedToPaymentAsGuest(){
  101 |     await test.step('Proceed to Payment as Guest', async () => {
  102 |         await this.page.evaluate(() => {
  103 |             const checkbox = document.querySelector('input[value="consolidated"]') as HTMLInputElement;
  104 |             if (checkbox && !checkbox.checked) {
  105 |                 checkbox.checked = true;
  106 |                 checkbox.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  107 |                 checkbox.dispatchEvent(new Event('change', { bubbles: true }));
  108 |             }
  109 |         });
  110 |         await this.checkoutPageLocators.btnContinueToPayment.click();
  111 |     });
  112 | }
  113 | 
  114 | async proceedToPaymentAsLoggedInUser(){
  115 |     await test.step('Proceed to Payment as Logged-In User', async () => {
> 116 |         await this.page.waitForURL(/.*vrs\.preprod\.travel\.vodafone\.com.*/, { timeout: 30000 });
      |                         ^ TimeoutError: page.waitForURL: Timeout 30000ms exceeded.
  117 |         await this.page.waitForLoadState('networkidle');
  118 |         await this.page.evaluate(() => {
  119 |             (document.querySelector('input[value="consolidated"]') as HTMLElement).click();
  120 |         });
  121 |         await this.checkoutPageLocators.btnContinueToPayment.waitFor({ state: 'visible', timeout: 10000 });
  122 |         await this.checkoutPageLocators.btnContinueToPayment.click();
  123 |     });
  124 | }
  125 | 
  126 | 
  127 | 
  128 | 
  129 | 
  130 | }
  131 | 
  132 | 
```