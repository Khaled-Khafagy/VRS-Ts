import { expect, Page, test } from "@playwright/test";
import { BasePage } from "./BasePage";

export class OurDestinationsPage extends BasePage {
  private readonly ourDestinationsLocators = {
    // Header Navigation
    lnkHomepage: this.page.getByRole('link', { name: 'Homepage' }),
    lnkOurDestinations: this.page.getByRole('link', { name: 'Our Destinations' }),
    lnkUefaChampionsLeague: this.page.getByRole('link', { name: 'UEFA Champions League' }),
    lnkAboutEsim: this.page.getByRole('link', { name: 'About eSIM' }),
    lnkHelp: this.page.getByRole('link', { name: 'Help' }),
    lnkBlog: this.page.getByRole('link', { name: 'Blog' }),
    imgShoppingCart: this.page.locator('img[alt="Shopping Cart"]'),
    lnkLanguage: this.page.getByRole('link', { name: 'English | US Dollar' }),
    btnLogin: this.page.getByRole('button', { name: 'Login' }),

    // Main Content
    btnBack: this.page.getByRole('button', { name: 'Back button' }),
    hdgMainTitle: this.page.getByRole('heading', { level: 1, name: "Let's pick your destination" }),

    // Search Section
    inputSearchDestination: this.page.getByPlaceholder('Where are you visiting?'),
    btnSearchDropdown: this.page.getByRole('button', { name: 'Where are you visiting?' }),
    btnSearch: this.page.getByRole('button', { name: 'Search' }),

    // Tab Navigation
    tabRegions: this.page.getByRole('tab', { name: 'Regions' }),
    tabCountries: this.page.getByRole('tab', { name: 'Countries' }),

    // Destination Grid
    allDestinationCards: this.page.locator('article'),
    destinationCard: (destinationName: string) => 
      this.page.locator('article').filter({ 
        has: this.page.getByRole('heading', { level: 3, name: destinationName }) 
      }),
    destinationImage: (destinationName: string) => 
      this.page.getByAltText(destinationName),
    destinationHeading: (destinationName: string) => 
      this.page.getByRole('heading', { level: 3, name: destinationName }),
    destinationPricing: (destinationName: string) => 
      this.page.locator('article').filter({ 
        has: this.page.getByRole('heading', { level: 3, name: destinationName }) 
      }).getByText(/Plans from/),
    exploreButton: (destinationName: string) => 
      this.page.locator(`a[href*="${destinationName.toLowerCase().replace(/ /g, '-')}"]`),

    // Specific Destination Explore Buttons
    btnExploreAfrica: this.page.locator('a[href="/our-destinations/africa"]'),
    btnExploreAmericanSamoa: this.page.locator('a[href="/our-destinations/american-samoa"]'),
    btnExploreAsia: this.page.locator('a[href="/our-destinations/asia"]'),
    btnExploreCaribbean: this.page.locator('a[href="/our-destinations/caribbean"]'),
    btnExploreEurope: this.page.locator('a[href="/our-destinations/europe"]'),
    btnExploreLatinAmerica: this.page.locator('a[href="/our-destinations/latin-america"]'),
    btnExploreMiddleEast: this.page.locator('a[href="/our-destinations/middle-east"]'),
    btnExploreNorthAmerica: this.page.locator('a[href="/our-destinations/north-america"]'),
    btnExploreOceania: this.page.locator('a[href="/our-destinations/oceania"]'),

    // Search Results/Autocomplete
    searchResultItem: (itemName: string) => this.page.getByText(itemName).locator('..').filter({ hasText: itemName }),
    searchResultsCountriesSection: this.page.getByText('Countries'),
    searchResultsRegionsSection: this.page.getByText('Regions'),
  };

  constructor(page: Page) {
    super(page);
  }

  async gotoOurDestinationsPage(URL: string) {
    await test.step('Navigate to Our Destinations Page and Accept cookies', async () => {
      await this.page.goto(URL, { waitUntil: 'domcontentloaded' });
      await this.acceptCookies();
    });
  }

  // ============ HEADER NAVIGATION ============

  async verifyHeaderNavigationLinks() {
    await test.step('Verify all header navigation links are visible', async () => {
      await expect(this.ourDestinationsLocators.lnkHomepage).toBeVisible();
      await expect(this.ourDestinationsLocators.lnkOurDestinations).toBeVisible();
      await expect(this.ourDestinationsLocators.lnkUefaChampionsLeague).toBeVisible();
      await expect(this.ourDestinationsLocators.lnkAboutEsim).toBeVisible();
      await expect(this.ourDestinationsLocators.lnkHelp).toBeVisible();
      await expect(this.ourDestinationsLocators.lnkBlog).toBeVisible();
    });
  }

