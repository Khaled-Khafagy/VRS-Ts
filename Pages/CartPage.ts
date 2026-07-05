import { expect, Page, test } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CartPage extends BasePage {

    private readonly cartPageLocators = {

        // ── Section 1: Cart header ────────────────────────────────────────────
        hdgItemsInCart:                 this.page.getByRole('heading', { name: /Items in cart/i }),

        // ── Section 2: Plan item row ──────────────────────────────────────────
        // Matches any Travel Together Plan regardless of GB/days (e.g. 50 GB, 100 GB, 40 GB)
        txtTravelTogetherPlanItem:      this.page.getByText(/Travel Together Plan/i).first(),

        // Quantity controls on the plan row
        btnDecreaseQty:                 this.page.getByRole('button', { name: '-' }),
        btnIncreaseQty:                 this.page.getByRole('button', { name: '+' }),

        // ── Section 3: "What's Included" expandable section ───────────────────
        btnWhatsIncluded:               this.page.getByRole('button', { name: "What's Included" }),

        // Feature bullets revealed after expanding (text includes the "- " prefix)
        txtFeatureShare5Devices:        this.page.getByText(/Share across up to 5 devices per Travel Together plan/i),
        txtFeatureSharedDataPool:       this.page.getByText(/Shared data pool for the group/i),
        txtFeatureInviteMembers:        this.page.getByText(/Invite members to your plan/i),
        txtFeatureTrackUsage:           this.page.getByText(/Track usage and top up when needed/i),

        // ── Section 4: Order summary ──────────────────────────────────────────
        txtSubtotalLabel:               this.page.getByText(/Subtotal/i),
        txtDiscountRow:                 this.page.getByText(/discount|savings/i).first(),
        txtTotalLabel:                  this.page.getByText(/^Total$/i),

        // ── Section 5: Promotional code ───────────────────────────────────────
        // Placeholder confirmed from screenshot: "Enter promo code"
        txtPromoCodeInput:              this.page.getByPlaceholder('Enter promo code'),
        btnApplyPromoCode:              this.page.getByRole('button', { name: /Apply code/i }),
        txtPromoCodeError:              this.page.getByText(/invalid.*code|code.*invalid|not valid/i),
        txtPromoCodeSuccess:            this.page.getByText(/code applied|promo applied/i),

        // ── Section 6: Primary CTA ────────────────────────────────────────────
        btnContinueToCheckout:          this.page.getByRole('button', { name: 'Continue to checkout' }),

        // ── Section 7: Pricing value cells (sibling of each label) ───────────
        // XPath: find the element immediately following the label in the same row
        txtSubtotalValue:               this.page.locator('xpath=//p[normalize-space(.)="Subtotal"]/following-sibling::p[1]'),
        txtDiscountValue:               this.page.locator('xpath=//*[contains(normalize-space(.),"Discount") or contains(normalize-space(.),"discount")]/following-sibling::*[1]').first(),
        txtTotalValue:                  this.page.locator('xpath=//p[normalize-space(.)="Total"]/following-sibling::p[1]'),
    };

    constructor(page: Page) {
        super(page);
    }

    // ── Verification methods ──────────────────────────────────────────────────

    async verifyCartLoaded(): Promise<void> {
        await test.step('Verify cart page is loaded with Travel Together Plan item', async () => {
            await expect(this.cartPageLocators.hdgItemsInCart).toBeVisible();
            await expect(this.cartPageLocators.txtTravelTogetherPlanItem).toBeVisible();
            await expect(this.cartPageLocators.btnContinueToCheckout).toBeVisible();
        });
    }

    async expandAndVerifyWhatsIncluded(): Promise<void> {
        await test.step("Expand and verify What's Included section", async () => {
            await this.cartPageLocators.btnWhatsIncluded.click();
            await expect(this.cartPageLocators.txtFeatureShare5Devices).toBeVisible();
            await expect(this.cartPageLocators.txtFeatureSharedDataPool).toBeVisible();
            await expect(this.cartPageLocators.txtFeatureInviteMembers).toBeVisible();
            await expect(this.cartPageLocators.txtFeatureTrackUsage).toBeVisible();
        });
    }

    async verifyOrderSummaryVisible(): Promise<void> {
        await test.step('Verify order summary section is visible', async () => {
            await expect(this.cartPageLocators.txtSubtotalLabel).toBeVisible();
            await expect(this.cartPageLocators.txtTotalLabel).toBeVisible();
        });
    }

    // ── Action methods ────────────────────────────────────────────────────────

    async captureOrderSummary(): Promise<{ subtotal: string; discount: string; total: string }> {
        return await test.step('Capture order summary pricing values from cart', async () => {
            await this.cartPageLocators.txtDiscountValue.waitFor({ state: 'visible' });
            const subtotal = (await this.cartPageLocators.txtSubtotalValue.textContent())?.trim() ?? '';
            const discount = (await this.cartPageLocators.txtDiscountValue.textContent())?.trim() ?? '';
            const total    = (await this.cartPageLocators.txtTotalValue.textContent())?.trim() ?? '';
            return { subtotal, discount, total };
        });
    }

    async applyPromoCode(code: string): Promise<void> {
        await test.step(`Apply promotional code: ${code}`, async () => {
            await this.cartPageLocators.txtPromoCodeInput.fill(code);
            await this.cartPageLocators.btnApplyPromoCode.click();
        });
    }

    async proceedToCheckoutFromCart(): Promise<void> {
        await test.step('Proceed to Checkout from Cart Page', async () => {
            await this.cartPageLocators.btnContinueToCheckout.click();
        });
    }
}
