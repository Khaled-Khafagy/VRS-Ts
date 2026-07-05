import { test, expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CreditCardDetails } from './index';
import { actionTimeout, typingDelay, shortDelay } from '../playwright.config';

export class PaymentPage extends BasePage {

    private readonly paymentPageLocators = {

        // ── Section 1: Guest card form (new card) ─────────────────────────────
        // Entry point — visible before card form fields are shown
        btnAddNewCard:          this.page.frameLocator('iframe[title="checkout-payment-iframe"]')
                                    .getByTestId('addCardButton'),

        // ── Section 2: Secure nested iframes (card details) ───────────────────
        // Each field lives inside its own nested iframe — .fill() is silently
        // ignored by the payment gateway; always use .pressSequentially()
        txtCardNumber:          this.page.frameLocator('iframe[title="checkout-payment-iframe"]')
                                    .frameLocator('iframe[title="Iframe for card number"]')
                                    .getByRole('textbox', { name: 'Card number' }),

        txtCardExpiry:          this.page.frameLocator('iframe[title="checkout-payment-iframe"]')
                                    .frameLocator('iframe[title="Iframe for expiry date"]')
                                    .getByRole('textbox', { name: 'Expiry date' }),

        txtCardCVC:             this.page.frameLocator('iframe[title="checkout-payment-iframe"]')
                                    .frameLocator('iframe[title="Iframe for security code"]')
                                    .getByRole('textbox', { name: 'CVV' }),

        // ── Section 3: Card form fields (in outer payment iframe) ─────────────
        txtCardHolderName:      this.page.frameLocator('iframe[title="checkout-payment-iframe"]')
                                    .getByPlaceholder('Name on card'),

        chkSaveCard:            this.page.frameLocator('iframe[title="checkout-payment-iframe"]')
                                    .getByTestId('card-form-checkbox'),

        // Pay button for guest (new card) flow
        btnPayGuest:            this.page.frameLocator('iframe[title="checkout-payment-iframe"]')
                                    .getByTestId('pay'),

        // ── Section 4: Logged-in user (saved card) ────────────────────────────
        lnkSavedVisaCard:       this.page.frameLocator('iframe[title="checkout-payment-iframe"]')
                                    .getByTestId('payment-card-item-ctob'),

        // Pay button for logged-in (saved card) flow
        btnPayLoggedIn:         this.page.frameLocator('iframe[title="checkout-payment-iframe"]')
                                    .getByRole('button', { name: 'Pay' }),
    };

    constructor(page: Page) {
        super(page);
    }

    // ── Verification methods ──────────────────────────────────────────────────

    async verifyPaymentGatewayLoaded(): Promise<void> {
        await test.step('Verify payment gateway is loaded', async () => {
            await expect(this.paymentPageLocators.btnAddNewCard).toBeVisible();
        });
    }

    // ── Action methods ────────────────────────────────────────────────────────

    async fillCardDetailsAndPay(cardDetails: CreditCardDetails): Promise<void> {
        await test.step('Fill card details and pay (guest)', async () => {
            await this.verifyPaymentGatewayLoaded();
            await this.paymentPageLocators.btnAddNewCard.click();

            // Secure iframe fields — must use pressSequentially, not fill()
            await this.paymentPageLocators.txtCardNumber.pressSequentially(cardDetails.number, { delay: typingDelay });
            await this.paymentPageLocators.txtCardExpiry.pressSequentially(cardDetails.expiry, { delay: typingDelay });
            await this.paymentPageLocators.txtCardCVC.pressSequentially(cardDetails.cvc, { delay: typingDelay });

            await this.paymentPageLocators.txtCardHolderName.fill(cardDetails.name);

            // Save card checkbox — label intercepts pointer events, force is required
            const saveCard = this.paymentPageLocators.chkSaveCard;
            if (await saveCard.isVisible()) {
                await saveCard.check({ force: true });
            }

            await this.paymentPageLocators.btnPayGuest.click();
        });
    }

    async performPaymentWithCardForLoggedInUsers(): Promise<void> {
        await test.step('Perform payment with saved card (logged-in)', async () => {
            await this.paymentPageLocators.lnkSavedVisaCard.waitFor({ state: 'visible' });
            await this.paymentPageLocators.lnkSavedVisaCard.click();
            await this.paymentPageLocators.btnPayLoggedIn.waitFor({ state: 'visible', timeout: actionTimeout });

            // Scroll the Pay button into view inside the iframe's own document
            const paymentFrame = this.page.frames().find(f => f.url().includes('pre.pay.vodafone.com'));
            if (paymentFrame) {
                await paymentFrame.evaluate(() => {
                    const btn = Array.from(document.querySelectorAll('button'))
                        .find(b => b.textContent?.trim() === 'Pay');
                    btn?.scrollIntoView({ behavior: 'instant', block: 'center' });
                });
            }

            await this.page.locator('iframe[title="checkout-payment-iframe"]').scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(shortDelay);
            await this.paymentPageLocators.btnPayLoggedIn.click();
        });
    }
}
