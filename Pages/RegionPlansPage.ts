import { expect, Page, test } from "@playwright/test";
import { BasePage } from "./BasePage";

export class RegionPlansPage extends BasePage {
    protected readonly pageName = 'RegionPlansPage';
    protected readonly sourceFilePath = __filename;

    private readonly regionPlansPageLocators = {

        // ── Section 1: Destination page ──────────────────────────────────────
        // Dynamic — takes a parameter, not wrapped with heal
        hdgPageTitle:               (name: string) => this.page.locator(`h1:has-text("${name}")`),

        // Travel Together Plan promotional banner (left panel of destination page)
        hdgTravelTogetherPlanAvailable:      this.page.getByRole('heading', { name: 'Share the trip. Share the data.' }),
        txtTravelTogetherPlanBannerSubtitle: this.page.getByText('The Vodafone Travel Together Plan keeps everyone connected on one shared data pool.'),
        txtConnectUpTo5Devices:     this.page.getByText('Connect up to 5 devices without buying individual plans'),
        // "Find out more" is a link (not a button) that navigates to the standalone /travel-together
        // landing page — there is no longer an in-page "Global plan details" modal.
        lnkFindOutMore:             this.page.getByRole('link', { name: 'Find out more' }),

        // Regular plan "Add to cart" (non-Travel-Together-Plan). Matched by CSS-module class instead of
        // button text/name, since this needs to keep working when the page is rendered in a non-English
        // locale (the "Add to cart" label itself gets translated, but this class name doesn't).
        // Excludes the Travel Together card (#group-plan-first-card), which is spotlighted inside the
        // plans grid and on some destinations (e.g. Asia) is the first card in DOM order.
        btnFirstAddToCart:          this.page.locator('xpath=//button[contains(@class, "button_button_appearance_secondary")][not(ancestor::*[@id="group-plan-first-card"])]').first(),
        // Same pattern, 2nd/3rd plan cards in the grid — needed to add several plans to the cart at
        // once (e.g. T3596: identify the cheapest of several plans and confirm the discount lands on it).
        btnSecondAddToCart:         this.page.locator('xpath=//button[contains(@class, "button_button_appearance_secondary")][not(ancestor::*[@id="group-plan-first-card"])]').nth(1),
        btnThirdAddToCart:          this.page.locator('xpath=//button[contains(@class, "button_button_appearance_secondary")][not(ancestor::*[@id="group-plan-first-card"])]').nth(2),
        // Scoped to the floating cart summary popover, and the only primary button in it — needed
        // because the header's "Log in" button shares the same `button_button_appearance_primary` class.
        // `.filter({ visible: true })` because the page renders a hidden (mobile-layout) duplicate of
        // this popover before the visible desktop one in DOM order.
        btnGoToCheckout:            this.page.locator('div[class*="cartContainer_cartContainer"] button[class*="button_button_appearance_primary"]').filter({ visible: true }).first(),

        // ── Section 2: Travel Together Plan card ─────────────────────────────
        // Spotlighted directly in the plans grid (anchored by id set by the app) — no modal/filter
        // step needed to reach it.
        cardTravelTogetherPlanFirst:                 this.page.locator('#group-plan-first-card'),
        badgeTravelTogetherPlanFirstCard:            this.page.locator('#group-plan-first-card').getByText('Travel Together Plan'),
        txtTravelTogetherPlanFirstCardConnect5:      this.page.locator('#group-plan-first-card').getByText('Connect up to 5 devices'),
        btnTravelTogetherPlanFirstCardAddToCart:     this.page.locator('#group-plan-first-card').getByRole('button', { name: 'Add to cart' }),
    };

    constructor(page: Page) {
        super(page);
    }

    // ── Verification methods ─────────────────────────────────────────────────

    async verifyDestinationPageLoaded(regionOrCountry: string): Promise<void> {
        await test.step(`Verify ${regionOrCountry} destination page is loaded`, async () => {
            await expect(this.regionPlansPageLocators.hdgPageTitle(regionOrCountry)).toBeVisible();
        });
    }

    async verifyTravelTogetherPlanBannerVisible(): Promise<void> {
        await test.step('Verify Travel Together Plan banner is visible on destination page', async () => {
            const hdg = await this.heal('hdgTravelTogetherPlanAvailable', this.regionPlansPageLocators.hdgTravelTogetherPlanAvailable);
            await hdg.scrollIntoViewIfNeeded();
            await expect(hdg).toBeVisible();
            await expect(await this.heal('txtTravelTogetherPlanBannerSubtitle', this.regionPlansPageLocators.txtTravelTogetherPlanBannerSubtitle)).toBeVisible();
            await expect(await this.heal('lnkFindOutMore', this.regionPlansPageLocators.lnkFindOutMore)).toBeVisible();
            await expect(await this.heal('txtConnectUpTo5Devices', this.regionPlansPageLocators.txtConnectUpTo5Devices)).toBeVisible();
        });
    }

    async verifyTravelTogetherPlanCardVisible(): Promise<void> {
        await test.step('Verify first Travel Together Plan card is visible', async () => {
            await expect(await this.heal('badgeTravelTogetherPlanFirstCard', this.regionPlansPageLocators.badgeTravelTogetherPlanFirstCard)).toBeVisible();
            await expect(await this.heal('txtTravelTogetherPlanFirstCardConnect5', this.regionPlansPageLocators.txtTravelTogetherPlanFirstCardConnect5)).toBeVisible();
            await expect(await this.heal('btnTravelTogetherPlanFirstCardAddToCart', this.regionPlansPageLocators.btnTravelTogetherPlanFirstCardAddToCart)).toBeVisible();
        });
    }

