import {expect, test, Page} from '@playwright/test';
import {BasePage} from './BasePage';


export class TravelTogetherPlanPage extends BasePage  {

    static readonly TABLET_VIEWPORT = { width: 768, height: 1024 };
    static readonly MOBILE_VIEWPORT = { width: 390, height: 844 };

private readonly Locators = {

    // ── Hero section ──────────────────────────────────────────────────────
    hdgHeroTitle:               this.page.getByRole('heading', { level: 1, name: /One plan for the whole trip/i }),
    hdgHeroDescription:         this.page.getByText(/Buy one Travel Together plan/i),
    btnFindPlanCta:             this.page.getByRole('button', { name: 'Find a Travel Together plan' }),
    btnHowItWorksCta:           this.page.getByRole('button', { name: 'How It Works' }),

    // ── "Pick where you're going" search section ─────────────────────────────
    hdgSearchSectionTitle:      this.page.getByRole('heading', { name: "Pick where you're going" }),
    txtSearchSectionSubtitle:   this.page.getByText('Each plan comes with data only esim, 5G ready'),
    inpSearchDestination:       this.page.getByPlaceholder('Where are you travelling?'),
    btnSearchSubmit:            this.page.getByRole('button', { name: 'Find a plan' }),
    // Typeahead suggestion list item, keyed by destination slug (e.g. "europe")
    btnSearchSuggestion:        (destinationSlug: string) => this.page.locator(`[data-testid="travel-together-search-suggestion-${destinationSlug}"]`),

    // Inline search result panel shown after picking a suggestion (no page navigation occurs)
    cardSearchResult:               this.page.locator('[data-testid="travel-together-result-card"]'),
    hdgSearchResultTitle:           this.page.locator('[data-testid="travel-together-result-title"]'),
    btnSearchResultAddToCart:       this.page.locator('[data-testid="travel-together-result-card"]').getByRole('button', { name: 'Add to cart' }),
    btnSearchResultViewIndividual:  this.page.locator('[data-testid="travel-together-result-card"]').getByRole('button', { name: 'View Individual plans' }),

    // ── Featured plans carousel ──────────────────────────────────────────────
    carouselFeaturedPlans:      this.page.getByRole('region', { name: 'Featured Travel Together plans' }),
    btnCarouselPrev:            this.page.getByRole('button', { name: 'Previous featured plans' }),
    btnCarouselNext:            this.page.getByRole('button', { name: 'Next featured plans' }),

    // Plan cards — each keyed by the country heading; "Add to cart" is scoped to that
    // card's <article> since the button text is identical ("Add to cart") across cards.
    cardPlanByCountry: (countryHeadingName: string | RegExp) =>
        this.page.locator('article').filter({ has: this.page.getByRole('heading', { name: countryHeadingName }) }),
    hdgPlanCardCountry: (countryHeadingName: string | RegExp) =>
        this.page.getByRole('heading', { name: countryHeadingName }),
    btnPlanCardAddToCart: (countryHeadingName: string | RegExp) =>
        this.page.locator('article')
            .filter({ has: this.page.getByRole('heading', { name: countryHeadingName }) })
            .getByRole('button', { name: 'Add to cart' }),
    btnGoToCheckout:            this.page.locator('div[class*="cartContainer_cartContainer"] button[class*="button_button_appearance_primary"]').filter({ visible: true }).first(),

    // ── "How travel together works" section ──────────────────────────────────
    hdgHowItWorksTitle:         this.page.getByRole('heading', { name: 'How travel together works' }),
    txtHowItWorksSubtitle:      this.page.getByText('Share data, invite travellers, connect devices and manage everything from a single place.'),
    hdgStepBuySharedPlan:       this.page.getByRole('heading', { name: 'Buy a shared plan' }),
    txtStepBuySharedPlanDesc:   this.page.locator('#how-it-works').getByText('Choose a plan and share data with up to 5 travellers.'),
    hdgStepInviteTravelers:     this.page.getByRole('heading', { name: 'Invite travellers', exact: true }),
    txtStepInviteTravelersDesc: this.page.getByText('Invite travellers via email or link to connect everyone quickly.'),
    hdgStepManageGroup:         this.page.getByRole('heading', { name: 'Manage your travel group' }),
    txtStepManageGroupDesc:     this.page.getByText('Monitor usage, manage members, and top up data as needed.'),

    // ── "Why choose travel together" feature cards ───────────────────────────
    hdgWhyChooseTitle:          this.page.getByRole('heading', { name: 'Why choose travel together' }),
    hdgFeatureOnePlanSharedData:   this.page.getByRole('heading', { name: 'One plan, shared data' }),
    txtFeatureOnePlanSharedData:   this.page.locator('#why-choose-travel-together').getByText('Choose a plan and share data with up to 5 travellers.'),
    hdgFeatureInviteAnytime:       this.page.getByRole('heading', { name: 'Invite anytime' }),
    txtFeatureInviteAnytime:       this.page.getByText('Add members before or during your trip'),
    hdgFeatureEasyTopUp:           this.page.getByRole('heading', { name: 'Top up easily' }),
    txtFeatureEasyTopUp:           this.page.getByText('Need more data? Add extra allowance and keep the entire group connected.'),
    hdgFeatureStayInControl:       this.page.getByRole('heading', { name: 'Stay in control' }),
    txtFeatureStayInControl:       this.page.getByText('Track usage and manage your group'),

    // ── FAQ section ───────────────────────────────────────────────────────────
    hdgFaqTitle:                this.page.getByRole('heading', { name: 'Frequently Asked Questions' }),
    // Category filters (rendered as labels wrapping visually-hidden radio inputs)
    filterFaqCategory:          (categoryName: string) => this.page.getByText(categoryName, { exact: true }),
    // FAQ accordion items, keyed by the visible question text
    btnFaqQuestion:             (questionText: string | RegExp) => this.page.getByRole('button', { name: questionText }),
    // Accordion item container (question + answer), scoped so the answer paragraph can be read per-question
    faqItemByQuestion:          (questionText: string | RegExp) =>
        this.page.locator('[data-testid^="travel-together-faq-content-item-"]')
            .filter({ has: this.page.getByRole('button', { name: questionText }) }),

};




