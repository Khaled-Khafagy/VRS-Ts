import { expect, Page, test } from "@playwright/test";
import { BasePage } from "./BasePage";
import { shortDelay, navigationTimeout } from '../playwright.config';

// "€12,99" / "-€1.95" / "$10.00" → 12.99 / 1.95 / 10 (sign dropped — discounts are compared as magnitudes)
const parsePrice = (text: string): number => parseFloat(text.replace(/[^\d.,]/g, '').replace(',', '.'));

export class CartPage extends BasePage {
    protected readonly pageName = 'CartPage';
    protected readonly sourceFilePath = __filename;

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
        // An accepted code renders as a removable chip holding just the code text (e.g. "NEWTRAVELLERS15 ✕"),
        // not any "code applied" message — confirmed against the live cart, no such text exists.
        chipAppliedPromoCode:           (code: string) => this.page.getByText(code, { exact: true }),

        // ── Section 6: Primary CTA ────────────────────────────────────────────
        // Real, non-hashed id (not translated) instead of button name, so this survives translation.
        // A class+`.last()` heuristic was tried first but is flaky: this button renders after the cart's
        // pricing API call resolves, and if it hasn't rendered yet when the locator is queried, `.last()`
        // resolves to the header's "Log in" button instead (same primary-appearance class) and clicks
        // that — no waiting for a second match to appear, since the one match it has is already
        // actionable. The id doesn't exist until the real button renders, so waiting on it is correct.
        btnContinueToCheckout:          this.page.locator('#go_to_checkout_btn'),

        // ── Section 8: Cart cleanup ────────────────────────────────────────────
        // Cart is tied to the logged-in session server-side, so it can carry residual items
        // between tests. One "Remove {plan name} from cart" button per line item.
        btnRemoveItem:                  this.page.getByRole('button', { name: /^Remove .* from cart$/i }),

