# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: website/Regression/ourDestinationsExploration.spec.ts >> Typing in search input shows autocomplete dropdown
- Location: tests/website/Regression/ourDestinationsExploration.spec.ts:65:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  getByText('France', { exact: true }).first()
Expected: visible
Received: hidden
Timeout:  3000ms

Call log:
  - Expect "toBeVisible" with timeout 3000ms
  - waiting for getByText('France', { exact: true }).first()
    - found getByRole('button', { name: 'Accept All Cookies' }), intercepting action to run the handler
    - locator handler has finished, waiting for getByRole('button', { name: 'Accept All Cookies' }) to be hidden
    6 × locator resolved to visible <button class="teal-binded" id="onetrust-accept-btn-handler">Accept All Cookies</button>
    - interception handler has finished, continuing
    5 × locator resolved to <h3>France</h3>
      - unexpected value "hidden"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - navigation "Main navigation" [ref=e7]:
      - link "Top Navigation Logo" [ref=e8] [cursor=pointer]:
        - /url: /
        - img "Top Navigation Logo" [ref=e9]
      - list [ref=e12]:
        - listitem [ref=e13]:
          - link "Homepage" [ref=e14] [cursor=pointer]:
            - /url: /
            - text: Homepage
        - listitem [ref=e15]:
          - link "Our Destinations" [ref=e16] [cursor=pointer]:
            - /url: /our-destinations
            - text: Our Destinations
        - listitem [ref=e17]:
          - link "UEFA Champions League" [ref=e18] [cursor=pointer]:
            - /url: /our-destinations/uefachampionsleague
            - text: UEFA Champions League
        - listitem [ref=e19]:
          - link "About eSIM" [ref=e20] [cursor=pointer]:
            - /url: /#how-it-works
            - text: About eSIM
        - listitem [ref=e21]:
          - link "Help" [ref=e22] [cursor=pointer]:
            - /url: /help-support
            - text: Help
        - listitem [ref=e23]:
          - link "Blog" [ref=e24] [cursor=pointer]:
            - /url: /blog
            - text: Blog
      - list [ref=e25]:
        - listitem [ref=e26]:
          - img "Shopping Cart" [ref=e29] [cursor=pointer]
        - listitem [ref=e32]:
          - generic [ref=e35] [cursor=pointer]:
            - img [ref=e36]
            - link "English | US Dollar" [ref=e53]
        - listitem [ref=e54]:
          - button "Login" [ref=e55] [cursor=pointer]
    - main [ref=e56]:
      - generic [ref=e58]:
        - generic [ref=e60]:
          - button "Back button" [ref=e62] [cursor=pointer]:
            - img [ref=e66]
          - heading "Let's pick your destination" [level=1] [ref=e69]
        - generic [ref=e71]:
          - generic [ref=e75]:
            - textbox "Where are you visiting?" [ref=e76]: France
            - button "Where are you visiting?" [ref=e77]:
              - img [ref=e78]
              - img [ref=e82] [cursor=pointer]
          - button "Search" [ref=e86] [cursor=pointer]:
            - text: Search
            - img [ref=e87]
        - generic [ref=e91]:
          - tablist [ref=e94]:
            - tab "Regions" [selected] [ref=e95] [cursor=pointer]
            - tab "Countries" [ref=e96] [cursor=pointer]
          - tabpanel "Regions"
        - generic [ref=e99]:
          - article "undefined" [ref=e102]:
            - img "Africa" [ref=e104]
            - generic [ref=e106]:
              - heading "Africa" [level=3] [ref=e108]
              - paragraph [ref=e110]: Plans from $12
            - link "Explore" [ref=e112] [cursor=pointer]:
              - /url: /our-destinations/africa
              - text: Explore
              - img [ref=e113]
          - article "undefined" [ref=e118]:
            - img "Asia" [ref=e120]
            - generic [ref=e122]:
              - heading "Asia" [level=3] [ref=e124]
              - paragraph [ref=e126]: Plans from $8.5
            - link "Explore" [ref=e128] [cursor=pointer]:
              - /url: /our-destinations/asia
              - text: Explore
              - img [ref=e129]
          - article "undefined" [ref=e134]:
            - img "Caribbean" [ref=e136]
            - generic [ref=e138]:
              - heading "Caribbean" [level=3] [ref=e140]
              - paragraph [ref=e142]: Plans from $8.5
            - link "Explore" [ref=e144] [cursor=pointer]:
              - /url: /our-destinations/caribbean
              - text: Explore
              - img [ref=e145]
          - article "undefined" [ref=e150]:
            - img "Europe" [ref=e152]
            - generic [ref=e154]:
              - heading "Europe" [level=3] [ref=e156]
              - paragraph [ref=e158]: Plans from $5
            - link "Explore" [ref=e160] [cursor=pointer]:
              - /url: /our-destinations/europe
              - text: Explore
              - img [ref=e161]
          - article "undefined" [ref=e166]:
            - img "Latin America" [ref=e168]
            - generic [ref=e170]:
              - heading "Latin America" [level=3] [ref=e172]
              - paragraph [ref=e174]: Plans from $8.5
            - link "Explore" [ref=e176] [cursor=pointer]:
              - /url: /our-destinations/latin-america
              - text: Explore
              - img [ref=e177]
          - article "undefined" [ref=e182]:
            - img "Middle East" [ref=e184]
            - generic [ref=e186]:
              - heading "Middle East" [level=3] [ref=e188]
              - paragraph [ref=e190]: Plans from $8.5
            - link "Explore" [ref=e192] [cursor=pointer]:
              - /url: /our-destinations/middle-east
              - text: Explore
              - img [ref=e193]
          - article "undefined" [ref=e198]:
            - img "North America" [ref=e200]
            - generic [ref=e202]:
              - heading "North America" [level=3] [ref=e204]
              - paragraph [ref=e206]: Plans from $7.5
            - link "Explore" [ref=e208] [cursor=pointer]:
              - /url: /our-destinations/north-america
              - text: Explore
              - img [ref=e209]
          - article "undefined" [ref=e214]:
            - img "Oceania" [ref=e216]
            - generic [ref=e218]:
              - heading "Oceania" [level=3] [ref=e220]
              - paragraph [ref=e222]: Plans from $7.5
            - link "Explore" [ref=e224] [cursor=pointer]:
              - /url: /our-destinations/oceania
              - text: Explore
              - img [ref=e225]
  - generic "TOBi chatbot over minimised" [ref=e228] [cursor=pointer]:
    - button "Click here to talk to tobi" [ref=e229]
    - generic [ref=e230]: Hi, I'm Tobi, your virtual agent. How can I help you today?
    - button "Minimise the TOBi floating area." [ref=e231]
  - generic [ref=e232] [cursor=pointer]:
    - button "Manage Cookies" [ref=e234]
    - text: Manage Cookies
