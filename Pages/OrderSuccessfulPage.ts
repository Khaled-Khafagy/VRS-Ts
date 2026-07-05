import { test, Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { waitForEmail } from '../utils/gmailHelper';
import { emailTestTimeout } from '../playwright.config';

export class OrderSuccessfulPage extends BasePage {

    private readonly orderSuccessfulPageLocators = {

        // ── Section 1: Shared heading (all flows) ─────────────────────────────
        hdgThankYouForYourOrder:        this.page.getByRole('heading', { name: /Thank you for your order!/i }),

        // ── Section 2: Travel Together Plan confirmation message ──────────────
        // Confirmed from DOM: "Your Travel together Plan confirmation and eSIM have been sent to <email>"
        txtTravelTogetherPlanConfirmationMsg:    this.page.getByText(/Your Travel together Plan confirmation and eSIM have been sent to/i),
        txtContactSupportWithOrderNum:  this.page.getByText(/Need help\? Contact support with your order number/i),

        // ── Section 3: Regular eSIM order success (non-Travel-Together-Plan) ─
        hdgEsimSentMessage:             this.page.getByRole('heading', { name: 'Your eSIM is sent by the following address:', exact: false }),
        txtEsimSentMessage:             this.page.getByText(/Your eSIM is sent by the following address:/, { exact: false }),
        hdgContactSupport:              this.page.getByRole('heading', { name: 'Need help? Contact support with your order number', exact: false }),
        txtContactSupport:              this.page.getByText(/Need help\? Contact support with your order number/, { exact: false }),

        // ── Section 4: Guest user password creation prompt ────────────────────
        // Confirmed from recording — only shown for new guest users
        hdgCompleteRegistration:        this.page.getByTestId('complete-registration-title'),
        btnCompleteRegistration:        this.page.getByTestId('complete-registration-cta'),

        // Legacy locators kept for backward compatibility with existing tests
        btnCreatePassword:              this.page.getByRole('button', { name: 'Create Password' }),
        txtSetYourPassword:             this.page.getByText('Set your Password'),

        // ── Section 5: Travel Together Plan 3-step setup guide ───────────────
        // data-testid values confirmed from DevTools inspection
        divStep01:                      this.page.getByTestId('order-confirmation-next-steps-step-0'),
        divStep02:                      this.page.getByTestId('order-confirmation-next-steps-step-1'),
        // "Setup Travel together plan" — confirmed as <a> link with this testid
        lnkSetupTravelTogetherPlan:     this.page.getByTestId('order-confirmation-next-steps-step-1-cta-0'),
        divStep03:                      this.page.getByTestId('order-confirmation-next-steps-step-2'),
        txtStep03InviteMembers:         this.page.getByText(/Invite your group members/i),
    };

    constructor(page: Page) {
        super(page);
    }

    // ── Verification methods ──────────────────────────────────────────────────

    async verifyOrderSuccessfulPageDisplayedForGuestUsers(): Promise<void> {
        await test.step('Verify order success page for guest user (regular eSIM)', async () => {
            await expect(this.orderSuccessfulPageLocators.hdgThankYouForYourOrder).toBeVisible();
            await expect(this.orderSuccessfulPageLocators.txtEsimSentMessage).toBeVisible();
            await expect(this.orderSuccessfulPageLocators.txtContactSupport).toBeVisible();
            await expect(this.orderSuccessfulPageLocators.txtSetYourPassword).toBeVisible();
        });
    }

    async verifyOrderSuccessfulPageDisplayedForLoggedinUsers(): Promise<void> {
        await test.step('Verify order success page for logged-in user (regular eSIM)', async () => {
            await expect(this.orderSuccessfulPageLocators.hdgThankYouForYourOrder).toBeVisible();
            await expect(this.orderSuccessfulPageLocators.hdgEsimSentMessage).toBeVisible();
            await expect(this.orderSuccessfulPageLocators.hdgContactSupport).toBeVisible();
        });
    }

    async verifyTravelTogetherPlanOrderSuccessForGuestUser(): Promise<void> {
        await test.step('Verify Travel Together Plan order success page for guest user', async () => {
            await expect(this.orderSuccessfulPageLocators.hdgThankYouForYourOrder).toBeVisible();
            await expect(this.orderSuccessfulPageLocators.txtTravelTogetherPlanConfirmationMsg).toBeVisible();
            await expect(this.orderSuccessfulPageLocators.txtContactSupportWithOrderNum).toBeVisible();
            await expect(this.orderSuccessfulPageLocators.hdgCompleteRegistration).toBeVisible();
            await expect(this.orderSuccessfulPageLocators.btnCompleteRegistration).toBeVisible();
        });
    }

    async verifyTravelTogetherPlanOrderSuccessForLoggedInUser(): Promise<void> {
        await test.step('Verify Travel Together Plan order success page for logged-in user', async () => {
            await expect(this.orderSuccessfulPageLocators.hdgThankYouForYourOrder).toBeVisible();
            await expect(this.orderSuccessfulPageLocators.txtTravelTogetherPlanConfirmationMsg).toBeVisible();
            await expect(this.orderSuccessfulPageLocators.txtContactSupportWithOrderNum).toBeVisible();
            await expect(this.orderSuccessfulPageLocators.lnkSetupTravelTogetherPlan).toBeVisible();
        });
    }

    async verifyTravelTogetherPlanSetupGuideVisible(): Promise<void> {
        await test.step('Verify Travel Together Plan 3-step setup guide is visible', async () => {
            await expect(this.orderSuccessfulPageLocators.divStep01).toBeVisible();
            await expect(this.orderSuccessfulPageLocators.divStep02).toBeVisible();
            await expect(this.orderSuccessfulPageLocators.lnkSetupTravelTogetherPlan).toBeVisible();
            await expect(this.orderSuccessfulPageLocators.divStep03).toBeVisible();
            await expect(this.orderSuccessfulPageLocators.txtStep03InviteMembers).toBeVisible();
        });
    }

    // ── Email verification methods ────────────────────────────────────────────

    async verifyQRCodeEmailReceived(email: string, sentAt: number): Promise<void> {
        await test.step('Verify eSIM QR Code email is received', async () => {
            const received = await waitForEmail({
                to: email,
                subject: /Your eSIM is ready to install/i,
                timeout: emailTestTimeout,
                afterTimestamp: sentAt,
            });
            expect(received.subject).toMatch(/Your eSIM is ready to install/i);
            expect(received.body).toContain('What happens next');
        });
    }

    async verifyReceiptEmailReceived(email: string, sentAt: number): Promise<void> {
        await test.step('Verify Receipt and Agreement email is received', async () => {
            const received = await waitForEmail({
                to: email,
                subject: /Vodafone Travel - Receipt and Agreement/i,
                timeout: emailTestTimeout,
                afterTimestamp: sentAt,
            });
            expect(received.subject).toMatch(/Vodafone Travel - Receipt and Agreement/i);
            expect(received.body).toContain('thanks for your purchase');
        });
    }

    async verifyReceiptEmailMatchesOrderSummary(
        email: string,
        sentAt: number,
        pricing: { subtotal: string; discount: string; total: string },
    ): Promise<void> {
        await test.step('Verify receipt email pricing matches cart order summary', async () => {
            const received = await waitForEmail({
                to: email,
                subject: /Vodafone Travel - Receipt and Agreement/i,
                timeout: emailTestTimeout,
                afterTimestamp: sentAt,
            });
            expect(received.subject).toMatch(/Vodafone Travel - Receipt and Agreement/i);
            expect(received.body).toContain('thanks for your purchase');

            const extractNumeric = (s: string) => s.replace(/[^\d.]/g, '');
            expect(received.body).toContain(extractNumeric(pricing.subtotal));
            expect(received.body).toContain(extractNumeric(pricing.discount));
            expect(received.body).toContain(extractNumeric(pricing.total));
        });
    }

    async verifyWelcomeEmailReceived(email: string, sentAt: number): Promise<void> {
        await test.step('Verify Welcome email is received', async () => {
            const received = await waitForEmail({
                to: email,
                subject: /welcome/i,
                timeout: emailTestTimeout,
                afterTimestamp: sentAt,
            });
            expect(received.subject).toMatch(/welcome/i);
            expect(received.body).toContain('Thank you for making an account with Vodafone Travel');
        });
    }

    async verifyRefundEmailReceived(email: string, sentAt: number): Promise<void> {
        await test.step('Verify Refund Completion email is received', async () => {
            const received = await waitForEmail({
                to: email,
                subject: /Vodafone Travel - Refund Completion/i,
                timeout: emailTestTimeout,
                afterTimestamp: sentAt,
            });
            expect(received.subject).toMatch(/Vodafone Travel - Refund Completion/i);
            expect(received.body).toContain('here is your refund details!');
        });
    }
}
