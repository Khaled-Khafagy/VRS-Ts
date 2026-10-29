import { expect, Page, test } from '@playwright/test';
import { BasePage } from './BasePage';
import { GuestInfo, BillingAddressInfo, NonExistingUser } from './index';
import { navigationTimeout, actionTimeout } from '../playwright.config';

export class CheckoutPage extends BasePage {
    protected readonly pageName = 'CheckoutPage';
    protected readonly sourceFilePath = __filename;

    private readonly checkoutPageLocators = {

        // ── Section 1: Page header / auth state ──────────────────────────────
        lnkLogin:                   this.page.getByRole('link', { name: 'Log in' }),
        imgAvatarLoggedIn:          this.page.getByAltText('avatar'),

        // ── Section 2: Personal information form ─────────────────────────────
        // By field `id` instead of placeholder text, since the placeholders ("John", "Wick", ...) are
        // translated on non-English locales but the underlying form field ids are not.
        txtFirstName:               this.page.locator('#firstName'),
        txtLastName:                this.page.locator('#lastName'),
        txtEmail:                   this.page.locator('#email'),

        // ── Section 3: Billing address form ──────────────────────────────────
        // Country/state option labels stay in English on every locale (billing data is compliance-driven,
        // not translated), so name-based matching for those stays safe — only the field ids below needed
        // to change off placeholder text.
        selBillingCountry:          this.page.getByRole('combobox'),
        selBillingState:            this.page.locator('#state'),
        txtBillingCity:             this.page.locator('#city'),
        txtBillingAddressLine1:     this.page.locator('#address1'),
        txtBillingAddressLine2:     this.page.locator('#address2'),
        txtBillingZipCode:          this.page.locator('#zip'),

        // ── Section 4: Consent checkboxes ────────────────────────────────────
        // Label wraps hyperlinks so clicking it navigates away — check via evaluate only.
        // NOT wrapped with heal: used exclusively via page.evaluate(), heal requires a real Playwright
        // Locator interaction and won't be called on this element.
        chkAgreementConsent:        this.page.locator('input[value="consolidated"]'),
        chkPersonalizedOffers:      this.page.locator('input[value="offers"]'),

        // ── Section 5: CTA ────────────────────────────────────────────────────
        // Real id, not the `.last()`-of-class heuristic — see CartPage.btnContinueToCheckout for why
        // that's flaky. There's also a `checkout_payment_btn_mobile` duplicate; this targets the
        // desktop one specifically (exact id, no substring match) since tests run at desktop viewport.
        btnContinueToPayment:       this.page.locator('#checkout_payment_btn'),

        // ── Section 6: Order summary sidebar ─────────────────────────────────
        // Matches any Travel Together Plan regardless of GB/days
        txtOrderSummaryPlanName:    this.page.getByText(/Travel Together Plan/i).first(),
        txtOrderSummarySubtotal:    this.page.getByText('Subtotal'),
        txtOrderSummaryTotal:       this.page.getByText('Total').last(),

        // ── Section 7: Logged-in user billing update ──────────────────────────
        lnkUpdateBillingDetails:    this.page.getByRole('link', { name: 'Update billing details' }),
        // Shown instead of lnkUpdateBillingDetails when a logged-in user has no billing address on file
        // yet (e.g. a just-registered account) — Continue to payment stays disabled until this is clicked.
        btnSaveBillingDetails:      this.page.getByRole('button', { name: 'Save billing details' }),
    };

    constructor(page: Page) {
        super(page);
    }

    // ── Action methods ────────────────────────────────────────────────────────

    async fillPersonalDetailsForNonExistingUser(info: NonExistingUser): Promise<void> {
        await test.step('Fill personal details for non-existing user', async () => {
            await (await this.heal('txtFirstName', this.checkoutPageLocators.txtFirstName)).fill(info.firstName);
            await (await this.heal('txtLastName', this.checkoutPageLocators.txtLastName)).fill(info.lastName);
            await (await this.heal('txtEmail', this.checkoutPageLocators.txtEmail)).fill(info.email);
        });
    }

    async fillPersonalDetailsForExistingUser(info: GuestInfo): Promise<void> {
        await test.step('Fill personal details for existing user', async () => {
            await (await this.heal('txtFirstName', this.checkoutPageLocators.txtFirstName)).fill(info.firstName);
            await (await this.heal('txtLastName', this.checkoutPageLocators.txtLastName)).fill(info.lastName);
            await (await this.heal('txtEmail', this.checkoutPageLocators.txtEmail)).fill(info.email);
        });
    }

