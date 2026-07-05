import { Page, test } from '@playwright/test';
import { BasePage } from './BasePage';
import { GuestInfo, BillingAddressInfo, NonExistingUser } from './index';
import { navigationTimeout, actionTimeout } from '../playwright.config';

export class CheckoutPage extends BasePage {

    private readonly checkoutPageLocators = {

        // ── Section 1: Page header / auth state ──────────────────────────────
        lnkLogin:                   this.page.getByRole('link', { name: 'Log in' }),
        imgAvatarLoggedIn:          this.page.getByAltText('avatar'),

        // ── Section 2: Personal information form ─────────────────────────────
        txtFirstName:               this.page.getByRole('textbox', { name: 'John', exact: true }),
        txtLastName:                this.page.getByRole('textbox', { name: 'Wick' }),
        txtEmail:                   this.page.getByRole('textbox', { name: 'john.wich@gmail.com' }),

        // ── Section 3: Billing address form ──────────────────────────────────
        selBillingCountry:          this.page.getByRole('combobox'),
        selBillingState:            this.page.locator('#state'),
        txtBillingCity:             this.page.getByRole('textbox', { name: 'Johannesburg' }),
        txtBillingAddressLine1:     this.page.getByRole('textbox', { name: 'The Paddocks' }),
        txtBillingAddressLine2:     this.page.getByRole('textbox', { name: 'Canary Road' }),
        txtBillingZipCode:          this.page.getByRole('textbox', { name: '02340' }),

        // ── Section 4: Consent checkboxes ────────────────────────────────────
        // Label wraps hyperlinks so clicking it navigates away — check via evaluate only
        chkAgreementConsent:        this.page.locator('input[value="consolidated"]'),
        chkPersonalizedOffers:      this.page.locator('input[value="offers"]'),

        // ── Section 5: CTA ────────────────────────────────────────────────────
        btnContinueToPayment:       this.page.getByRole('button', { name: 'Continue to payment' }),

        // ── Section 6: Order summary sidebar ─────────────────────────────────
        // Matches any Travel Together Plan regardless of GB/days
        txtOrderSummaryPlanName:    this.page.getByText(/Travel Together Plan/i).first(),
        txtOrderSummarySubtotal:    this.page.getByText('Subtotal'),
        txtOrderSummaryTotal:       this.page.getByText('Total').last(),

        // ── Section 7: Logged-in user billing update ──────────────────────────
        lnkUpdateBillingDetails:    this.page.getByRole('link', { name: 'Update billing details' }),
    };

    constructor(page: Page) {
        super(page);
    }

    // ── Action methods ────────────────────────────────────────────────────────

    async fillPersonalDetailsForNonExistingUser(info: NonExistingUser): Promise<void> {
        await test.step('Fill personal details for non-existing user', async () => {
            await this.checkoutPageLocators.txtFirstName.fill(info.firstName);
            await this.checkoutPageLocators.txtLastName.fill(info.lastName);
            await this.checkoutPageLocators.txtEmail.fill(info.email);
        });
    }

    async fillPersonalDetailsForExistingUser(info: GuestInfo): Promise<void> {
        await test.step('Fill personal details for existing user', async () => {
            await this.checkoutPageLocators.txtFirstName.fill(info.firstName);
            await this.checkoutPageLocators.txtLastName.fill(info.lastName);
            await this.checkoutPageLocators.txtEmail.fill(info.email);
        });
    }

    async fillBillingAddressDetailsForUserAndProceedToPayment(info: BillingAddressInfo): Promise<void> {
        await test.step('Fill billing address and proceed to payment', async () => {
            await this.checkoutPageLocators.selBillingCountry.click();
            await this.page.getByText(new RegExp(`^${info.country}$`, 'i')).click();
            await this.page.waitForLoadState('domcontentloaded');

            if (info.city) {
                await this.checkoutPageLocators.txtBillingCity.click();
                await this.checkoutPageLocators.txtBillingCity.fill(info.city);
            }

            const stateField = this.checkoutPageLocators.selBillingState;
            if (await stateField.isVisible()) {
                await stateField.click();
                await this.page.getByText(new RegExp(`^${info.state}$`, 'i')).click();
            }

            if (info.addressLine1) {
                await this.checkoutPageLocators.txtBillingAddressLine1.click();
                await this.checkoutPageLocators.txtBillingAddressLine1.fill(info.addressLine1);
            }

            if (info.addressLine2) {
                await this.checkoutPageLocators.txtBillingAddressLine2.click();
                await this.checkoutPageLocators.txtBillingAddressLine2.fill(info.addressLine2);
            }

            if (info.zipCode) {
                await this.checkoutPageLocators.txtBillingZipCode.click();
                await this.checkoutPageLocators.txtBillingZipCode.fill(info.zipCode);
            }

            await this.checkConsent();
            await this.checkoutPageLocators.btnContinueToPayment.click();
        });
    }

    async proceedToPaymentAsLoggedInUser(): Promise<void> {
        await test.step('Proceed to payment as logged-in user', async () => {
            const baseUrl = (process.env.BASE_URL ?? '').replace(/\/$/, '');
            await this.page.waitForURL(url => url.toString().startsWith(baseUrl), { timeout: navigationTimeout, waitUntil: 'commit' });
            await this.page.waitForLoadState('domcontentloaded');
            await this.checkConsent();
            await this.checkoutPageLocators.btnContinueToPayment.waitFor({ state: 'visible', timeout: actionTimeout });
            await this.checkoutPageLocators.btnContinueToPayment.click();
        });
    }

    async guestCheckoutLoginWithExistingAccount(): Promise<void> {
        await test.step('Click Log in link at top of checkout page', async () => {
            await this.checkoutPageLocators.lnkLogin.click();
        });
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private async checkConsent(): Promise<void> {
        // The label wraps hyperlinks — clicking it navigates away.
        // Directly setting .checked via evaluate is the only safe approach.
        // Wait for the checkbox to exist in the DOM before evaluating —
        // logged-in users land here mid-hydration so it may not be present yet.
        await this.checkoutPageLocators.chkAgreementConsent.waitFor({ state: 'attached', timeout: actionTimeout });
        await this.page.evaluate(() => {
            const checkbox = document.querySelector('input[value="consolidated"]') as HTMLInputElement;
            if (checkbox && !checkbox.checked) {
                checkbox.checked = true;
                checkbox.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }
}
