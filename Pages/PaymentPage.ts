import {test, expect, Page, Locator, FrameLocator} from '@playwright/test';
import { BasePage } from './BasePage';
import { CreditCardDetails } from './index';




export class PaymentPage extends BasePage {
  readonly paymentFrame: FrameLocator;
  readonly lnkSavedVisaCard: Locator;
  readonly btnAddNewCard: Locator;
  readonly txtCardNumber: Locator;
  readonly txtCardExpiry: Locator;
  readonly txtCardCVC: Locator;
  readonly txtCardHolderName: Locator;
  readonly btnPayLoggedIn: Locator;
  readonly btnPayLoggedOut: Locator;



constructor(page : Page) {
    super(page);
    // 1. Locate the iframe containing the payment gateway
    this.paymentFrame = page.frameLocator('iframe[src*="pre.pay.vodafone.com"]');

    
    // 2. The button is directly in the main payment frame
    this.btnAddNewCard = this.paymentFrame.getByTestId('addCardButton');

    // 3. SECURE FIELDS: These are nested IFRAMES inside the paymentFrame
    this.txtCardNumber = this.paymentFrame
        .frameLocator('iframe[title="Iframe for card number"]')
        .locator('input[aria-label="Card number"]');
        
    this.txtCardExpiry = this.paymentFrame
        .frameLocator('iframe[title="Iframe for expiry date"]')
        .locator('input[aria-label="Expiry date"]');
        
    this.txtCardCVC = this.paymentFrame
        .frameLocator('iframe[title="Iframe for security code"]')
        .locator('input[aria-label="Security code"]');
        

    this.lnkSavedVisaCard = this.paymentFrame.getByTestId('payment-card-item-ctob');

    this.txtCardHolderName = this.paymentFrame.getByLabel('Name on card');
    this.btnPayLoggedIn = this.paymentFrame.getByRole('button', { name: 'Pay' });

    this.btnPayLoggedOut = this.paymentFrame.getByTestId('pay');

  }

async fillCardDetailsAndPay(cardDetails : CreditCardDetails) {
    await test.step('Fill Card Details and Pay', async () => {
    await this.assertVisibilityOfPaymentGateway();
    await this.btnAddNewCard.click();
    // Use .pressSequentially with a small delay if .fill() is ignored by the secure frame
    await this.txtCardNumber.pressSequentially(cardDetails.number, { delay: 100 });
    await this.txtCardExpiry.pressSequentially(cardDetails.expiry, { delay: 100 });
    await this.txtCardCVC.pressSequentially(cardDetails.cvc, { delay: 100 });
    await this.txtCardHolderName.fill(cardDetails.name);
    await this.btnPayLoggedOut.click();
});}


  async performPaymentWithCardForLoggedInUsers(){
    await test.step('Perform Payment with Card for Logged-in Users', async () => {
    await this.lnkSavedVisaCard.click();
    await this.btnPayLoggedIn.click();

});}

  private async assertVisibilityOfPaymentGateway(){
    await test.step('Assert visibility of Payment Gateway Heading', async () => {
    await expect (this.btnAddNewCard).toBeVisible({timeout:30000});
});}




}