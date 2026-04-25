# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: website/Regression/login.spec.ts >> Login with valid credentials
- Location: tests/website/Regression/login.spec.ts:4:5

# Error details

```
TimeoutError: locator.click: Timeout 20000ms exceeded.
Call log:
  - waiting for locator('div.avatar_overlay__bto13x9:visible')

```

# Page snapshot

```yaml
- application [ref=e2]:
  - generic [ref=e3]:
    - navigation
    - main [ref=e4]:
      - region "scrollable content" [ref=e9]:
        - generic [ref=e11]:
          - generic [ref=e12]:
            - heading "Log in to your account" [level=1] [ref=e15]
            - generic [ref=e18]:
              - text: Don't have a My Vodafone account?
              - link "Create account" [ref=e19] [cursor=pointer]:
                - /url: "#"
            - generic [active] [ref=e20]:
              - generic [ref=e21]:
                - img "Warning" [ref=e24]
                - generic [ref=e29]: Invalid Credentials
              - generic [ref=e32]: Username or password is incorrect. Please try again.
          - generic [ref=e33]:
            - generic [ref=e36]:
              - generic [ref=e37]:
                - generic [ref=e38]:
                  - generic [ref=e39]: Email
                  - textbox "Email" [ref=e41]: b5oawaiyqe@ruutukf.com
                  - generic [ref=e42]: Enter your email, phone number or username
                - generic [ref=e44]:
                  - generic [ref=e45]: Password
                  - generic [ref=e46]:
                    - textbox "Password" [ref=e47]
                    - button "Show password" [ref=e48] [cursor=pointer]
                  - generic [ref=e50]: Enter your password
                - link "Forgot your password?" [ref=e52] [cursor=pointer]:
                  - /url: "#"
              - generic [ref=e53]:
                - button "Continue" [ref=e55] [cursor=pointer]
                - generic [ref=e56]:
                  - generic [ref=e57]: or
                  - button "Login with Google" [ref=e59] [cursor=pointer]:
                    - generic [ref=e60]:
                      - img [ref=e62]
                      - text: Login with Google
                  - button "Login with Apple" [ref=e69] [cursor=pointer]:
                    - generic [ref=e70]:
                      - img [ref=e72]
                      - text: Login with Apple
                - button "Cancel" [ref=e76] [cursor=pointer]
            - generic [ref=e77]:
              - list [ref=e80]:
                - listitem [ref=e81]:
                  - link "Privacy Policy" [ref=e82] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e83]:
                  - link "Cookie Policy" [ref=e84] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e85]:
                  - link "View Cookies" [ref=e86] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e87]:
                  - link "Terms & Conditions" [ref=e88] [cursor=pointer]:
                    - /url: "#"
              - generic [ref=e89]: © 2026 Vodafone
```

# Test source

