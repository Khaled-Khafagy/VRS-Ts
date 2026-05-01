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
    hdgHeroBanner: this.page.getByRole('heading', { level: 1, name: 'Big Travel eSIM spring savings' }),
    lnkSeeOfferTerms: this.page.getByRole('link', { name: 'See offer terms' }),
    
    // Search Section
    hdgWhereVisiting: this.page.getByText('Where are you visiting?'),
    inputSearchCountry: this.page.getByPlaceholder('Country or Region'),
    btnCountryDropdown: this.page.getByRole('button', { name: 'Country or Region' }),
    btnSearch: this.page.getByRole('button', { name: 'Search' }),
    
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
    regionExploreBtn: (regionName: string) => this.page.locator(`a[href="/our-destinations/${regionName.toLowerCase().replace(/ /g, '-')}"]`),
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

  async navigateToEuropeRegionPlansPage() {
    await test.step('Navigate to Europe Region Plans Page', async () => {
      const europeBtn = this.homePageLocators.btnExploreEurope;
      await europeBtn.scrollIntoViewIfNeeded();
      await europeBtn.hover();
      await europeBtn.click();
    });
  }

  async navigateToAsiaRegionPlansPage() {
    await test.step('Navigate to Asia Region Plans Page', async () => {
      const asiaBtn = this.homePageLocators.btnExploreAsia;
      await asiaBtn.scrollIntoViewIfNeeded();
      await asiaBtn.hover();
      await asiaBtn.click();
    });
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
      await this.homePageLocators.inputSearchCountry.scrollIntoViewIfNeeded();
      await this.homePageLocators.inputSearchCountry.hover();
      await this.homePageLocators.inputSearchCountry.click();
      await this.homePageLocators.inputSearchCountry.fill(countryName);
    });
  }

  async clearSearchInput() {
    await test.step('Clear Search Input', async () => {
      await this.homePageLocators.inputSearchCountry.scrollIntoViewIfNeeded();
      await this.homePageLocators.inputSearchCountry.hover();
      await this.homePageLocators.inputSearchCountry.clear();
    });
  }

  async clickSearchButton() {
    await test.step('Click Search Button', async () => {
      await this.homePageLocators.btnSearch.scrollIntoViewIfNeeded();
      await this.homePageLocators.btnSearch.hover();
      await this.homePageLocators.btnSearch.click();
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
    });
  }

  async clickSeeOfferTerms() {
    await test.step('Click See Offer Terms link', async () => {
      await this.homePageLocators.lnkSeeOfferTerms.scrollIntoViewIfNeeded();
      await this.homePageLocators.lnkSeeOfferTerms.hover();
      await this.homePageLocators.lnkSeeOfferTerms.click();
    });
  }

  async verifySeeOfferTermsLinkVisible() {
    await test.step('Verify See Offer Terms link is visible', async () => {
      await expect(this.homePageLocators.lnkSeeOfferTerms).toBeVisible();
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
      await expect(this.homePageLocators.inputSearchCountry).toBeVisible();
    });
  }

  async verifySearchInputPlaceholder() {
    await test.step('Verify search input placeholder text', async () => {
      await expect(this.homePageLocators.inputSearchCountry).toHaveAttribute('placeholder', 'Country or Region');
    });
  }

  async verifySearchButtonDisabled() {
    await test.step('Verify search button is disabled initially', async () => {
      await expect(this.homePageLocators.btnSearch).toBeDisabled();
    });
  }

  async verifySearchButtonEnabled() {
    await test.step('Verify search button is enabled', async () => {
      await expect(this.homePageLocators.btnSearch).toBeEnabled();
    });
  }

  async verifySearchInputIsEmpty() {
    await test.step('Verify search input is empty', async () => {
      await expect(this.homePageLocators.inputSearchCountry).toHaveValue('');
    });
  }

  async verifySearchDropdownVisible() {
    await test.step('Verify search autocomplete dropdown is visible', async () => {
      await expect(this.page.getByRole('listbox')).toBeVisible();
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
}