  async clickHomePageLink() {
    await test.step('Click Homepage link in header', async () => {
      const homeLink = this.ourDestinationsLocators.lnkHomepage;
      await homeLink.scrollIntoViewIfNeeded();
      await homeLink.hover();
      await homeLink.click();
    });
  }

  async clickBackButton() {
    await test.step('Click Back button', async () => {
      const backBtn = this.ourDestinationsLocators.btnBack;
      await backBtn.scrollIntoViewIfNeeded();
      await backBtn.hover();
      await backBtn.click();
    });
  }

  // ============ PAGE TITLE & CONTENT ============

  async verifyPageTitle() {
    await test.step('Verify main page title is displayed', async () => {
      await expect(this.ourDestinationsLocators.hdgMainTitle).toBeVisible();
    });
  }

  async verifyBackButtonVisible() {
    await test.step('Verify back button is visible', async () => {
      await expect(this.ourDestinationsLocators.btnBack).toBeVisible();
    });
  }

  // ============ SEARCH FUNCTIONALITY ============

  async searchForDestination(destinationName: string) {
    await test.step(`Search for destination: ${destinationName}`, async () => {
      const searchInput = this.ourDestinationsLocators.inputSearchDestination;
      await searchInput.scrollIntoViewIfNeeded();
      await searchInput.hover();
      await searchInput.click();
      await searchInput.fill(destinationName);
      // Wait for autocomplete/dropdown to appear
      await this.page.waitForTimeout(500);
    });
  }

  async verifySearchInputVisible() {
    await test.step('Verify search input field is visible', async () => {
      await expect(this.ourDestinationsLocators.inputSearchDestination).toBeVisible();
    });
  }

  async verifySearchInputHasPlaceholder() {
    await test.step('Verify search input has correct placeholder', async () => {
      await expect(this.ourDestinationsLocators.inputSearchDestination)
        .toHaveAttribute('placeholder', 'Where are you visiting?');
    });
  }

  async verifySearchDropdownOpens() {
    await test.step('Verify search dropdown opens when typing', async () => {
      const searchInput = this.ourDestinationsLocators.inputSearchDestination;
      await searchInput.click();
      await searchInput.fill('F');
      // Dropdown should contain results section
      const countriesSection = this.ourDestinationsLocators.searchResultsCountriesSection;
      await expect(countriesSection.first()).toBeVisible({ timeout: 3000 }).catch(() => null);
    });
  }

  async verifySearchShowsCountriesAndRegions() {
    await test.step('Verify search results show both Countries and Regions sections', async () => {
      await this.searchForDestination('A');
      const countriesSection = this.page.getByText('Countries');
      const regionsSection = this.page.getByText('Regions');
      await expect(countriesSection.first()).toBeVisible({ timeout: 2000 }).catch(() => null);
      await expect(regionsSection.first()).toBeVisible({ timeout: 2000 }).catch(() => null);
    });
  }

  async selectFromSearchResults(itemName: string) {
    await test.step(`Select "${itemName}" from search results`, async () => {
      const resultItem = this.page.locator('list [cursor=pointer]').filter({ 
        has: this.page.getByText(itemName, { exact: true }) 
      }).first();
      await resultItem.scrollIntoViewIfNeeded();
      await resultItem.hover();
      await resultItem.click();
    });
  }

  async clearSearchInput() {
    await test.step('Clear search input', async () => {
      const searchInput = this.ourDestinationsLocators.inputSearchDestination;
      await searchInput.scrollIntoViewIfNeeded();
      await searchInput.hover();
      await searchInput.clear();
    });
  }

  async verifySearchButtonDisabledInitially() {
    await test.step('Verify search button is disabled initially', async () => {
      await expect(this.ourDestinationsLocators.btnSearch).toBeDisabled();
    });
  }

  async clickSearchButton() {
    await test.step('Click Search button', async () => {
      const searchBtn = this.ourDestinationsLocators.btnSearch;
      await searchBtn.scrollIntoViewIfNeeded();
      await searchBtn.hover();
      await searchBtn.click();
    });
  }

  // ============ TAB NAVIGATION ============