    constructor(page: Page) {
        super(page);
}

    // ── Navigation ────────────────────────────────────────────────────────────

    async gotoTravelTogetherPage(url: string): Promise<void> {
        await test.step('Navigate to Travel Together landing page', async () => {
            await this.navigateToUrl(url);
        });
    }

    // ── Content verification ────────────────────────────────────────────────

    async verifyHeroSectionVisible(): Promise<void> {
        await test.step('Verify hero section content is visible', async () => {
            await expect(this.Locators.hdgHeroTitle).toBeVisible();
            await expect(this.Locators.hdgHeroDescription).toBeVisible();
            await expect(this.Locators.btnFindPlanCta).toBeVisible();
            await expect(this.Locators.btnHowItWorksCta).toBeVisible();
        });
    }

    async verifySearchSectionVisible(): Promise<void> {
        await test.step('Verify search section content is visible', async () => {
            await expect(this.Locators.hdgSearchSectionTitle).toBeVisible();
            await expect(this.Locators.txtSearchSectionSubtitle).toBeVisible();
            await expect(this.Locators.inpSearchDestination).toBeVisible();
            await expect(this.Locators.btnSearchSubmit).toBeVisible();
        });
    }

    async verifyCarouselPlanCardsVisible(countryHeadingNames: string[]): Promise<void> {
        await test.step('Verify featured plans carousel cards are visible', async () => {
            await expect(this.Locators.carouselFeaturedPlans).toBeVisible();
            for (const countryHeadingName of countryHeadingNames) {
                await this.scrollCarouselUntilCardVisible(countryHeadingName);
                await expect(this.Locators.hdgPlanCardCountry(countryHeadingName)).toBeVisible();
                await expect(this.Locators.btnPlanCardAddToCart(countryHeadingName)).toBeVisible();
            }
        });
    }

    private async scrollCarouselUntilCardVisible(countryHeadingName: string, maxClicks = 8): Promise<void> {
        for (let i = 0; i < maxClicks; i++) {
            const isVisible = await this.Locators.hdgPlanCardCountry(countryHeadingName)
                .waitFor({ state: 'visible', timeout: 2000 })
                .then(() => true)
                .catch(() => false);
            if (isVisible) return;
            if (await this.Locators.btnCarouselNext.isDisabled().catch(() => true)) return;
            await this.Locators.btnCarouselNext.click();
        }
    }

    async verifyHowItWorksSectionVisible(): Promise<void> {
        await test.step('Verify "How travel together works" section content is visible', async () => {
            await expect(this.Locators.hdgHowItWorksTitle).toBeVisible();
            await expect(this.Locators.txtHowItWorksSubtitle).toBeVisible();
            await expect(this.Locators.hdgStepBuySharedPlan).toBeVisible();
            await expect(this.Locators.txtStepBuySharedPlanDesc).toBeVisible();
            await expect(this.Locators.hdgStepInviteTravelers).toBeVisible();
            await expect(this.Locators.txtStepInviteTravelersDesc).toBeVisible();
            await expect(this.Locators.hdgStepManageGroup).toBeVisible();
            await expect(this.Locators.txtStepManageGroupDesc).toBeVisible();
        });
    }