    async fillBillingAddressDetailsForUserAndProceedToPayment(info: BillingAddressInfo): Promise<void> {
        await test.step('Fill billing address and proceed to payment', async () => {
            await (await this.heal('selBillingCountry', this.checkoutPageLocators.selBillingCountry)).click();
            await this.page.getByText(new RegExp(`^${info.country}$`, 'i')).click();
            await this.page.waitForLoadState('networkidle');
            await this.page.waitForTimeout(500);

            if (info.city) {
                const city = await this.heal('txtBillingCity', this.checkoutPageLocators.txtBillingCity);
                await city.click();
                await city.pressSequentially(info.city, { delay: 50 });
                await this.page.waitForTimeout(200);
            }

            const stateField = await this.heal('selBillingState', this.checkoutPageLocators.selBillingState);
            if (await stateField.isVisible()) {
                await stateField.click();
                await this.page.getByText(new RegExp(`^${info.state}$`, 'i')).click();
                await this.page.waitForLoadState('domcontentloaded');
                await this.page.waitForTimeout(300);
            }

            if (info.addressLine1) {
                const addr1 = await this.heal('txtBillingAddressLine1', this.checkoutPageLocators.txtBillingAddressLine1);
                await addr1.click();
                await addr1.pressSequentially(info.addressLine1, { delay: 50 });
                await this.page.waitForTimeout(200);
            }

            if (info.addressLine2) {
                const addr2 = await this.heal('txtBillingAddressLine2', this.checkoutPageLocators.txtBillingAddressLine2);
                await addr2.click();
                await addr2.pressSequentially(info.addressLine2, { delay: 50 });
                await this.page.waitForTimeout(200);
            }

            if (info.zipCode) {
                const zip = await this.heal('txtBillingZipCode', this.checkoutPageLocators.txtBillingZipCode);
                await zip.click();
                await zip.pressSequentially(info.zipCode, { delay: 50 });
                await this.page.waitForTimeout(200);
            }

            // Logged-in users with no billing address on file yet (e.g. just registered) must save the
            // form first — Continue to payment stays disabled until then. Guests and logged-in users who
            // already have billing saved don't show this button, so it's skipped for them.
            const btnSave = await this.heal('btnSaveBillingDetails', this.checkoutPageLocators.btnSaveBillingDetails);
            if (await btnSave.isVisible().catch(() => false)) {
                await btnSave.click();
                await expect(btnSave).toBeHidden({ timeout: actionTimeout });
            }

            await this.checkConsent();
            const btnContinue = await this.heal('btnContinueToPayment', this.checkoutPageLocators.btnContinueToPayment);
            await expect(btnContinue).toBeEnabled({ timeout: actionTimeout });
            await btnContinue.click();
        });
    }

    async proceedToPaymentAsLoggedInUser(): Promise<void> {
        await test.step('Proceed to payment as logged-in user', async () => {
            const baseUrl = (process.env.BASE_URL ?? '').replace(/\/$/, '');
            await this.page.waitForURL(url => url.toString().startsWith(baseUrl), { timeout: navigationTimeout, waitUntil: 'commit' });
            await this.page.waitForLoadState('domcontentloaded');
            await this.checkConsent();
            const btnContinue = await this.heal('btnContinueToPayment', this.checkoutPageLocators.btnContinueToPayment);
            await btnContinue.waitFor({ state: 'visible', timeout: actionTimeout });
            await btnContinue.click();
        });
    }

    async guestCheckoutLoginWithExistingAccount(): Promise<void> {
        await test.step('Click Log in link at top of checkout page', async () => {
            await (await this.heal('lnkLogin', this.checkoutPageLocators.lnkLogin)).click();
        });
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private async checkConsent(): Promise<void> {
        // The label wraps hyperlinks — clicking it navigates away.
        // Directly setting .checked via evaluate is the only safe approach.
        // Wait for the checkbox to exist in the DOM before evaluating —
        // logged-in users land here mid-hydration so it may not be present yet.
        // Native .click() toggles exactly once and fires the events React listens to (setting
        // .checked first and then dispatching a synthetic click toggled it straight back off).
        // Retried until it sticks: if hydration re-renders the form, the box comes back unchecked.
        // chkAgreementConsent is intentionally NOT wrapped with heal — it is used only via
        // page.evaluate() which requires the raw Playwright Locator, not a healed one.
        await expect(async () => {
            await this.checkoutPageLocators.chkAgreementConsent.waitFor({ state: 'attached', timeout: actionTimeout });
            await this.checkoutPageLocators.chkAgreementConsent.evaluate((checkbox: HTMLInputElement) => {
                if (!checkbox.checked) checkbox.click();
            });
            await expect(this.checkoutPageLocators.chkAgreementConsent).toBeChecked({ timeout: 2000 });
        }).toPass({ timeout: actionTimeout });
    }
}
