import { expect, Page, test } from "@playwright/test";
import { BasePage } from "./BasePage";
import { shortDelay } from '../playwright.config';

export class OurDestinationsPage extends BasePage {
  private readonly ourDestinationsLocators = {
    // Header Navigation
    lnkHomepage: this.page.getByRole('link', { name: 'Homepage' }),
    lnkOurDestinations: this.page.getByRole('link', { name: 'Our Destinations' }),
    lnkUefaChampionsLeague: this.page.getByRole('link', { name: 'UEFA Champions League' }),
    lnkAboutEsim: this.page.getByRole('link', { name: 'About eSIM' }),
    lnkHelp: this.page.getByTestId('TopNavigation:desktop').getByRole('link', { name: 'Help' }),
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
    allDestinationCards: this.page.locator('[class*="proposalCard_proposalCard"]'),
    destinationCard: (destinationName: string) =>
      this.page.locator('[class*="proposalCard_proposalCard"]').filter({
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
    await test.step('Navigate to Our Destinations Page', async () => {
      await this.navigateToUrl(URL);
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
      await this.page.waitForTimeout(shortDelay);
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

  async verifySearchDropdownVisible(searchTerm: string) {
    await test.step(`Verify search dropdown shows results for "${searchTerm}"`, async () => {
      await expect(this.page.getByText(searchTerm, { exact: true }).first()).toBeVisible({ timeout: actionTimeout });
    });
  }

  async verifySearchShowsCountriesAndRegions() {
    await test.step('Verify search results show both Countries and Regions sections', async () => {
      await this.searchForDestination('A');
      await expect(this.page.getByText('Countries').first()).toBeVisible({ timeout: actionTimeout });
      await expect(this.page.getByText('Regions').first()).toBeVisible({ timeout: actionTimeout });
    });
  }

  async verifySearchInputIsEmpty() {
    await test.step('Verify search input is empty', async () => {
      await expect(this.ourDestinationsLocators.inputSearchDestination).toHaveValue('');
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
      await this.page.waitForTimeout(shortDelay);
    });
  }

  async switchToRegionsTab() {
    await test.step('Switch to Regions tab', async () => {
      const regionsTab = this.ourDestinationsLocators.tabRegions;
      await regionsTab.scrollIntoViewIfNeeded();
      await regionsTab.hover();
      await regionsTab.click();
      await this.page.waitForTimeout(shortDelay);
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
    await test.step('Verify all region destination cards are visible', async () => {
      const regions = ['Africa', 'Asia', 'Caribbean', 'Europe', 'Latin America', 'Middle East', 'North America', 'Oceania'];
      for (const region of regions) {
        await expect(this.page.getByRole('heading', { level: 3, name: region })).toBeVisible();
      }
    });
  }

  // async verifyDestinationImageVisible(destinationName: string) {
  //   await test.step(`Verify ${destinationName} card has image`, async () => {
  //     const image = this.page.getByAltText(destinationName);
  //     await expect(image).toBeVisible();
  //   });
  // }

  async verifyDestinationHeadingVisible(destinationName: string) {
    await test.step(`Verify ${destinationName} heading is visible`, async () => {
      const heading = this.page.getByRole('heading', { level: 3, name: destinationName });
      await expect(heading).toBeVisible();
    });
  }

  async verifyDestinationPricingVisible(destinationName: string) {
    await test.step(`Verify ${destinationName} card shows pricing`, async () => {
      const pricing = this.ourDestinationsLocators.destinationCard(destinationName).locator('p');
      await expect(pricing).toBeVisible();
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
      const slug = destinationName.toLowerCase().replace(/ /g, '-');
      await expect(this.page.locator(`a[href="/our-destinations/${slug}"]`)).toBeVisible();
    });
  }

  async clickExploreButton(destinationName: string) {
    await test.step(`Click Explore button for ${destinationName}`, async () => {
      const slug = destinationName.toLowerCase().replace(/ /g, '-');
      await this.page.locator(`a[href="/our-destinations/${slug}"]`).click();
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
      await this.verifyDestinationHeadingVisible(destinationName);
      await this.verifyDestinationPricingVisible(destinationName);
      await this.verifyExploreButtonVisible(destinationName);
    });
  }

  async verifyNavigationToDestinationPage(destinationName: string) {
    await test.step(`Verify navigation to ${destinationName} destination page`, async () => {
      const slug = destinationName.toLowerCase().replace(/ /g, '-');
      await expect(this.page).toHaveURL(new RegExp(`.*our-destinations/${slug}`));
    });
  }

  async verifyHomePageLoaded() {
    await test.step('Verify navigation back to homepage', async () => {
      await expect(this.page).toHaveURL(/.*vrs.preprod.travel.vodafone.com\/?(\?.*)?$/);
    });
  }

  async verifyCountriesTabHasContent() {
    await test.step('Verify Countries tab shows individual country cards', async () => {
      await expect(this.page.getByRole('heading', { level: 3, name: 'Afghanistan' })).toBeVisible();
    });
  }
}