    async verifyWhyChooseSectionVisible(): Promise<void> {
        await test.step('Verify "Why choose travel together" feature cards are visible', async () => {
            await expect(this.Locators.hdgWhyChooseTitle).toBeVisible();
            await expect(this.Locators.hdgFeatureOnePlanSharedData).toBeVisible();
            await expect(this.Locators.txtFeatureOnePlanSharedData).toBeVisible();
            await expect(this.Locators.hdgFeatureInviteAnytime).toBeVisible();
            await expect(this.Locators.txtFeatureInviteAnytime).toBeVisible();
            await expect(this.Locators.hdgFeatureEasyTopUp).toBeVisible();
            await expect(this.Locators.txtFeatureEasyTopUp).toBeVisible();
            await expect(this.Locators.hdgFeatureStayInControl).toBeVisible();
            await expect(this.Locators.txtFeatureStayInControl).toBeVisible();
        });
    }

    async verifyFaqSectionDefaultStateVisible(): Promise<void> {
        await test.step('Verify FAQ section renders with "Overview" category and its questions', async () => {
            await expect(this.Locators.hdgFaqTitle).toBeVisible();
            await expect(this.Locators.filterFaqCategory('Overview')).toBeVisible();
            await expect(this.Locators.filterFaqCategory('Group')).toBeVisible();
            await expect(this.Locators.filterFaqCategory('Usage')).toBeVisible();
            await expect(this.Locators.filterFaqCategory('Terms')).toBeVisible();
            await expect(this.Locators.btnFaqQuestion('What is Travel Together?')).toBeVisible();
        });
    }

    // ── Search-to-plan flow ─────────────────────────────────────────────────

    async searchForDestination(destinationName: string): Promise<void> {
        await test.step(`Search for destination: ${destinationName}`, async () => {
            await this.Locators.inpSearchDestination.click();
            await this.Locators.inpSearchDestination.fill(destinationName);
        });
    }

    async selectSearchSuggestion(destinationSlug: string): Promise<void> {
        await test.step(`Select search suggestion: ${destinationSlug}`, async () => {
            await this.Locators.btnSearchSuggestion(destinationSlug).click();
        });
    }

    async verifyFindPlanButtonEnabled(): Promise<void> {
        await test.step('Verify "Find a plan" button is enabled', async () => {
            await expect(this.Locators.btnSearchSubmit).toBeEnabled();
        });
    }

    async verifyFindPlanButtonDisabled(): Promise<void> {
        await test.step('Verify "Find a plan" button is disabled', async () => {
            await expect(this.Locators.btnSearchSubmit).toBeDisabled();
        });
    }

    async verifySearchResultCardVisible(planHeadingName: string | RegExp): Promise<void> {
        await test.step(`Verify inline search result card is visible for: ${planHeadingName}`, async () => {
            await expect(this.Locators.cardSearchResult).toBeVisible();
            await expect(this.Locators.hdgSearchResultTitle).toHaveText(planHeadingName);
            await expect(this.Locators.btnSearchResultAddToCart).toBeVisible();
            await expect(this.Locators.btnSearchResultViewIndividual).toBeVisible();
        });
    }

    // ── Carousel / add-to-cart ──────────────────────────────────────────────

    async addPlanToCartFromCarousel(countryHeadingName: string | RegExp): Promise<void> {
        await test.step(`Add "${countryHeadingName}" plan to cart from carousel`, async () => {
            const card = this.Locators.cardPlanByCountry(countryHeadingName);
            await card.scrollIntoViewIfNeeded();
            await this.Locators.btnPlanCardAddToCart(countryHeadingName).click();
            await this.Locators.btnGoToCheckout.waitFor({ state: 'visible' });
            await this.Locators.btnGoToCheckout.click();
        });
    }

    async clickCarouselNext(): Promise<void> {
        await test.step('Click carousel Next button', async () => {
            await this.Locators.btnCarouselNext.click();
        });
    }

    async clickCarouselPrevious(): Promise<void> {
        await test.step('Click carousel Previous button', async () => {
            await this.Locators.btnCarouselPrev.click();
        });
    }

    async clickCarouselNextUntilEnd(maxClicks = 10): Promise<void> {
        await test.step('Click carousel Next button until it is disabled', async () => {
            for (let i = 0; i < maxClicks; i++) {
                if (await this.Locators.btnCarouselNext.isDisabled().catch(() => true)) return;
                await this.Locators.btnCarouselNext.click();
            }
        });
    }

    async clickCarouselPreviousUntilStart(maxClicks = 10): Promise<void> {
        await test.step('Click carousel Previous button until it is disabled', async () => {
            for (let i = 0; i < maxClicks; i++) {
                if (await this.Locators.btnCarouselPrev.isDisabled().catch(() => true)) return;
                await this.Locators.btnCarouselPrev.click();
            }
        });
    }

