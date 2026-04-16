import {expect, Page,test} from '@playwright/test';
import { BasePage } from './BasePage';
import { GuestInfo, BillingAddressInfo, NonExistingUser } from './index';

export class CheckoutPage extends BasePage {
    
    private readonly checkoutPageLocators = {
    
        // User profile/Login section
        imgAvatarLoggedIn: this.page.getByAltText('avatar'),
        lnkLogin: this.page.getByRole('link', { name: 'Log in' }),
        lnkVodafoneCustomerLogin: this.page.getByRole('link', { name: 'here' }),

        // Personal information form fields
        txtFirstName: this.page.getByRole('textbox', { name: 'John', exact: true }),
        txtLastName: this.page.getByRole('textbox', { name: 'Wick' }),
        txtEmail: this.page.getByRole('textbox', { name: 'john.wich@gmail.com' }),

        // Billing address form fields
        selBillingCountry: this.page.getByRole('combobox'),
        selBillingState: this.page.locator('#state'),
        txtBillingCity: this.page.getByRole('textbox', { name: 'Johannesburg' }),
        txtBillingAddressLine1: this.page.getByRole('textbox', { name: 'The Paddocks' }),
        txtBillingAddressLine2: this.page.getByRole('textbox', { name: 'Address Line 2' }),
        txtBillingZipCode: this.page.getByRole('textbox', { name: '02340' }),

        
        // Checkboxes and consent
        chkAgreementConsent: this.page.locator('.sc-ilvUFQ').first(),
        chkPersonalizedOffers: this.page.locator('#undefined-1 > .sc-ilvUFQ'),

        // Action buttons
        btnContinueToPayment: this.page.getByRole('button', { name: 'Continue to payment' }),
    
    
    };
    constructor(page: Page) {
        super(page);
    }
    
    async fillPersonalDetailsForNonExistingUser(info :NonExistingUser) {
        await test.step('Fill Personal Details for Non existing user', async () => {
    await this.checkoutPageLocators.txtFirstName.fill(info.firstName);
    await this.checkoutPageLocators.txtLastName.fill(info.lastName);
    await this.checkoutPageLocators.txtEmail.fill(info.email);    
});
    }
     async fillPersonalDetailsForExistingUser(info: GuestInfo) {
        await test.step('Fill Personal Details for existing user', async () => {
    await this.checkoutPageLocators.txtFirstName.fill(info.firstName);
    await this.checkoutPageLocators.txtLastName.fill(info.lastName);
    await this.checkoutPageLocators.txtEmail.fill(info.email);
    
});}


async GuestCheckoutLoginWithExistingAccount(){
    await test.step('Login with existing account during Guest Checkout', async () => {
    await this.checkoutPageLocators.lnkLogin.click();
});}

async fillBillingAddressDetailsForUserAndProceedToPayment(info: BillingAddressInfo) {
    await test.step('Fill Billing Details for user', async () => {
        // Select country
        await this.checkoutPageLocators.selBillingCountry.click();
        await this.page.getByRole('option', { name: info.country.toUpperCase() }).click();
        
        // Fill city
        await this.checkoutPageLocators.txtBillingCity.click();
        await this.checkoutPageLocators.txtBillingCity.fill(info.city || '');
        
        // Select state
        const stateField = this.checkoutPageLocators.selBillingState;
        if (await stateField.isVisible()) {
            await stateField.click();
            await stateField.fill(info.state?.toUpperCase() || '');
            await this.page.getByRole('option', { name: info.state?.toUpperCase() }).click();
        }
        
        // Fill address line 1
        if (info.addressLine1) {
            await this.checkoutPageLocators.txtBillingAddressLine1.click();
            await this.checkoutPageLocators.txtBillingAddressLine1.fill(info.addressLine1);
        }
        
        // Fill ZIP code
        if (info.zipCode) {
            await this.checkoutPageLocators.txtBillingZipCode.click();
            await this.checkoutPageLocators.txtBillingZipCode.fill(info.zipCode);
        }

        await this.proceedToPayment();

    });
}


async proceedToPayment(){
    await test.step('Proceed to Payment from Checkout Page', async () => {
        
        // Check agreement consent checkbox

        await this.checkoutPageLocators.chkAgreementConsent.click();
        
        // Click continue to payment button
        await this.checkoutPageLocators.btnContinueToPayment.click();
    });
}



}





