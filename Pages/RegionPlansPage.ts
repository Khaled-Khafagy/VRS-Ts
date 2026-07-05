import { expect, Page, test } from "@playwright/test";
import { BasePage } from "./BasePage";

export class RegionPlansPage extends BasePage {

    private readonly regionPlansPageLocators = {

        // ── Section 1: Destination page ──────────────────────────────────────
        hdgPageTitle:               (name: string) => this.page.locator(`h1:has-text("${name}")`),

        // Travel Together Plan promotional banner
        hdgTravelTogetherPlanAvailable:      this.page.getByRole('heading', { name: 'Travel Together Plan available' }),
        txtTravelTogetherPlanBannerSubtitle: this.page.getByText('Share one data pool across up to 5 devices. One plan, everyone connected.'),

        // Travel Together Plan badge — present on Travel Together Plan cards across all regions
        badgeTravelTogetherPlan:    this.page.getByText(/Travel Together Plan/i).first(),
        txtConnectUpTo5Devices:     this.page.getByText(/Connect up to 5 devices/i).first(),

        // Regular plan "Add to cart" (non-Travel-Together-Plan)
        btnFirstAddToCart:          this.page.locator('button').filter({ hasText: 'Add to cart' }).first(),
        btnGoToCheckout:            this.page.getByRole('button', { name: 'Go to checkout' }),

        // ── Section 2: "Global plan details" modal ───────────────────────────
        // Triggered by clicking the "Find out more" button inside the banner
        btnFindOutMore:             this.page.getByRole('button', { name: 'Find out more' }),

        hdgGlobalPlanDetailsModal:  this.page.getByRole('heading', { name: 'Global plan details' }),
        hdgTravelingWithFamily:     this.page.getByRole('heading', { name: /Traveling with family or/i }),
        txtModalUseOnePlan:         this.page.getByText(/Use one plan across up to 5/i),
        hdgWhyChooseTravelPlan:     this.page.getByRole('heading', { name: /Why Choose the Travel/i }),

        // Five feature bullets inside the modal
        txtModalShare5Devices:      this.page.getByText('Share across up to 5 devices'),
        txtModalInviteMembers:      this.page.locator('div').filter({ hasText: /^Invite members to your plan$/ }),
        txtModalSharedDataPool:     this.page.getByText('Shared data pool for the group'),
        txtModalTrackUsage:         this.page.getByText(/Track usage and top up when/i),

        // Modal CTA — filters the plan list to show only Travel Together Plans
        btnSeeTravelTogetherPlans:  this.page.getByRole('button', { name: 'See Travel together plans' }),

        // ── Section 3: Travel Together Plan cards ────────────────────────────
        // First Travel Together Plan card (anchored by id set by the app)
        cardTravelTogetherPlanFirst:                 this.page.locator('#group-plan-first-card'),
        badgeTravelTogetherPlanFirstCard:            this.page.locator('#group-plan-first-card').getByText('Travel Together Plan'),
        hdgTravelTogetherPlanFirstCardConnect5:      this.page.locator('#group-plan-first-card').getByRole('heading', { name: 'Connect up to 5 devices' }),
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
            await this.regionPlansPageLocators.hdgTravelTogetherPlanAvailable.scrollIntoViewIfNeeded();
            await expect(this.regionPlansPageLocators.hdgTravelTogetherPlanAvailable).toBeVisible();
            await expect(this.regionPlansPageLocators.txtTravelTogetherPlanBannerSubtitle).toBeVisible();
            await expect(this.regionPlansPageLocators.btnFindOutMore).toBeVisible();
            await expect(this.regionPlansPageLocators.badgeTravelTogetherPlan).toBeVisible();
            await expect(this.regionPlansPageLocators.txtConnectUpTo5Devices).toBeVisible();
        });
    }

    async verifyGlobalPlanDetailsModal(): Promise<void> {
        await test.step('Verify Global plan details modal content', async () => {
            await expect(this.regionPlansPageLocators.hdgGlobalPlanDetailsModal).toBeVisible();
            await expect(this.regionPlansPageLocators.hdgTravelingWithFamily).toBeVisible();
            await expect(this.regionPlansPageLocators.txtModalUseOnePlan).toBeVisible();
            await expect(this.regionPlansPageLocators.txtModalShare5Devices).toBeVisible();
            await expect(this.regionPlansPageLocators.txtModalInviteMembers).toBeVisible();
            await expect(this.regionPlansPageLocators.txtModalSharedDataPool).toBeVisible();
            await expect(this.regionPlansPageLocators.txtModalTrackUsage).toBeVisible();
            await expect(this.regionPlansPageLocators.btnSeeTravelTogetherPlans).toBeVisible();
        });
    }

    async verifyTravelTogetherPlanCardVisible(): Promise<void> {
        await test.step('Verify first Travel Together Plan card is visible', async () => {
            await expect(this.regionPlansPageLocators.badgeTravelTogetherPlanFirstCard).toBeVisible();
            await expect(this.regionPlansPageLocators.hdgTravelTogetherPlanFirstCardConnect5).toBeVisible();
            await expect(this.regionPlansPageLocators.btnTravelTogetherPlanFirstCardAddToCart).toBeVisible();
        });
    }

    // ── Action methods ────────────────────────────────────────────────────────

    async openGlobalPlanDetailsModal(): Promise<void> {
        await test.step('Open Global plan details modal', async () => {
            await this.regionPlansPageLocators.btnFindOutMore.scrollIntoViewIfNeeded();
            await this.regionPlansPageLocators.btnFindOutMore.click();
            await this.regionPlansPageLocators.hdgGlobalPlanDetailsModal.waitFor({ state: 'visible' });
        });
    }

    async proceedFromModalToCart(): Promise<void> {
        await test.step('Proceed from modal to Travel Together Plan cart', async () => {
            await this.regionPlansPageLocators.btnSeeTravelTogetherPlans.click();
            await this.regionPlansPageLocators.btnTravelTogetherPlanFirstCardAddToCart.waitFor({ state: 'visible' });
            await this.regionPlansPageLocators.btnTravelTogetherPlanFirstCardAddToCart.click();
            await this.regionPlansPageLocators.btnGoToCheckout.waitFor({ state: 'visible' });
            await this.regionPlansPageLocators.btnGoToCheckout.click();
        });
    }

    async selectTravelTogetherPlan(regionOrCountry: string): Promise<void> {
        await test.step(`Select Travel Together Plan in ${regionOrCountry} and go to checkout`, async () => {
            await expect(this.regionPlansPageLocators.hdgPageTitle(regionOrCountry)).toBeVisible();
            await this.regionPlansPageLocators.btnFindOutMore.scrollIntoViewIfNeeded();
            await this.regionPlansPageLocators.btnFindOutMore.click();
            await this.regionPlansPageLocators.btnSeeTravelTogetherPlans.waitFor({ state: 'visible' });
            await this.regionPlansPageLocators.btnSeeTravelTogetherPlans.click();
            await this.regionPlansPageLocators.btnTravelTogetherPlanFirstCardAddToCart.waitFor({ state: 'visible' });
            await this.regionPlansPageLocators.btnTravelTogetherPlanFirstCardAddToCart.click();
            await this.regionPlansPageLocators.btnGoToCheckout.waitFor({ state: 'visible' });
            await this.regionPlansPageLocators.btnGoToCheckout.click();
        });
    }

    // ── Legacy methods (used by non-Travel-Together-Plan tests) ──────────────

    async addToCart(regionOrCountry: string): Promise<void> {
        await test.step(`Add first plan in ${regionOrCountry} to cart`, async () => {
            await expect(this.regionPlansPageLocators.hdgPageTitle(regionOrCountry)).toBeVisible();
            await this.regionPlansPageLocators.btnFirstAddToCart.waitFor({ state: 'visible' });
            await this.regionPlansPageLocators.btnFirstAddToCart.click();
            await this.regionPlansPageLocators.btnGoToCheckout.waitFor({ state: 'visible' });
        });
    }

    async selectFirstPlan(regionOrCountry: string): Promise<void> {
        await test.step(`Select first plan in ${regionOrCountry} and go to checkout`, async () => {
            await expect(this.regionPlansPageLocators.hdgPageTitle(regionOrCountry)).toBeVisible();
            await this.regionPlansPageLocators.btnFirstAddToCart.waitFor({ state: 'visible' });
            await this.regionPlansPageLocators.btnFirstAddToCart.click();
            await this.regionPlansPageLocators.btnGoToCheckout.waitFor({ state: 'visible' });
            await this.regionPlansPageLocators.btnGoToCheckout.click();
        });
    }
}
