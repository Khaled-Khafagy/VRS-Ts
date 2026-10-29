import {expect,Page, test } from "@playwright/test";
import { BasePage } from "./BasePage";
import { navigationTimeout } from '../playwright.config';

export class HomePage extends BasePage {
  protected readonly pageName = 'HomePage';
  protected readonly sourceFilePath = __filename;

  private readonly homePageLocators = {
    // Header Navigation
    lnkHomepage: this.page.getByRole('link', { name: 'Homepage' }),
    lnkOurDestinations: this.page.getByRole('link', { name: 'Our Destinations' }),
    lnkUefa: this.page.getByRole('link', { name: 'UEFA Champions League' }),
    lnkTravelTogether: this.page.getByRole('link', { name: 'Travel Together' }),
    lnkAmericanFootball: this.page.getByRole('link', { name: 'American Football' }),
    lnkUnlimitedData: this.page.getByRole('link', { name: 'Unlimited Data' }),
    lnkBlog: this.page.getByRole('link', { name: 'Blog' }),
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
    statDestinations: this.page.getByText('Destinations', { exact: true }),
    statSupport: this.page.getByText('support', { exact: true }),
    statActivation: this.page.getByText('activation', { exact: true }),

    // Hero Carousel
    carouselSection: this.page.getByRole('region', { name: 'Image carousel' }),
    btnCarouselPrevious: this.page.getByRole('button', { name: 'Previous slide' }),
    btnCarouselNext: this.page.getByRole('button', { name: 'Next slide' }),
    // Dynamic — takes a parameter, not wrapped with heal
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
    btnExploreLatinAmerica: this.page.locator('a[href="/our-destinations/latin-america"]'),

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
    // Dynamic — takes a parameter, not wrapped with heal
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
      await expect(await this.heal('imgUserProfileLoggedIn', this.homePageLocators.imgUserProfileLoggedIn)).toBeVisible();
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
      await (await this.heal('imgUserProfileLoggedIn', this.homePageLocators.imgUserProfileLoggedIn)).click();
    });
  }

  // ============ NEW METHODS FOR TABS & EXPLORATION ============

  async switchToCountriesTab() {
    await test.step('Switch to Countries Tab', async () => {
      const tab = await this.heal('tabCountries', this.homePageLocators.tabCountries);
      await tab.scrollIntoViewIfNeeded();
      await tab.hover();
      await tab.click();
      await expect(tab).toHaveAttribute('aria-selected', 'true');
    });
  }

  async switchToRegionsTab() {
    await test.step('Switch to Regions Tab', async () => {
      const tab = await this.heal('tabRegions', this.homePageLocators.tabRegions);
      await tab.scrollIntoViewIfNeeded();
      await tab.hover();
      await tab.click();
      await expect(tab).toHaveAttribute('aria-selected', 'true');
    });
  }

  async verifyRegionsTabIsActive() {
    await test.step('Verify Regions Tab is Active', async () => {
      await expect(await this.heal('tabRegions', this.homePageLocators.tabRegions)).toHaveAttribute('aria-selected', 'true');
    });
  }

  async verifyCountriesTabIsActive() {
    await test.step('Verify Countries Tab is Active', async () => {
      await expect(await this.heal('tabCountries', this.homePageLocators.tabCountries)).toHaveAttribute('aria-selected', 'true');
    });
  }

  async searchForCountry(countryName: string) {
    await test.step(`Search for country: ${countryName}`, async () => {
      const input = await this.heal('inputFindDestination', this.homePageLocators.inputFindDestination);
      await input.scrollIntoViewIfNeeded();
      await input.hover();
      await input.click();
      await input.fill(countryName);
    });
  }

  async clearSearchInput() {
    await test.step('Clear Search Input', async () => {
      const input = await this.heal('inputFindDestination', this.homePageLocators.inputFindDestination);
      await input.scrollIntoViewIfNeeded();
      await input.hover();
      await input.clear();
    });
  }

  async clickFindAPlanButton() {
    await test.step('Click Find a plan Button', async () => {
      const btn = await this.heal('btnFindAPlan', this.homePageLocators.btnFindAPlan);
      await btn.scrollIntoViewIfNeeded();
      await btn.hover();
      await btn.click();
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
      await (await this.heal('hdgPopularDestinations', this.homePageLocators.hdgPopularDestinations)).scrollIntoViewIfNeeded();
    });
  }

  async verifyHeroBannerVisible() {
    await test.step('Verify Hero Banner is visible', async () => {
      await expect(await this.heal('hdgHeroBanner', this.homePageLocators.hdgHeroBanner)).toBeVisible();
      await expect(await this.heal('hdgHeroSubtitle', this.homePageLocators.hdgHeroSubtitle)).toBeVisible();
    });
  }

  async verifyStatsBarVisible() {
    await test.step('Verify stats bar (Destinations / support / activation) is visible', async () => {
      await expect(await this.heal('statDestinations', this.homePageLocators.statDestinations)).toBeVisible();
      await expect(await this.heal('statSupport', this.homePageLocators.statSupport)).toBeVisible();
      await expect(await this.heal('statActivation', this.homePageLocators.statActivation)).toBeVisible();
    });
  }

  async verifyHeaderNavigationLinksVisible() {
    await test.step('Verify header navigation links are visible', async () => {
      await expect(await this.heal('lnkOurDestinations', this.homePageLocators.lnkOurDestinations)).toBeVisible();
      await expect(await this.heal('lnkUefa', this.homePageLocators.lnkUefa)).toBeVisible();
      await expect(await this.heal('lnkTravelTogether', this.homePageLocators.lnkTravelTogether)).toBeVisible();
      await expect(await this.heal('lnkAmericanFootball', this.homePageLocators.lnkAmericanFootball)).toBeVisible();
      await expect(await this.heal('lnkUnlimitedData', this.homePageLocators.lnkUnlimitedData)).toBeVisible();
      await expect(await this.heal('lnkBlog', this.homePageLocators.lnkBlog)).toBeVisible();
      await expect(await this.heal('lnkHelp', this.homePageLocators.lnkHelp)).toBeVisible();
    });
  }

  async verifyNavigationToRegionPage(regionName: string) {
    await test.step(`Verify navigation to ${regionName} region page`, async () => {
      await expect(this.page).toHaveURL(new RegExp(`.*${regionName.toLowerCase().replace(/ /g, '-')}.*`));
    });
  }

  async verifySearchInputVisible() {
    await test.step('Verify search input is visible', async () => {
      await expect(await this.heal('inputFindDestination', this.homePageLocators.inputFindDestination)).toBeVisible();
    });
  }

  async verifySearchInputPlaceholder() {
    await test.step('Verify search input placeholder text', async () => {
      await expect(await this.heal('inputFindDestination', this.homePageLocators.inputFindDestination)).toHaveAttribute('placeholder', 'Where are you going');
    });
  }

  async verifyFindAPlanButtonDisabled() {
    await test.step('Verify Find a plan button is disabled initially', async () => {
      await expect(await this.heal('btnFindAPlan', this.homePageLocators.btnFindAPlan)).toBeDisabled();
    });
  }

  async verifyFindAPlanButtonEnabled() {
    await test.step('Verify Find a plan button is enabled', async () => {
      await expect(await this.heal('btnFindAPlan', this.homePageLocators.btnFindAPlan)).toBeEnabled();
    });
  }

  async verifySearchInputIsEmpty() {
    await test.step('Verify search input is empty', async () => {
      await expect(await this.heal('inputFindDestination', this.homePageLocators.inputFindDestination)).toHaveValue('');
    });
  }

  async verifyAllCountryCardsVisible() {
    await test.step('Verify all country cards are visible in Countries tab', async () => {
      await expect(await this.heal('btnExploreItaly', this.homePageLocators.btnExploreItaly)).toBeVisible();
      await expect(await this.heal('btnExploreUK', this.homePageLocators.btnExploreUK)).toBeVisible();
      await expect(await this.heal('btnExploreSouthAfrica', this.homePageLocators.btnExploreSouthAfrica)).toBeVisible();
      await expect(await this.heal('btnExploreFrance', this.homePageLocators.btnExploreFrance)).toBeVisible();
      await expect(await this.heal('btnExploreSpain', this.homePageLocators.btnExploreSpain)).toBeVisible();
      await expect(await this.heal('btnExploreUSA', this.homePageLocators.btnExploreUSA)).toBeVisible();
      await expect(await this.heal('btnExploreEgypt', this.homePageLocators.btnExploreEgypt)).toBeVisible();
      await expect(await this.heal('btnExploreGermany', this.homePageLocators.btnExploreGermany)).toBeVisible();
      await expect(await this.heal('btnExploreGreece', this.homePageLocators.btnExploreGreece)).toBeVisible();
    });
  }

  // ============ HERO CAROUSEL ============

  async verifyCarouselVisible() {
    await test.step('Verify hero carousel is visible', async () => {
      await expect(await this.heal('carouselSection', this.homePageLocators.carouselSection)).toBeVisible();
    });
  }

  async verifyCarouselSlideActive(slideNumber: number) {
    await test.step(`Verify carousel slide ${slideNumber} is active`, async () => {
      await expect(this.homePageLocators.carouselSlide(slideNumber)).toHaveAttribute('aria-hidden', 'false');
    });
  }

  async clickCarouselNext() {
    await test.step('Click carousel Next slide button', async () => {
      await (await this.heal('btnCarouselNext', this.homePageLocators.btnCarouselNext)).click();
    });
  }

  async clickCarouselPrevious() {
    await test.step('Click carousel Previous slide button', async () => {
      await (await this.heal('btnCarouselPrevious', this.homePageLocators.btnCarouselPrevious)).click();
    });
  }

  async verifyCarouselPreviousButtonDisabled() {
    await test.step('Verify carousel Previous slide button is disabled', async () => {
      await expect(await this.heal('btnCarouselPrevious', this.homePageLocators.btnCarouselPrevious)).toBeDisabled();
    });
  }

  async verifyCarouselNextButtonDisabled() {
    await test.step('Verify carousel Next slide button is disabled', async () => {
      await expect(await this.heal('btnCarouselNext', this.homePageLocators.btnCarouselNext)).toBeDisabled();
    });
  }

  async verifyCarouselNextButtonEnabled() {
    await test.step('Verify carousel Next slide button is enabled', async () => {
      await expect(await this.heal('btnCarouselNext', this.homePageLocators.btnCarouselNext)).toBeEnabled();
    });
  }

  async verifyCarouselDotsCount(count: number) {
    await test.step(`Verify carousel has ${count} navigation dots`, async () => {
      await expect(await this.heal('carouselDots', this.homePageLocators.carouselDots)).toHaveCount(count);
    });
  }

  // ============ FOOTER ============

  // Each column is scoped by a link that is unique to that section,
  // because the section headings ("Top Destinations", "Legal", …) live
  // outside the footer-link-group-column element and cannot be used as filters.
  private get footerTopDestinationsCol() {
    return this.page.getByTestId('footer-link-group-column')
      .filter({ has: this.page.getByRole('link', { name: 'Europe', exact: true }) });
  }

  private get footerLegalCol() {
    return this.page.getByTestId('footer-link-group-column')
      .filter({ has: this.page.getByRole('link', { name: 'Terms & Conditions', exact: true }) });
  }

  private get footerHelpSupportCol() {
    return this.page.getByTestId('footer-link-group-column')
      .filter({ has: this.page.getByRole('link', { name: 'eSIM Installation Guide', exact: true }) });
  }

  async scrollToFooter() {
    await test.step('Scroll to footer', async () => {
      // Use mouse wheel events to trigger IntersectionObserver-based lazy loading;
      // window.scrollTo bypasses it and the footer never appears.
      for (let i = 0; i < 15; i++) {
        await this.page.mouse.wheel(0, 500);
        await this.page.waitForTimeout(100);
      }
      await this.page.waitForTimeout(800);
    });
  }

  async verifyFooterTopDestinationsSectionVisible() {
    await test.step('Verify Footer Top Destinations section is visible', async () => {
      await this.scrollToFooter();
      const col = this.footerTopDestinationsCol;
      for (const name of ['Europe', 'Middle East', 'Africa', 'Spain', 'Italy', 'Germany', 'Switzerland', 'Austria', 'Turkey', 'Luxembourg', 'Portugal', 'Greece']) {
        await expect(col.getByRole('link', { name })).toBeVisible();
      }
    });
  }

  async verifyFooterLegalSectionVisible() {
    await test.step('Verify Footer Legal section is visible', async () => {
      await this.scrollToFooter();
      const col = this.footerLegalCol;
      for (const name of ['Terms & Conditions', 'Privacy Policy', 'Cookie Policy', 'Charges Guide', 'Acceptable Usage Policy', 'Ad Choices']) {
        await expect(col.getByRole('link', { name })).toBeVisible();
      }
    });
  }

  async verifyFooterHelpSupportSectionVisible() {
    await test.step('Verify Footer Help and Support section is visible', async () => {
      await this.scrollToFooter();
      const col = this.footerHelpSupportCol;
      for (const name of ['eSIM Installation Guide', 'Help', 'Frequently Asked Questions', 'Contact us or Leave us']) {
        await expect(col.getByRole('link', { name })).toBeVisible();
      }
    });
  }

  async clickEachTopDestinationFooterLinkAndVerify(baseUrl: string) {
    await this.scrollToFooter();
    const destinations = [
      { name: 'Europe',       slug: 'europe' },
      { name: 'Middle East',  slug: 'middle-east' },
      { name: 'Africa',       slug: 'africa' },
      { name: 'Spain',        slug: 'spain' },
      { name: 'Italy',        slug: 'italy' },
      { name: 'Germany',      slug: 'germany' },
      { name: 'Switzerland',  slug: 'switzerland' },
      { name: 'Austria',      slug: 'austria' },
      { name: 'Turkey',       slug: 'turkey' },
      { name: 'Luxembourg',   slug: 'luxembourg' },
      { name: 'Portugal',     slug: 'portugal' },
      { name: 'Greece',       slug: 'greece' },
    ];
    for (const { name, slug } of destinations) {
      await test.step(`Footer '${name}' link navigates to /our-destinations/${slug}`, async () => {
        await this.scrollToFooter();
        const link = this.footerTopDestinationsCol.getByRole('link', { name });
        await link.scrollIntoViewIfNeeded();
        await link.click();
        await expect(this.page).toHaveURL(new RegExp(`/our-destinations/${slug}`), { timeout: navigationTimeout });
        await this.navigateToUrl(baseUrl);
      });
    }
  }

  async clickEachLegalFooterLinkAndVerify(baseUrl: string) {
    await this.scrollToFooter();
    const legalLinks = [
      { name: 'Terms & Conditions',     pathPart: 'terms-and-conditions' },
      { name: 'Privacy Policy',         pathPart: 'privacy-and-cookie-policy' },
      { name: 'Cookie Policy',          pathPart: 'privacy-and-cookie-policy' },
      { name: 'Charges Guide',          pathPart: 'charges-guide' },
      { name: 'Acceptable Usage Policy', pathPart: 'usage-policy' },
      { name: 'Ad Choices',             pathPart: 'privacy-and-cookie-policy' },
    ];
    for (const { name, pathPart } of legalLinks) {
      await test.step(`Footer '${name}' link points to page containing '${pathPart}'`, async () => {
        await this.scrollToFooter();
        const link = this.footerLegalCol.getByRole('link', { name });
        await link.scrollIntoViewIfNeeded();
        const opensInNewTab = (await link.getAttribute('target')) === '_blank';
        if (opensInNewTab) {
          const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            link.click(),
          ]);
          await newPage.waitForLoadState('domcontentloaded');
          await expect(newPage).toHaveURL(new RegExp(pathPart), { timeout: navigationTimeout });
          await newPage.close();
        } else {
          await link.click();
          await expect(this.page).toHaveURL(new RegExp(pathPart), { timeout: navigationTimeout });
          await this.navigateToUrl(baseUrl);
        }
      });
    }
  }

  async clickEachHelpSupportFooterLinkAndVerify(baseUrl: string) {
    await this.scrollToFooter();
    const helpLinks = [
      { name: 'eSIM Installation Guide', pathPart: 'activation-and-installation' },
      { name: 'Help',                     pathPart: 'help-support' },
      { name: 'Frequently Asked Questions', pathPart: 'help-support' },
      { name: 'Contact us or Leave us',   pathPart: 'help-support/contact' },
    ];
    for (const { name, pathPart } of helpLinks) {
      await test.step(`Footer '${name}' link navigates to page containing '${pathPart}'`, async () => {
        await this.scrollToFooter();
        const link = this.footerHelpSupportCol.getByRole('link', { name });
        await link.scrollIntoViewIfNeeded();
        await link.click();
        await expect(this.page).toHaveURL(new RegExp(pathPart), { timeout: navigationTimeout });
        await this.navigateToUrl(baseUrl);
      });
    }
  }
}