    // ── Action methods ────────────────────────────────────────────────────────

    async selectTravelTogetherPlan(regionOrCountry: string): Promise<void> {
        await test.step(`Select Travel Together Plan in ${regionOrCountry} and go to checkout`, async () => {
            await expect(this.regionPlansPageLocators.hdgPageTitle(regionOrCountry)).toBeVisible();
            const card = await this.heal('cardTravelTogetherPlanFirst', this.regionPlansPageLocators.cardTravelTogetherPlanFirst);
            await card.scrollIntoViewIfNeeded();
            await (await this.heal('btnTravelTogetherPlanFirstCardAddToCart', this.regionPlansPageLocators.btnTravelTogetherPlanFirstCardAddToCart)).click();
            const btnGoToCheckout = await this.heal('btnGoToCheckout', this.regionPlansPageLocators.btnGoToCheckout);
            await btnGoToCheckout.waitFor({ state: 'visible' });
            await btnGoToCheckout.click();
        });
    }

    // ── Legacy methods (used by non-Travel-Together-Plan tests) ──────────────

    async addToCart(regionOrCountry: string): Promise<void> {
        await test.step(`Add first plan in ${regionOrCountry} to cart`, async () => {
            // URL-based instead of the `hdgPageTitle` text match — the heading itself gets translated
            // on non-English locales, but the URL path segment doesn't.
            await expect(this.page).toHaveURL(/\/our-destinations\//);
            const btn = await this.heal('btnFirstAddToCart', this.regionPlansPageLocators.btnFirstAddToCart);
            await btn.waitFor({ state: 'visible' });
            await btn.click();
            await (await this.heal('btnGoToCheckout', this.regionPlansPageLocators.btnGoToCheckout)).waitFor({ state: 'visible' });
        });
    }

    async selectFirstPlan(regionOrCountry: string): Promise<void> {
        await test.step(`Select first plan in ${regionOrCountry} and go to checkout`, async () => {
            await expect(this.page).toHaveURL(/\/our-destinations\//);
            const btn = await this.heal('btnFirstAddToCart', this.regionPlansPageLocators.btnFirstAddToCart);
            await btn.waitFor({ state: 'visible' });
            await btn.click();
            const btnGoToCheckout = await this.heal('btnGoToCheckout', this.regionPlansPageLocators.btnGoToCheckout);
            await btnGoToCheckout.waitFor({ state: 'visible' });
            await btnGoToCheckout.click();
        });
    }

    async addSecondPlanToCart(regionOrCountry: string): Promise<void> {
        await test.step(`Add second plan in ${regionOrCountry} to cart`, async () => {
            await expect(this.page).toHaveURL(/\/our-destinations\//);
            const btn = await this.heal('btnSecondAddToCart', this.regionPlansPageLocators.btnSecondAddToCart);
            await btn.waitFor({ state: 'visible' });
            await btn.click();
            await (await this.heal('btnGoToCheckout', this.regionPlansPageLocators.btnGoToCheckout)).waitFor({ state: 'visible' });
        });
    }

    async selectSecondPlan(regionOrCountry: string): Promise<void> {
        await test.step(`Select second plan in ${regionOrCountry} and go to checkout`, async () => {
            await expect(this.page).toHaveURL(/\/our-destinations\//);
            const btn = await this.heal('btnSecondAddToCart', this.regionPlansPageLocators.btnSecondAddToCart);
            await btn.waitFor({ state: 'visible' });
            await btn.click();
            const btnGoToCheckout = await this.heal('btnGoToCheckout', this.regionPlansPageLocators.btnGoToCheckout);
            await btnGoToCheckout.waitFor({ state: 'visible' });
            await btnGoToCheckout.click();
        });
    }

    async addThirdPlanToCart(regionOrCountry: string): Promise<void> {
        await test.step(`Add third plan in ${regionOrCountry} to cart`, async () => {
            await expect(this.page).toHaveURL(/\/our-destinations\//);
            const btn = await this.heal('btnThirdAddToCart', this.regionPlansPageLocators.btnThirdAddToCart);
            await btn.waitFor({ state: 'visible' });
            await btn.click();
            await (await this.heal('btnGoToCheckout', this.regionPlansPageLocators.btnGoToCheckout)).waitFor({ state: 'visible' });
        });
    }

    async selectThirdPlan(regionOrCountry: string): Promise<void> {
        await test.step(`Select third plan in ${regionOrCountry} and go to checkout`, async () => {
            await expect(this.page).toHaveURL(/\/our-destinations\//);
            const btn = await this.heal('btnThirdAddToCart', this.regionPlansPageLocators.btnThirdAddToCart);
            await btn.waitFor({ state: 'visible' });
            await btn.click();
            const btnGoToCheckout = await this.heal('btnGoToCheckout', this.regionPlansPageLocators.btnGoToCheckout);
            await btnGoToCheckout.waitFor({ state: 'visible' });
            await btnGoToCheckout.click();
        });
    }
}