    async verifyCarouselPrevButtonDisabled(): Promise<void> {
        await test.step('Verify carousel Previous button is disabled', async () => {
            await expect(this.Locators.btnCarouselPrev).toBeDisabled();
        });
    }

    async verifyCarouselNextButtonDisabled(): Promise<void> {
        await test.step('Verify carousel Next button is disabled', async () => {
            await expect(this.Locators.btnCarouselNext).toBeDisabled();
        });
    }

    async verifyCarouselPrevButtonEnabled(): Promise<void> {
        await test.step('Verify carousel Previous button is enabled', async () => {
            await expect(this.Locators.btnCarouselPrev).toBeEnabled();
        });
    }

    async verifyCarouselNextButtonEnabled(): Promise<void> {
        await test.step('Verify carousel Next button is enabled', async () => {
            await expect(this.Locators.btnCarouselNext).toBeEnabled();
        });
    }

    // ── FAQ accordion interaction ────────────────────────────────────────────

    async expandFaqQuestion(questionText: string | RegExp): Promise<void> {
        await test.step(`Expand FAQ question: ${questionText}`, async () => {
            await this.Locators.btnFaqQuestion(questionText).click();
        });
    }

    async collapseFaqQuestion(questionText: string | RegExp): Promise<void> {
        await test.step(`Collapse FAQ question: ${questionText}`, async () => {
            await this.Locators.btnFaqQuestion(questionText).click();
        });
    }

    async verifyFaqQuestionExpanded(questionText: string | RegExp, answerText: string): Promise<void> {
        await test.step(`Verify FAQ question is expanded: ${questionText}`, async () => {
            await expect(this.Locators.btnFaqQuestion(questionText)).toHaveAttribute('aria-expanded', 'true');
            await expect(this.Locators.faqItemByQuestion(questionText).getByText(answerText)).toBeVisible();
        });
    }

    async verifyFaqQuestionCollapsed(questionText: string | RegExp): Promise<void> {
        await test.step(`Verify FAQ question is collapsed: ${questionText}`, async () => {
            await expect(this.Locators.btnFaqQuestion(questionText)).toHaveAttribute('aria-expanded', 'false');
        });
    }

    async selectFaqCategory(categoryName: string): Promise<void> {
        await test.step(`Select FAQ category filter: ${categoryName}`, async () => {
            await this.Locators.filterFaqCategory(categoryName).click();
        });
    }

    async verifyFaqCategorySelected(categoryName: string): Promise<void> {
        await test.step(`Verify FAQ category filter is selected: ${categoryName}`, async () => {
            await expect(this.Locators.filterFaqCategory(categoryName)).toHaveAttribute('data-selected', 'true');
        });
    }

    async verifyFaqQuestionVisible(questionText: string | RegExp): Promise<void> {
        await test.step(`Verify FAQ question is visible: ${questionText}`, async () => {
            await expect(this.Locators.btnFaqQuestion(questionText)).toBeVisible();
        });
    }

    // ── Hero "How It Works" CTA ─────────────────────────────────────────────

    async clickHowItWorksCta(): Promise<void> {
        await test.step('Click hero "How It Works" CTA', async () => {
            await this.Locators.btnHowItWorksCta.click();
        });
    }

    async verifyHowItWorksSectionScrolledIntoView(): Promise<void> {
        await test.step('Verify page scrolled to "How travel together works" section', async () => {
            await expect(this.Locators.hdgHowItWorksTitle).toBeInViewport();
        });
    }

    // ── Non-functional checks ───────────────────────────────────────────────

    async verifyNoConsoleErrors(errors: string[]): Promise<void> {
        await test.step('Verify no unhandled console errors were logged', async () => {
            expect(errors, `Unexpected console errors: ${errors.join('; ')}`).toHaveLength(0);
        });
    }

    async verifyAllContentImagesHaveAltText(): Promise<void> {
        await test.step('Verify all content images have non-empty alt text', async () => {
            const images = this.page.locator('main img');
            const count = await images.count();
            for (let i = 0; i < count; i++) {
                const alt = await images.nth(i).getAttribute('alt');
                expect(alt, `Image at index ${i} is missing alt text`).toBeTruthy();
            }
        });
    }

    async verifyNoHorizontalOverflow(): Promise<void> {
        await test.step('Verify page has no horizontal overflow at current viewport', async () => {
            const { scrollWidth, clientWidth } = await this.page.evaluate(() => ({
                scrollWidth: document.documentElement.scrollWidth,
                clientWidth: document.documentElement.clientWidth,
            }));
            expect(scrollWidth, 'Page content overflows horizontally').toBeLessThanOrEqual(clientWidth + 1);
        });
    }

};