```ts
  1   | import {expect,Page, test } from "@playwright/test";
  2   | import { BasePage } from "./BasePage";
  3   | 
  4   | export class HomePage extends BasePage {
  5   | private readonly homePageLocators = {
  6   |     // Header Navigation
  7   |     lnkHomepage: this.page.getByRole('link', { name: 'Homepage' }),
  8   |     lnkOurDestinations: this.page.getByRole('link', { name: 'Our Destinations' }),
  9   |     lnkUefa: this.page.getByRole('link', { name: 'UEFA Champions League' }),
  10  |     lnkAboutEsIM: this.page.getByRole('link', { name: 'About eSIM' }),
  11  |     lnkHelp: this.page.getByTestId('TopNavigation:desktop').getByRole('link', { name: 'Help' }),
  12  |     btnMenu: this.page.getByRole('button', { name: 'Menu' }),
  13  |     imgCart: this.page.getByAltText('Shopping Cart'),
  14  |     btnLogin: this.page.getByRole('button').filter({ has: this.page.locator('img') }).last(),
  15  |     imgUserProfileLoggedIn: this.page.locator('div.avatar_overlay__bto13x9:visible'),
  16  |     
  17  |     // Hero Banner
  18  |     hdgHeroBanner: this.page.getByRole('heading', { level: 1, name: 'Big Travel eSIM spring savings' }),
  19  |     lnkSeeOfferTerms: this.page.getByRole('link', { name: 'See offer terms' }),
  20  |     
  21  |     // Search Section
  22  |     hdgWhereVisiting: this.page.getByText('Where are you visiting?'),
  23  |     inputSearchCountry: this.page.getByPlaceholder('Country or Region'),
  24  |     btnCountryDropdown: this.page.getByRole('button', { name: 'Country or Region' }),
  25  |     btnSearch: this.page.getByRole('button', { name: 'Search' }),
  26  |     
  27  |     // Region/Country Tabs
  28  |     tabRegions: this.page.getByRole('tab', { name: 'Regions' }),
  29  |     tabCountries: this.page.getByRole('tab', { name: 'Countries' }),
  30  |     
  31  |     // Region Cards
  32  |     hdgPopularDestinations: this.page.getByRole('heading', { name: 'Popular Destinations' }),
  33  |     
  34  |     // Explore Buttons for each region
  35  |     btnExploreEurope: this.page.locator('a[href="/our-destinations/europe"]'),
  36  |     btnExploreNorthAmerica: this.page.locator('a[href="/our-destinations/north-america"]'),
  37  |     btnExploreMidEast: this.page.locator('a[href="/our-destinations/middle-east"]'),
  38  |     btnExploreAfrica: this.page.locator('a[href="/our-destinations/africa"]'),
  39  |     btnExploreAsia: this.page.locator('a[href="/our-destinations/asia"]'),
  40  |     btnExploreCaribbean: this.page.locator('a[href="/our-destinations/caribbean"]'),
  41  |     btnExploreSouthAmerica: this.page.locator('a[href="/our-destinations/south-america"]'),
  42  | 
  43  |     // Country cards (Countries tab)
  44  |     btnExploreItaly: this.page.locator('a[href="/our-destinations/italy"]'),
  45  |     btnExploreUK: this.page.locator('a[href="/our-destinations/uk"]'),
  46  |     btnExploreSouthAfrica: this.page.locator('a[href="/our-destinations/south-africa"]'),
  47  |     btnExploreFrance: this.page.locator('a[href="/our-destinations/france"]'),
  48  |     btnExploreSpain: this.page.locator('a[href="/our-destinations/spain"]'),
  49  |     btnExploreUSA: this.page.locator('a[href="/our-destinations/usa"]'),
  50  |     btnExploreEgypt: this.page.locator('a[href="/our-destinations/egypt"]'),
  51  |     btnExploreGermany: this.page.locator('a[href="/our-destinations/germany"]'),
  52  |     btnExploreGreece: this.page.locator('a[href="/our-destinations/greece"]'),
  53  |     
  54  |     // Generic region selectors - Using text-based locators
  55  |     regionCard: (regionName: string) => this.page.getByRole('heading', { level: 3, name: regionName }),
  56  |     regionHeading: (regionName: string) => this.page.getByRole('heading', { level: 3, name: regionName }),
  57  |     regionExploreBtn: (regionName: string) => this.page.locator(`a[href="/our-destinations/${regionName.toLowerCase().replace(/ /g, '-')}"]`),
  58  |   };
  59  | 
  60  |   constructor(page: Page) {
  61  |     super(page);
  62  |   }
  63  |   async gotoHomepage(URL: string) {
  64  |     await test.step('Navigate to Home Page', async () => {
  65  |       await this.navigateToUrl(URL);
  66  |     });
  67  |   }
  68  | 
  69  |   async navigateToHomePage(url: string) {
  70  |     await this.navigateToUrl(url);
  71  |   }
  72  | 
  73  |   async assertUserIsLoggedIn() {
  74  |     await test.step('Assert User is logged in by checking user profile icon', async () => {
  75  |       await expect(this.homePageLocators.imgUserProfileLoggedIn).toBeVisible();
  76  |     });
  77  |   }
  78  | 
  79  |   async navigateToEuropeRegionPlansPage() {
  80  |     await test.step('Navigate to Europe Region Plans Page', async () => {
  81  |       const europeBtn = this.homePageLocators.btnExploreEurope;
  82  |       await europeBtn.scrollIntoViewIfNeeded();
  83  |       await europeBtn.hover();
  84  |       await europeBtn.click();
  85  |     });
  86  |   }
  87  | 
  88  |   async navigateToMyAccountTab() {
  89  |     await test.step('Navigate to My Account Tab', async () => {
> 90  |       await this.homePageLocators.imgUserProfileLoggedIn.click();
      |                                                          ^ TimeoutError: locator.click: Timeout 20000ms exceeded.
  91  |     });
  92  |   }
  93  | 
  94  |   // ============ NEW METHODS FOR TABS & EXPLORATION ============
  95  | 
  96  |   async switchToCountriesTab() {
  97  |     await test.step('Switch to Countries Tab', async () => {
  98  |       await this.homePageLocators.tabCountries.scrollIntoViewIfNeeded();
  99  |       await this.homePageLocators.tabCountries.hover();
  100 |       await this.homePageLocators.tabCountries.click();
  101 |       await expect(this.homePageLocators.tabCountries).toHaveAttribute('aria-selected', 'true');
  102 |     });
  103 |   }
  104 | 
  105 |   async switchToRegionsTab() {
  106 |     await test.step('Switch to Regions Tab', async () => {
  107 |       await this.homePageLocators.tabRegions.scrollIntoViewIfNeeded();
  108 |       await this.homePageLocators.tabRegions.hover();
  109 |       await this.homePageLocators.tabRegions.click();
  110 |       await expect(this.homePageLocators.tabRegions).toHaveAttribute('aria-selected', 'true');
  111 |     });
  112 |   }
  113 | 
  114 |   async verifyRegionsTabIsActive() {
  115 |     await test.step('Verify Regions Tab is Active', async () => {
  116 |       await expect(this.homePageLocators.tabRegions).toHaveAttribute('aria-selected', 'true');
  117 |     });
  118 |   }
  119 | 
  120 |   async verifyCountriesTabIsActive() {
  121 |     await test.step('Verify Countries Tab is Active', async () => {
  122 |       await expect(this.homePageLocators.tabCountries).toHaveAttribute('aria-selected', 'true');
  123 |     });
  124 |   }
  125 | 
  126 |   async searchForCountry(countryName: string) {
  127 |     await test.step(`Search for country: ${countryName}`, async () => {
  128 |       await this.homePageLocators.inputSearchCountry.scrollIntoViewIfNeeded();
  129 |       await this.homePageLocators.inputSearchCountry.hover();
  130 |       await this.homePageLocators.inputSearchCountry.click();
  131 |       await this.homePageLocators.inputSearchCountry.fill(countryName);
  132 |     });
  133 |   }
  134 | 
  135 |   async clearSearchInput() {
  136 |     await test.step('Clear Search Input', async () => {
  137 |       await this.homePageLocators.inputSearchCountry.scrollIntoViewIfNeeded();
  138 |       await this.homePageLocators.inputSearchCountry.hover();
  139 |       await this.homePageLocators.inputSearchCountry.clear();
  140 |     });
  141 |   }
  142 | 
  143 |   async clickSearchButton() {
  144 |     await test.step('Click Search Button', async () => {
  145 |       await this.homePageLocators.btnSearch.scrollIntoViewIfNeeded();
  146 |       await this.homePageLocators.btnSearch.hover();
  147 |       await this.homePageLocators.btnSearch.click();
  148 |     });
  149 |   }
  150 | 
  151 |   async exploreRegion(regionName: string) {
  152 |     await test.step(`Explore ${regionName} region`, async () => {
  153 |       const exploreBtn = this.homePageLocators.regionExploreBtn(regionName);
  154 |       await exploreBtn.scrollIntoViewIfNeeded();
  155 |       await exploreBtn.hover();
  156 |       await exploreBtn.click();
  157 |     });
  158 |   }
  159 | 
  160 |   async verifyRegionCardVisible(regionName: string) {
  161 |     await test.step(`Verify ${regionName} card is visible`, async () => {
  162 |       await expect(this.homePageLocators.regionCard(regionName)).toBeVisible();
  163 |     });
  164 |   }
  165 | 
  166 |   async verifyRegionHeadingVisible(regionName: string) {
  167 |     await test.step(`Verify ${regionName} heading is visible`, async () => {
  168 |       await expect(this.homePageLocators.regionHeading(regionName)).toBeVisible();
  169 |     });
  170 |   }
  171 | 
  172 |   async scrollToPopularDestinations() {
  173 |     await test.step('Scroll to Popular Destinations section', async () => {
  174 |       await this.homePageLocators.hdgPopularDestinations.scrollIntoViewIfNeeded();
  175 |     });
  176 |   }
  177 | 
  178 |   async verifyHeroBannerVisible() {
  179 |     await test.step('Verify Hero Banner is visible', async () => {
  180 |       await expect(this.homePageLocators.hdgHeroBanner).toBeVisible();
  181 |     });
  182 |   }
  183 | 
  184 |   async clickSeeOfferTerms() {
  185 |     await test.step('Click See Offer Terms link', async () => {
  186 |       await this.homePageLocators.lnkSeeOfferTerms.scrollIntoViewIfNeeded();
  187 |       await this.homePageLocators.lnkSeeOfferTerms.hover();
  188 |       await this.homePageLocators.lnkSeeOfferTerms.click();
  189 |     });
  190 |   }
```