```

# Test source

```ts
  48  |     btnExploreAfrica: this.page.locator('a[href="/our-destinations/africa"]'),
  49  |     btnExploreAmericanSamoa: this.page.locator('a[href="/our-destinations/american-samoa"]'),
  50  |     btnExploreAsia: this.page.locator('a[href="/our-destinations/asia"]'),
  51  |     btnExploreCaribbean: this.page.locator('a[href="/our-destinations/caribbean"]'),
  52  |     btnExploreEurope: this.page.locator('a[href="/our-destinations/europe"]'),
  53  |     btnExploreLatinAmerica: this.page.locator('a[href="/our-destinations/latin-america"]'),
  54  |     btnExploreMiddleEast: this.page.locator('a[href="/our-destinations/middle-east"]'),
  55  |     btnExploreNorthAmerica: this.page.locator('a[href="/our-destinations/north-america"]'),
  56  |     btnExploreOceania: this.page.locator('a[href="/our-destinations/oceania"]'),
  57  | 
  58  |     // Search Results/Autocomplete
  59  |     searchResultItem: (itemName: string) => this.page.getByText(itemName).locator('..').filter({ hasText: itemName }),
  60  |     searchResultsCountriesSection: this.page.getByText('Countries'),
  61  |     searchResultsRegionsSection: this.page.getByText('Regions'),
  62  |   };
  63  | 
  64  |   constructor(page: Page) {
  65  |     super(page);
  66  |   }
  67  | 
  68  |   async gotoOurDestinationsPage(URL: string) {
  69  |     await test.step('Navigate to Our Destinations Page', async () => {
  70  |       await this.navigateToUrl(URL);
  71  |     });
  72  |   }
  73  | 
  74  |   // ============ HEADER NAVIGATION ============
  75  | 
  76  |   async verifyHeaderNavigationLinks() {
  77  |     await test.step('Verify all header navigation links are visible', async () => {
  78  |       await expect(this.ourDestinationsLocators.lnkHomepage).toBeVisible();
  79  |       await expect(this.ourDestinationsLocators.lnkOurDestinations).toBeVisible();
  80  |       await expect(this.ourDestinationsLocators.lnkUefaChampionsLeague).toBeVisible();
  81  |       await expect(this.ourDestinationsLocators.lnkAboutEsim).toBeVisible();
  82  |       await expect(this.ourDestinationsLocators.lnkHelp).toBeVisible();
  83  |       await expect(this.ourDestinationsLocators.lnkBlog).toBeVisible();
  84  |     });
  85  |   }
  86  | 
  87  |   async clickHomePageLink() {
  88  |     await test.step('Click Homepage link in header', async () => {
  89  |       const homeLink = this.ourDestinationsLocators.lnkHomepage;
  90  |       await homeLink.scrollIntoViewIfNeeded();
  91  |       await homeLink.hover();
  92  |       await homeLink.click();
  93  |     });
  94  |   }
  95  | 
  96  |   async clickBackButton() {
  97  |     await test.step('Click Back button', async () => {
  98  |       const backBtn = this.ourDestinationsLocators.btnBack;
  99  |       await backBtn.scrollIntoViewIfNeeded();
  100 |       await backBtn.hover();
  101 |       await backBtn.click();
  102 |     });
  103 |   }
  104 | 
  105 |   // ============ PAGE TITLE & CONTENT ============
  106 | 
  107 |   async verifyPageTitle() {
  108 |     await test.step('Verify main page title is displayed', async () => {
  109 |       await expect(this.ourDestinationsLocators.hdgMainTitle).toBeVisible();
  110 |     });
  111 |   }
  112 | 
  113 |   async verifyBackButtonVisible() {
  114 |     await test.step('Verify back button is visible', async () => {
  115 |       await expect(this.ourDestinationsLocators.btnBack).toBeVisible();
  116 |     });
  117 |   }
  118 | 
  119 |   // ============ SEARCH FUNCTIONALITY ============
  120 | 
  121 |   async searchForDestination(destinationName: string) {
  122 |     await test.step(`Search for destination: ${destinationName}`, async () => {
  123 |       const searchInput = this.ourDestinationsLocators.inputSearchDestination;
  124 |       await searchInput.scrollIntoViewIfNeeded();
  125 |       await searchInput.hover();
  126 |       await searchInput.click();
  127 |       await searchInput.fill(destinationName);
  128 |       // Wait for autocomplete/dropdown to appear
  129 |       await this.page.waitForTimeout(500);
  130 |     });
  131 |   }
  132 | 
  133 |   async verifySearchInputVisible() {
  134 |     await test.step('Verify search input field is visible', async () => {
  135 |       await expect(this.ourDestinationsLocators.inputSearchDestination).toBeVisible();
  136 |     });
  137 |   }
  138 | 
  139 |   async verifySearchInputHasPlaceholder() {
  140 |     await test.step('Verify search input has correct placeholder', async () => {
  141 |       await expect(this.ourDestinationsLocators.inputSearchDestination)
  142 |         .toHaveAttribute('placeholder', 'Where are you visiting?');
  143 |     });
  144 |   }
  145 | 
  146 |   async verifySearchDropdownVisible(searchTerm: string) {
  147 |     await test.step(`Verify search dropdown shows results for "${searchTerm}"`, async () => {
> 148 |       await expect(this.page.getByText(searchTerm, { exact: true }).first()).toBeVisible({ timeout: 3000 });
      |                                                                              ^ Error: expect(locator).toBeVisible() failed
  149 |     });
  150 |   }
  151 | 
  152 |   async verifySearchShowsCountriesAndRegions() {
  153 |     await test.step('Verify search results show both Countries and Regions sections', async () => {
  154 |       await this.searchForDestination('A');
  155 |       await expect(this.page.getByText('Countries').first()).toBeVisible({ timeout: 3000 });
  156 |       await expect(this.page.getByText('Regions').first()).toBeVisible({ timeout: 3000 });
  157 |     });
  158 |   }
  159 | 
  160 |   async verifySearchInputIsEmpty() {
  161 |     await test.step('Verify search input is empty', async () => {
  162 |       await expect(this.ourDestinationsLocators.inputSearchDestination).toHaveValue('');
  163 |     });
  164 |   }
  165 | 
  166 |   async selectFromSearchResults(itemName: string) {
  167 |     await test.step(`Select "${itemName}" from search results`, async () => {
  168 |       const resultItem = this.page.locator('list [cursor=pointer]').filter({ 
  169 |         has: this.page.getByText(itemName, { exact: true }) 
  170 |       }).first();
  171 |       await resultItem.scrollIntoViewIfNeeded();
  172 |       await resultItem.hover();
  173 |       await resultItem.click();
  174 |     });
  175 |   }
  176 | 
  177 |   async clearSearchInput() {
  178 |     await test.step('Clear search input', async () => {
  179 |       const searchInput = this.ourDestinationsLocators.inputSearchDestination;
  180 |       await searchInput.scrollIntoViewIfNeeded();
  181 |       await searchInput.hover();
  182 |       await searchInput.clear();
  183 |     });
  184 |   }
  185 | 
  186 |   async verifySearchButtonDisabledInitially() {
  187 |     await test.step('Verify search button is disabled initially', async () => {
  188 |       await expect(this.ourDestinationsLocators.btnSearch).toBeDisabled();
  189 |     });
  190 |   }
  191 | 
  192 |   async clickSearchButton() {
  193 |     await test.step('Click Search button', async () => {
  194 |       const searchBtn = this.ourDestinationsLocators.btnSearch;
  195 |       await searchBtn.scrollIntoViewIfNeeded();
  196 |       await searchBtn.hover();
  197 |       await searchBtn.click();
  198 |     });
  199 |   }
  200 | 
  201 |   // ============ TAB NAVIGATION ============
  202 | 
  203 |   async verifyRegionsTabIsActive() {
  204 |     await test.step('Verify Regions tab is active by default', async () => {
  205 |       await expect(this.ourDestinationsLocators.tabRegions)
  206 |         .toHaveAttribute('aria-selected', 'true');
  207 |     });
  208 |   }
  209 | 
  210 |   async switchToCountriesTab() {
  211 |     await test.step('Switch to Countries tab', async () => {
  212 |       const countriesTab = this.ourDestinationsLocators.tabCountries;
  213 |       await countriesTab.scrollIntoViewIfNeeded();
  214 |       await countriesTab.hover();
  215 |       await countriesTab.click();
  216 |       await this.page.waitForTimeout(500);
  217 |     });
  218 |   }
  219 | 
  220 |   async switchToRegionsTab() {
  221 |     await test.step('Switch to Regions tab', async () => {
  222 |       const regionsTab = this.ourDestinationsLocators.tabRegions;
  223 |       await regionsTab.scrollIntoViewIfNeeded();
  224 |       await regionsTab.hover();
  225 |       await regionsTab.click();
  226 |       await this.page.waitForTimeout(500);
  227 |     });
  228 |   }
  229 | 
  230 |   async verifyCountriesTabIsActive() {
  231 |     await test.step('Verify Countries tab is active', async () => {
  232 |       await expect(this.ourDestinationsLocators.tabCountries)
  233 |         .toHaveAttribute('aria-selected', 'true');
  234 |     });
  235 |   }
  236 | 
  237 |   async verifyTabContent() {
  238 |     await test.step('Verify tab content is displayed', async () => {
  239 |       const destinationCards = this.ourDestinationsLocators.allDestinationCards;
  240 |       await expect(destinationCards.first()).toBeVisible();
  241 |     });
  242 |   }
  243 | 
  244 |   // ============ DESTINATION GRID ============
  245 | 
  246 |   async verifyDestinationCardVisible(destinationName: string) {
  247 |     await test.step(`Verify ${destinationName} destination card is visible`, async () => {
  248 |       const heading = this.page.getByRole('heading', { level: 3, name: destinationName });
```