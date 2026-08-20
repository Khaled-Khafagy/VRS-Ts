import {expect,Page, test } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
private readonly homePageLocators = {
    // Header Navigation
    lnkHomepage: this.page.getByRole('link', { name: 'Homepage' }),
    lnkOurDestinations: this.page.getByRole('link', { name: 'Our Destinations' }),
    lnkUefa: this.page.getByRole('link', { name: 'UEFA Champions League' }),
    lnkAboutEsIM: this.page.getByRole('link', { name: 'About eSIM' }),
    lnkHelp: this.page.getByTestId('TopNavigation:desktop').getByRole('link', { name: 'Help' }),
    btnMenu: this.page.getByRole('button', { name: 'Menu' }),
    imgCart: this.page.getByAltText('Shopping Cart'),
    btnLogin: this.page.getByRole('button').filter({ has: this.page.locator('img') }).last(),
    imgUserProfileLoggedIn: this.page.locator('div.avatar_overlay__bto13x9:visible'),
    
    // Hero Banner
    hdgHeroBanner: this.page.getByRole('heading', { level: 1, name: 'Find the best data plan for your trip' }),
    hdgHeroSubtitle: this.page.getByRole('heading', { level: 5, name: 'Get 15% OFF all Travel eSIM plans' }),

    // Search Section
    inputFindDestination: this.page.getByPlaceholder('Where are you going'),
    btnFindAPlan: this.page.getByRole('button', { name: 'Find a plan' }),

    // Stats bar
    statDestinations: this.page.getByText('Destinations'),
    statSupport: this.page.getByText('support'),
    statActivation: this.page.getByText('activation'),

    // Hero Carousel
    carouselSection: this.page.getByRole('region', { name: 'Image carousel' }),
    btnCarouselPrevious: this.page.getByRole('button', { name: 'Previous slide' }),
    btnCarouselNext: this.page.getByRole('button', { name: 'Next slide' }),
    carouselSlide: (slideNumber: number, totalSlides = 3) =>
      this.page.getByRole('group', { name: `Slide ${slideNumber} of ${totalSlides}` }),
    carouselDots: this.page.getByTestId('pips-container').locator('li'),

    // Region/Country Tabs
    tabRegions: this.page.getByRole('tab', { name: 'Regions' }),
    tabCountries: this.page.getByRole('tab', { name: 'Countries' }),
    
    // Region Cards
    hdgPopularDestinations: this.page.getByRole('heading', { name: 'Popular Destinations' }),
    
    // Explore Buttons for each region
    btnExploreEurope: this.page.locator('a[href="/our-destinations/europe"]'),
    btnExploreNorthAmerica: this.page.locator('a[href="/our-destinations/north-america"]'),
    btnExploreMidEast: this.page.locator('a[href="/our-destinations/middle-east"]'),
    btnExploreAfrica: this.page.locator('a[href="/our-destinations/africa"]'),
    btnExploreAsia: this.page.locator('a[href="/our-destinations/asia"]'),
    btnExploreCaribbean: this.page.locator('a[href="/our-destinations/caribbean"]'),
    btnExploreSouthAmerica: this.page.locator('a[href="/our-destinations/south-america"]'),

    // Country cards (Countries tab)
    btnExploreItaly: this.page.locator('a[href="/our-destinations/italy"]'),
    btnExploreUK: this.page.locator('a[href="/our-destinations/uk"]'),
    btnExploreSouthAfrica: this.page.locator('a[href="/our-destinations/south-africa"]'),
    btnExploreFrance: this.page.locator('a[href="/our-destinations/france"]'),
    btnExploreSpain: this.page.locator('a[href="/our-destinations/spain"]'),
    btnExploreUSA: this.page.locator('a[href="/our-destinations/usa"]'),
    btnExploreEgypt: this.page.locator('a[href="/our-destinations/egypt"]'),
    btnExploreGermany: this.page.locator('a[href="/our-destinations/germany"]'),
    btnExploreGreece: this.page.locator('a[href="/our-destinations/greece"]'),
    
    // Generic region selectors - Using text-based locators
    regionCard: (regionName: string) => this.page.getByRole('heading', { level: 3, name: regionName }),
    regionHeading: (regionName: string) => this.page.getByRole('heading', { level: 3, name: regionName }),
    // `$=` (ends-with) instead of an exact match, so this still matches a locale-prefixed href
    // (e.g. `/ko/our-destinations/europe`) as well as the unprefixed English one. `.first()` because
    // each region card renders two links to the same href (an "Explore" link plus the heading link).
    regionExploreBtn: (regionName: string) => this.page.locator(`a[href$="/our-destinations/${regionName.toLowerCase().replace(/ /g, '-')}"]`).first(),
  };

  constructor(page: Page) {
    super(page);
  }
  async gotoHomepage(URL: string) {
    await test.step('Navigate to Home Page', async () => {
      await this.navigateToUrl(URL);
    });
  }

  async navigateToHomePage(url: string) {
    await this.navigateToUrl(url);
  }

  async assertUserIsLoggedIn() {
    await test.step('Assert User is logged in by checking user profile icon', async () => {
      await expect(this.homePageLocators.imgUserProfileLoggedIn).toBeVisible();
    });
  }

  async navigateToRegionPlansPage(slug: string, tab: 'regions' | 'countries' = 'regions') {
    await test.step(`Navigate to ${slug} plans page`, async () => {
      if (tab === 'countries') {
        await this.switchToCountriesTab();
      }
      const btn = this.homePageLocators.regionExploreBtn(slug);
      await btn.scrollIntoViewIfNeeded();
      await btn.hover();
      await btn.click();
    });
  }

  async navigateToEuropeRegionPlansPage() {
    await this.navigateToRegionPlansPage('europe');
  }

  async navigateToAsiaRegionPlansPage() {
    await this.navigateToRegionPlansPage('asia');
  }

  async navigateToMyAccountTab() {
    await test.step('Navigate to My Account Tab', async () => {
      await this.homePageLocators.imgUserProfileLoggedIn.click();
    });
  }

  // ============ NEW METHODS FOR TABS & EXPLORATION ============

  async switchToCountriesTab() {
    await test.step('Switch to Countries Tab', async () => {
      await this.homePageLocators.tabCountries.scrollIntoViewIfNeeded();
      await this.homePageLocators.tabCountries.hover();
      await this.homePageLocators.tabCountries.click();
      await expect(this.homePageLocators.tabCountries).toHaveAttribute('aria-selected', 'true');
    });
  }

  async switchToRegionsTab() {
    await test.step('Switch to Regions Tab', async () => {
      await this.homePageLocators.tabRegions.scrollIntoViewIfNeeded();
      await this.homePageLocators.tabRegions.hover();
      await this.homePageLocators.tabRegions.click();
      await expect(this.homePageLocators.tabRegions).toHaveAttribute('aria-selected', 'true');
    });
  }

  async verifyRegionsTabIsActive() {
    await test.step('Verify Regions Tab is Active', async () => {
      await expect(this.homePageLocators.tabRegions).toHaveAttribute('aria-selected', 'true');
    });
  }

  async verifyCountriesTabIsActive() {
    await test.step('Verify Countries Tab is Active', async () => {
      await expect(this.homePageLocators.tabCountries).toHaveAttribute('aria-selected', 'true');
    });
  }

  async searchForCountry(countryName: string) {
    await test.step(`Search for country: ${countryName}`, async () => {
      await this.homePageLocators.inputFindDestination.scrollIntoViewIfNeeded();
      await this.homePageLocators.inputFindDestination.hover();
      await this.homePageLocators.inputFindDestination.click();
      await this.homePageLocators.inputFindDestination.fill(countryName);
    });
  }

  async clearSearchInput() {
    await test.step('Clear Search Input', async () => {
      await this.homePageLocators.inputFindDestination.scrollIntoViewIfNeeded();
      await this.homePageLocators.inputFindDestination.hover();
      await this.homePageLocators.inputFindDestination.clear();
    });
  }

  async clickFindAPlanButton() {
    await test.step('Click Find a plan Button', async () => {
      await this.homePageLocators.btnFindAPlan.scrollIntoViewIfNeeded();
      await this.homePageLocators.btnFindAPlan.hover();
      await this.homePageLocators.btnFindAPlan.click();
    });
  }

  async exploreRegion(regionName: string) {
    await test.step(`Explore ${regionName} region`, async () => {
      const exploreBtn = this.homePageLocators.regionExploreBtn(regionName);
      await exploreBtn.scrollIntoViewIfNeeded();
      await exploreBtn.hover();
      await exploreBtn.click();
    });
  }

  async verifyRegionCardVisible(regionName: string) {
    await test.step(`Verify ${regionName} card is visible`, async () => {
      await expect(this.homePageLocators.regionCard(regionName)).toBeVisible();
    });
  }

  async verifyRegionHeadingVisible(regionName: string) {
    await test.step(`Verify ${regionName} heading is visible`, async () => {
      await expect(this.homePageLocators.regionHeading(regionName)).toBeVisible();
    });
  }

  async scrollToPopularDestinations() {
    await test.step('Scroll to Popular Destinations section', async () => {
      await this.homePageLocators.hdgPopularDestinations.scrollIntoViewIfNeeded();
    });
  }

  async verifyHeroBannerVisible() {
    await test.step('Verify Hero Banner is visible', async () => {
      await expect(this.homePageLocators.hdgHeroBanner).toBeVisible();
      await expect(this.homePageLocators.hdgHeroSubtitle).toBeVisible();
    });
  }

  async verifyStatsBarVisible() {
    await test.step('Verify stats bar (Destinations / support / activation) is visible', async () => {
      await expect(this.homePageLocators.statDestinations).toBeVisible();
      await expect(this.homePageLocators.statSupport).toBeVisible();
      await expect(this.homePageLocators.statActivation).toBeVisible();
    });
  }

  async verifyHeaderNavigationLinksVisible() {
    await test.step('Verify header navigation links are visible', async () => {
      await expect(this.homePageLocators.lnkOurDestinations).toBeVisible();
      await expect(this.homePageLocators.lnkAboutEsIM).toBeVisible();
      await expect(this.homePageLocators.lnkHelp).toBeVisible();
      await expect(this.homePageLocators.lnkUefa).toBeVisible();
    });
  }

  async verifyNavigationToRegionPage(regionName: string) {
    await test.step(`Verify navigation to ${regionName} region page`, async () => {
      await expect(this.page).toHaveURL(new RegExp(`.*${regionName.toLowerCase().replace(/ /g, '-')}.*`));
    });
  }

  async verifySearchInputVisible() {
    await test.step('Verify search input is visible', async () => {
      await expect(this.homePageLocators.inputFindDestination).toBeVisible();
    });
  }

  async verifySearchInputPlaceholder() {
    await test.step('Verify search input placeholder text', async () => {
      await expect(this.homePageLocators.inputFindDestination).toHaveAttribute('placeholder', 'Where are you going');
    });
  }

  async verifyFindAPlanButtonDisabled() {
    await test.step('Verify Find a plan button is disabled initially', async () => {
      await expect(this.homePageLocators.btnFindAPlan).toBeDisabled();
    });
  }

  async verifyFindAPlanButtonEnabled() {
    await test.step('Verify Find a plan button is enabled', async () => {
      await expect(this.homePageLocators.btnFindAPlan).toBeEnabled();
    });
  }

  async verifySearchInputIsEmpty() {
    await test.step('Verify search input is empty', async () => {
      await expect(this.homePageLocators.inputFindDestination).toHaveValue('');
    });
  }

  async verifyAllCountryCardsVisible() {
    await test.step('Verify all country cards are visible in Countries tab', async () => {
      await expect(this.homePageLocators.btnExploreItaly).toBeVisible();
      await expect(this.homePageLocators.btnExploreUK).toBeVisible();
      await expect(this.homePageLocators.btnExploreSouthAfrica).toBeVisible();
      await expect(this.homePageLocators.btnExploreFrance).toBeVisible();
      await expect(this.homePageLocators.btnExploreSpain).toBeVisible();
      await expect(this.homePageLocators.btnExploreUSA).toBeVisible();
      await expect(this.homePageLocators.btnExploreEgypt).toBeVisible();
      await expect(this.homePageLocators.btnExploreGermany).toBeVisible();
      await expect(this.homePageLocators.btnExploreGreece).toBeVisible();
    });
  }

  // ============ HERO CAROUSEL ============

  async verifyCarouselVisible() {
    await test.step('Verify hero carousel is visible', async () => {
      await expect(this.homePageLocators.carouselSection).toBeVisible();
    });
  }

  async verifyCarouselSlideActive(slideNumber: number) {
    await test.step(`Verify carousel slide ${slideNumber} is active`, async () => {
      await expect(this.homePageLocators.carouselSlide(slideNumber)).toHaveAttribute('aria-hidden', 'false');
    });
  }

  async clickCarouselNext() {
    await test.step('Click carousel Next slide button', async () => {
      await this.homePageLocators.btnCarouselNext.click();
    });
  }

  async clickCarouselPrevious() {
    await test.step('Click carousel Previous slide button', async () => {
      await this.homePageLocators.btnCarouselPrevious.click();
    });
  }

  async verifyCarouselPreviousButtonDisabled() {
    await test.step('Verify carousel Previous slide button is disabled', async () => {
      await expect(this.homePageLocators.btnCarouselPrevious).toBeDisabled();
    });
  }

  async verifyCarouselNextButtonDisabled() {
    await test.step('Verify carousel Next slide button is disabled', async () => {
      await expect(this.homePageLocators.btnCarouselNext).toBeDisabled();
    });
  }

  async verifyCarouselNextButtonEnabled() {
    await test.step('Verify carousel Next slide button is enabled', async () => {
      await expect(this.homePageLocators.btnCarouselNext).toBeEnabled();
    });
  }

  async verifyCarouselDotsCount(count: number) {
    await test.step(`Verify carousel has ${count} navigation dots`, async () => {
      await expect(this.homePageLocators.carouselDots).toHaveCount(count);
    });
  }
}
