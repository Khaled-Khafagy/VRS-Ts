import {test, expect, Page, Locator, FrameLocator} from '@playwright/test';
import { BasePage } from './base.page';
import { TIMEOUT } from 'node:dns';



export interface CreditCardDetails {
        number: string;
        expiry: string;
        cvc: string;
        name: string;
    }

export class PaymentPage extends BasePage {
  readonly paymentFrame: FrameLocator;
    readonly savedVisaCard: Locator;
  readonly addNewCardButton: Locator;
  readonly cardNumberInput: Locator;
  readonly cardExpiryInput: Locator;
  readonly cardCVCInput: Locator;
  readonly cardHolderNameInput: Locator;
  readonly payButton: Locator;



constructor(page : Page) {
    super(page);
    // 1. Locate the iframe containing the payment gateway
    this.paymentFrame = page.frameLocator('iframe[src*="pay.vodafone.com"]');

    
    // 2. The button is directly in the main payment frame
    this.addNewCardButton = this.paymentFrame.getByTestId('addCardButton');

    // 3. SECURE FIELDS: These are nested IFRAMES inside the paymentFrame
    this.cardNumberInput = this.paymentFrame
        .frameLocator('iframe[title="Iframe for card number"]')
        .locator('input[aria-label="Card number"]');
        
    this.cardExpiryInput = this.paymentFrame
        .frameLocator('iframe[title="Iframe for expiry date"]')
        .locator('input[aria-label="Expiry date"]');
        
    this.cardCVCInput = this.paymentFrame
        .frameLocator('iframe[title="Iframe for security code"]')
        .locator('input[aria-label="Security code"]');
        

    this.savedVisaCard = this.paymentFrame.locator('text=**** 0007');


    this.cardHolderNameInput = this.paymentFrame.getByLabel('Name on card');
    this.payButton = this.paymentFrame.getByTestId('pay');

  }

async fillCardDetailsAndPay(cardDetails : CreditCardDetails) {
    await test.step('Fill Card Details and Pay', async () => {
    await this.addNewCardButton.click();
    // Use .pressSequentially with a small delay if .fill() is ignored by the secure frame
    await this.cardNumberInput.pressSequentially(cardDetails.number, { delay: 100 });
    await this.cardExpiryInput.pressSequentially(cardDetails.expiry, { delay: 100 });
    await this.cardCVCInput.pressSequentially(cardDetails.cvc, { delay: 100 });
    await this.cardHolderNameInput.fill(cardDetails.name);
    await this.clickPayButton();
    console.log("Card details filled and Pay button clicked.");
});}






  async assertVisibilityOfPaymentGateway(){
    await test.step('Assert visibility of Payment Gateway Heading', async () => {
    await expect (this.addNewCardButton).toBeVisible({timeout:30000});
    console.log("Payment Gateway Heading is visible.");
});}


async selectSavedCardAndPay(){   
    await test.step('Select Saved Visa Card and Pay', async () => {
    await this.savedVisaCard.waitFor({state:'visible',timeout:15000});
    await this.clickPayButton();
    console.log("Saved Visa Card selected and Pay button clicked.");
}); }


  async clickPayButton(){
    await this.payButton.scrollIntoViewIfNeeded();
    await this.payButton.click();
  }




}