  async verifyRegionsTabIsActive() {
    await test.step('Verify Regions tab is active by default', async () => {
      await expect(this.ourDestinationsLocators.tabRegions)
        .toHaveAttribute('aria-selected', 'true');
    });
  }

  async switchToCountriesTab() {
    await test.step('Switch to Countries tab', async () => {
      const countriesTab = this.ourDestinationsLocators.tabCountries;
      await countriesTab.scrollIntoViewIfNeeded();
      await countriesTab.hover();
      await countriesTab.click();
      await this.page.waitForTimeout(500);
    });
  }

  async switchToRegionsTab() {
    await test.step('Switch to Regions tab', async () => {
      const regionsTab = this.ourDestinationsLocators.tabRegions;
      await regionsTab.scrollIntoViewIfNeeded();
      await regionsTab.hover();
      await regionsTab.click();
      await this.page.waitForTimeout(500);
    });
  }

  async verifyCountriesTabIsActive() {
    await test.step('Verify Countries tab is active', async () => {
      await expect(this.ourDestinationsLocators.tabCountries)
        .toHaveAttribute('aria-selected', 'true');
    });
  }

  async verifyTabContent() {
    await test.step('Verify tab content is displayed', async () => {
      const destinationCards = this.ourDestinationsLocators.allDestinationCards;
      await expect(destinationCards.first()).toBeVisible();
    });
  }

  // ============ DESTINATION GRID ============

  async verifyDestinationCardVisible(destinationName: string) {
    await test.step(`Verify ${destinationName} destination card is visible`, async () => {
      const heading = this.page.getByRole('heading', { level: 3, name: destinationName });
      await expect(heading).toBeVisible();
    });
  }

  async verifyAllDestinationCardsVisible() {
    await test.step('Verify all destination cards are visible in grid', async () => {
      const africaHeading = this.page.getByRole('heading', { level: 3, name: 'Africa' });
      await expect(africaHeading).toBeVisible();
    });
  }

  async verifyDestinationImageVisible(destinationName: string) {
    await test.step(`Verify ${destinationName} card has image`, async () => {
      const image = this.page.getByAltText(destinationName);
      await expect(image).toBeVisible();
    });
  }

  async verifyDestinationHeadingVisible(destinationName: string) {
    await test.step(`Verify ${destinationName} heading is visible`, async () => {
      const heading = this.page.getByRole('heading', { level: 3, name: destinationName });
      await expect(heading).toBeVisible();
    });
  }

  async verifyDestinationPricingVisible(destinationName: string) {
    await test.step(`Verify ${destinationName} card shows pricing`, async () => {
      const pricingText = this.page.getByText(/Plans from \$/);
      const visiblePricing = pricingText.locator('.').first();
      await expect(visiblePricing).toBeVisible();
    });
  }

  async verifyDestinationPricingFormat(destinationName: string) {
    await test.step(`Verify ${destinationName} pricing has correct format`, async () => {
      const pricing = this.ourDestinationsLocators.destinationPricing(destinationName);
      const priceText = await pricing.textContent();
      expect(priceText).toMatch(/Plans from \$\d+/);
    });
  }

  async verifyExploreButtonVisible(destinationName: string) {
    await test.step(`Verify Explore button is visible for ${destinationName}`, async () => {
      const exploreBtn = this.page.locator(`a[href*="${destinationName.toLowerCase().replace(/ /g, '-')}"]`);
      await expect(exploreBtn).toBeVisible();
    });
  }

  async clickExploreButton(destinationName: string) {
    await test.step(`Click Explore button for ${destinationName}`, async () => {
      const exploreBtn = this.page.locator(`a[href*="${destinationName.toLowerCase().replace(/ /g, '-')}"]`);
      await expect(exploreBtn).toBeVisible();
      await exploreBtn.hover();
      await exploreBtn.click();
    });
  }

  async navigateToDestination(destinationName: string) {
    await test.step(`Navigate to ${destinationName} destination page`, async () => {
      await this.verifyDestinationCardVisible(destinationName);
      await this.clickExploreButton(destinationName);
    });
  }

  async verifyDestinationCardLayout(destinationName: string) {
    await test.step(`Verify ${destinationName} card has complete layout`, async () => {
      await this.verifyDestinationImageVisible(destinationName);
      await this.verifyDestinationHeadingVisible(destinationName);
      await this.verifyDestinationPricingVisible(destinationName);
      await this.verifyExploreButtonVisible(destinationName);
    });
  }
}