        // ── Section 7: Pricing value cells (sibling of each label) ───────────
        // XPath: find the element immediately following the label in the same row
        txtSubtotalValue:               this.page.locator('xpath=//p[normalize-space(.)="Subtotal"]/following-sibling::p[1]'),
        // The order summary's discount row is a <p>Promo code {CODE}</p> label with a sibling
        // <p>-$x.xx</p> value — same leaf-<p>-pair shape as the Subtotal/Total rows above (confirmed on
        // live cart). `starts-with` (not `contains`) is required: "Invalid promo code" also contains the
        // substring "promo code", and a looser `contains` match on an ancestor wrongly matched that error
        // text even when no code was applied. "Discount" is kept as an alternate label for other promo
        // mechanisms (e.g. the Travel Together Plan promo), which may not reuse this exact wording.
        txtDiscountValue:               this.page.locator('xpath=//p[starts-with(normalize-space(.),"Discount") or starts-with(normalize-space(.),"Promo code")]/following-sibling::p[1]').first(),
        txtTotalValue:                  this.page.locator('xpath=//p[normalize-space(.)="Total"]/following-sibling::p[1]'),
    };

    constructor(page: Page) {
        super(page);
    }

    // ── Verification methods ──────────────────────────────────────────────────

    async verifyCartLoaded(): Promise<void> {
        await test.step('Verify cart page is loaded with Travel Together Plan item', async () => {
            await expect(await this.heal('hdgItemsInCart', this.cartPageLocators.hdgItemsInCart)).toBeVisible();
            await expect(await this.heal('txtTravelTogetherPlanItem', this.cartPageLocators.txtTravelTogetherPlanItem)).toBeVisible();
            await expect(await this.heal('btnContinueToCheckout', this.cartPageLocators.btnContinueToCheckout)).toBeVisible();
        });
    }

    async expandAndVerifyWhatsIncluded(): Promise<void> {
        await test.step("Expand and verify What's Included section", async () => {
            await (await this.heal('btnWhatsIncluded', this.cartPageLocators.btnWhatsIncluded)).click();
            await expect(await this.heal('txtFeatureShare5Devices', this.cartPageLocators.txtFeatureShare5Devices)).toBeVisible();
            await expect(await this.heal('txtFeatureSharedDataPool', this.cartPageLocators.txtFeatureSharedDataPool)).toBeVisible();
            await expect(await this.heal('txtFeatureInviteMembers', this.cartPageLocators.txtFeatureInviteMembers)).toBeVisible();
            await expect(await this.heal('txtFeatureTrackUsage', this.cartPageLocators.txtFeatureTrackUsage)).toBeVisible();
        });
    }

    async verifyOrderSummaryVisible(): Promise<void> {
        await test.step('Verify order summary section is visible', async () => {
            await expect(await this.heal('txtSubtotalLabel', this.cartPageLocators.txtSubtotalLabel)).toBeVisible();
            await expect(await this.heal('txtTotalLabel', this.cartPageLocators.txtTotalLabel)).toBeVisible();
        });
    }

    async verifyPromoCodeAccepted(code: string): Promise<void> {
        await test.step(`Verify promotional code "${code}" is accepted`, async () => {
            await expect(this.cartPageLocators.chipAppliedPromoCode(code)).toBeVisible();
            await expect(await this.heal('txtPromoCodeError', this.cartPageLocators.txtPromoCodeError)).toBeHidden();
            await expect(await this.heal('txtDiscountValue', this.cartPageLocators.txtDiscountValue)).toBeVisible();
        });
    }

    async verifyPromoCodeRejected(): Promise<void> {
        await test.step('Verify promotional code is rejected', async () => {
            await expect(await this.heal('txtPromoCodeError', this.cartPageLocators.txtPromoCodeError)).toBeVisible();
        });
    }

    async verifyNoDiscountApplied(): Promise<void> {
        await test.step('Verify no discount is applied to the order summary', async () => {
            await expect(await this.heal('txtTotalValue', this.cartPageLocators.txtTotalValue)).toBeVisible();
            await expect(await this.heal('txtDiscountValue', this.cartPageLocators.txtDiscountValue)).toBeHidden();
            const subtotal = (await (await this.heal('txtSubtotalValue', this.cartPageLocators.txtSubtotalValue)).textContent())?.trim() ?? '';
            const total    = (await (await this.heal('txtTotalValue', this.cartPageLocators.txtTotalValue)).textContent())?.trim() ?? '';
            expect(parsePrice(total)).toBeCloseTo(parsePrice(subtotal), 2);
        });
    }

    async verifyDiscountPercentageApplied(percent: number): Promise<void> {
        await test.step(`Verify ${percent}% discount is applied and total = subtotal - discount`, async () => {
            const { subtotal, discount, total } = await this.captureOrderSummary();
            const subtotalValue = parsePrice(subtotal);
            const discountValue = parsePrice(discount);
            // Rounding of the discount is done server-side (per line or on the subtotal), so allow 1 cent of drift.
            expect(Math.abs(discountValue - subtotalValue * percent / 100)).toBeLessThanOrEqual(0.01);
            expect(parsePrice(total)).toBeCloseTo(subtotalValue - discountValue, 2);
        });
    }

    /**
     * Verifies the discount was computed against the single cheapest line item in the cart, not the
     * whole subtotal — distinct from `verifyDiscountPercentageApplied`, which only checks the discount
     * against the aggregate subtotal and can't tell "X% off everything" apart from "X% off just the
     * cheapest item" when the cart holds several differently-priced plans (e.g. T3596: a new-customer
     * voucher applies 15% to the cheapest of several plans in the cart).
     */
    async verifyDiscountAppliedToCheapestLineItem(percent: number): Promise<void> {
        await test.step(`Verify ${percent}% discount is computed against the cheapest cart line item`, async () => {
            const prices = await this.getLineItemPrices();
            expect(prices.length).toBeGreaterThan(0);
            const cheapest = Math.min(...prices);
            const { discount, subtotal, total } = await this.captureOrderSummary();
            const discountValue = parsePrice(discount);
            const subtotalValue = parsePrice(subtotal);
            // Same 1-cent server-side rounding allowance as verifyDiscountPercentageApplied.
            expect(Math.abs(discountValue - cheapest * percent / 100)).toBeLessThanOrEqual(0.01);
            expect(parsePrice(total)).toBeCloseTo(subtotalValue - discountValue, 2);
        });
    }

    // ── Action methods ────────────────────────────────────────────────────────

    async captureOrderSummary(): Promise<{ subtotal: string; discount: string; total: string }> {
        return await test.step('Capture order summary pricing values from cart', async () => {
            await (await this.heal('txtDiscountValue', this.cartPageLocators.txtDiscountValue)).waitFor({ state: 'visible' });
            const subtotal = (await (await this.heal('txtSubtotalValue', this.cartPageLocators.txtSubtotalValue)).textContent())?.trim() ?? '';
            const discount = (await (await this.heal('txtDiscountValue', this.cartPageLocators.txtDiscountValue)).textContent())?.trim() ?? '';
            const total    = (await (await this.heal('txtTotalValue', this.cartPageLocators.txtTotalValue)).textContent())?.trim() ?? '';
            return { subtotal, discount, total };
        });
    }

    /**
     * Reads the currently-charged price of each cart line item (the strikethrough original price, if
     * a plan already carries its own standing markdown, is ignored — only the price actually counted
     * into the subtotal is returned).
     *
     * Identified structurally, not by hashed classnames: each line item's price lives in a <div> whose
     * only children are a <p> (current price) and, optionally, a <del> (struck-through original price),
     * with no other text in that div — confirmed against a live 3-item cart. This shape is distinct from
     * the Subtotal/Total/Promo code rows, which mix their label text into the same node as the price.
     */
    async getLineItemPrices(): Promise<number[]> {
        return test.step("Read each cart line item's currently-charged price", async () => {
            return this.page.evaluate(() => {
                const isPriceOnlyContainer = (el: Element): boolean => {
                    if (el.children.length < 1 || el.children.length > 2) return false;
                    if (!Array.from(el.children).every(c => c.tagName === 'P' || c.tagName === 'DEL')) return false;
                    const text = (el.textContent || '').replace(/\s+/g, '');
                    return /^(\$[\d.,]+){1,2}$/.test(text);
                };
                const containers = Array.from(document.querySelectorAll('div')).filter(isPriceOnlyContainer);
                return containers
                    .map(c => c.querySelector('p')?.textContent?.trim() ?? '')
                    .map(text => parseFloat(text.replace(/[^\d.]/g, '')))
                    .filter(n => !Number.isNaN(n));
            });
        });
    }

    async applyPromoCode(code: string): Promise<void> {
        await test.step(`Apply promotional code: ${code}`, async () => {
            await (await this.heal('txtPromoCodeInput', this.cartPageLocators.txtPromoCodeInput)).fill(code);
            await (await this.heal('btnApplyPromoCode', this.cartPageLocators.btnApplyPromoCode)).click();
        });
    }

    async verifyRedirectedBackToCart(): Promise<void> {
        await test.step('Verify user is redirected back to the cart after sign up', async () => {
            await this.page.waitForURL(/\/checkout\/cart/, { timeout: navigationTimeout });
            await expect(await this.heal('hdgItemsInCart', this.cartPageLocators.hdgItemsInCart)).toBeVisible();
        });
    }

    async proceedToCheckoutFromCart(): Promise<void> {
        await test.step('Proceed to Checkout from Cart Page', async () => {
            await (await this.heal('btnContinueToCheckout', this.cartPageLocators.btnContinueToCheckout)).click();
        });
    }

    async clearCartIfNotEmpty(cartUrl: string): Promise<void> {
        await test.step('Clear cart if not empty', async () => {
            await this.navigateToUrl(cartUrl);
            const btnRemoveItem = await this.heal('btnRemoveItem', this.cartPageLocators.btnRemoveItem);
            while (await btnRemoveItem.count() > 0) {
                await btnRemoveItem.first().click();
                await this.page.waitForTimeout(shortDelay);
            }
        });
    }
}
