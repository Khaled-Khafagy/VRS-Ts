# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: website/Regression/ourDestinationsExploration.spec.ts >> Navigating to Europe destination loads Europe plans page
- Location: tests/website/Regression/ourDestinationsExploration.spec.ts:89:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Europe', level: 3 })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: 'Europe', level: 3 })

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
            - textbox "Where are you visiting?" [ref=e76]
            - button "Where are you visiting?" [ref=e77]:
              - img [ref=e78]
          - button "Search" [disabled] [ref=e82]:
            - text: Search
            - img [ref=e83]
        - generic [ref=e87]:
          - tablist [ref=e90]:
            - tab "Regions" [selected] [ref=e91] [cursor=pointer]
            - tab "Countries" [ref=e92] [cursor=pointer]
          - tabpanel "Regions"
        - generic [ref=e95]:
          - article "undefined" [ref=e98]:
            - img "Africa" [ref=e100]
            - generic [ref=e102]:
              - heading "Africa" [level=3] [ref=e104]
              - paragraph [ref=e106]: Plans from $12
            - link "Explore" [ref=e108] [cursor=pointer]:
              - /url: /our-destinations/africa
              - text: Explore
              - img [ref=e109]
          - article "undefined" [ref=e114]:
            - img "Asia" [ref=e116]
            - generic [ref=e118]:
              - heading "Asia" [level=3] [ref=e120]
              - paragraph [ref=e122]: Plans from $8.5
            - link "Explore" [ref=e124] [cursor=pointer]:
              - /url: /our-destinations/asia
              - text: Explore
              - img [ref=e125]
          - article "undefined" [ref=e130]:
            - img "Caribbean" [ref=e132]
            - generic [ref=e134]:
              - heading "Caribbean" [level=3] [ref=e136]
              - paragraph [ref=e138]: Plans from $8.5
            - link "Explore" [ref=e140] [cursor=pointer]:
              - /url: /our-destinations/caribbean
              - text: Explore
              - img [ref=e141]
          - article "undefined" [ref=e146]:
            - img "Europe" [ref=e148]
            - generic [ref=e150]:
              - heading "Europe" [level=3] [ref=e152]
              - paragraph [ref=e154]: Plans from $5
            - link "Explore" [ref=e156] [cursor=pointer]:
              - /url: /our-destinations/europe
              - text: Explore
              - img [ref=e157]
          - article "undefined" [ref=e162]:
            - img "Latin America" [ref=e164]
            - generic [ref=e166]:
              - heading "Latin America" [level=3] [ref=e168]
              - paragraph [ref=e170]: Plans from $8.5
            - link "Explore" [ref=e172] [cursor=pointer]:
              - /url: /our-destinations/latin-america
              - text: Explore
              - img [ref=e173]
          - article "undefined" [ref=e178]:
            - img "Middle East" [ref=e180]
            - generic [ref=e182]:
              - heading "Middle East" [level=3] [ref=e184]
              - paragraph [ref=e186]: Plans from $8.5
            - link "Explore" [ref=e188] [cursor=pointer]:
              - /url: /our-destinations/middle-east
              - text: Explore
              - img [ref=e189]
          - article "undefined" [ref=e194]:
            - img "North America" [ref=e196]
            - generic [ref=e198]:
              - heading "North America" [level=3] [ref=e200]
              - paragraph [ref=e202]: Plans from $7.5
            - link "Explore" [ref=e204] [cursor=pointer]:
              - /url: /our-destinations/north-america
              - text: Explore
              - img [ref=e205]
          - article "undefined" [ref=e210]:
            - img "Oceania" [ref=e212]
            - generic [ref=e214]:
              - heading "Oceania" [level=3] [ref=e216]
              - paragraph [ref=e218]: Plans from $7.5
            - link "Explore" [ref=e220] [cursor=pointer]:
              - /url: /our-destinations/oceania
              - text: Explore
              - img [ref=e221]
    - generic [ref=e229]:
      - list [ref=e230]:
        - listitem [ref=e231]:
          - list [ref=e232]:
            - listitem [ref=e233]:
              - button "Terms & Conditions" [ref=e234] [cursor=pointer]
              - separator [ref=e235]
            - listitem [ref=e236]:
              - button "Privacy Policy" [ref=e237] [cursor=pointer]
              - separator [ref=e238]
            - listitem [ref=e239]:
              - button "Cookie Policy" [ref=e240] [cursor=pointer]
              - separator [ref=e241]
            - listitem [ref=e242]:
              - button "Charges Guide" [ref=e243] [cursor=pointer]
              - separator [ref=e244]
            - listitem [ref=e245]:
              - button "Acceptable Usage Policy" [ref=e246] [cursor=pointer]
              - separator [ref=e247]
            - listitem [ref=e248]:
              - button "Ad Choices" [ref=e249] [cursor=pointer]
        - listitem [ref=e250]:
          - list [ref=e251]:
            - listitem [ref=e252]:
              - button "eSIM Installation Guide" [ref=e253] [cursor=pointer]
              - separator [ref=e254]
            - listitem [ref=e255]:
              - button "Help" [ref=e256] [cursor=pointer]
              - separator [ref=e257]
            - listitem [ref=e258]:
              - button "Contact us or Leave us" [ref=e259] [cursor=pointer]
      - paragraph [ref=e260]: "Vodafone Global Connect S.à r.l. is registered in the Grand Duchy of Luxembourg. R.C.S Luxembourg No. B144677. Registered Office: 15 rue Edward Steichen, L-2540 Luxembourg, Grand Duchy of Luxembourg. VAT LU29846245"
  - generic "TOBi chatbot over minimised" [ref=e261] [cursor=pointer]:
    - button "Click here to talk to tobi" [ref=e262]
    - generic [ref=e263]: Hi, I'm Tobi, your virtual agent. How can I help you today?
    - button "Minimise the TOBi floating area." [ref=e264]
```

# Test source

```ts
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
> 249 |       await expect(heading).toBeVisible();
      |                             ^ Error: expect(locator).toBeVisible() failed
  250 |     });
  251 |   }
  252 | 
  253 |   async verifyAllDestinationCardsVisible() {
  254 |     await test.step('Verify all region destination cards are visible', async () => {
  255 |       const regions = ['Africa', 'Asia', 'Caribbean', 'Europe', 'Latin America', 'Middle East', 'North America', 'Oceania'];
  256 |       for (const region of regions) {
  257 |         await expect(this.page.getByRole('heading', { level: 3, name: region })).toBeVisible();
  258 |       }
  259 |     });
  260 |   }
  261 | 
  262 |   // async verifyDestinationImageVisible(destinationName: string) {
  263 |   //   await test.step(`Verify ${destinationName} card has image`, async () => {
  264 |   //     const image = this.page.getByAltText(destinationName);
  265 |   //     await expect(image).toBeVisible();
  266 |   //   });
  267 |   // }
  268 | 
  269 |   async verifyDestinationHeadingVisible(destinationName: string) {
  270 |     await test.step(`Verify ${destinationName} heading is visible`, async () => {
  271 |       const heading = this.page.getByRole('heading', { level: 3, name: destinationName });
  272 |       await expect(heading).toBeVisible();
  273 |     });
  274 |   }
  275 | 
  276 |   async verifyDestinationPricingVisible(destinationName: string) {
  277 |     await test.step(`Verify ${destinationName} card shows pricing`, async () => {
  278 |       const pricing = this.ourDestinationsLocators.destinationCard(destinationName).locator('p');
  279 |       await expect(pricing).toBeVisible();
  280 |     });
  281 |   }
  282 | 
  283 |   async verifyDestinationPricingFormat(destinationName: string) {
  284 |     await test.step(`Verify ${destinationName} pricing has correct format`, async () => {
  285 |       const pricing = this.ourDestinationsLocators.destinationPricing(destinationName);
  286 |       const priceText = await pricing.textContent();
  287 |       expect(priceText).toMatch(/Plans from \$\d+/);
  288 |     });
  289 |   }
  290 | 
  291 |   async verifyExploreButtonVisible(destinationName: string) {
  292 |     await test.step(`Verify Explore button is visible for ${destinationName}`, async () => {
  293 |       const slug = destinationName.toLowerCase().replace(/ /g, '-');
  294 |       await expect(this.page.locator(`a[href="/our-destinations/${slug}"]`)).toBeVisible();
  295 |     });
  296 |   }
  297 | 
  298 |   async clickExploreButton(destinationName: string) {
  299 |     await test.step(`Click Explore button for ${destinationName}`, async () => {
  300 |       const slug = destinationName.toLowerCase().replace(/ /g, '-');
  301 |       await this.page.locator(`a[href="/our-destinations/${slug}"]`).click();
  302 |     });
  303 |   }
  304 | 
  305 |   async navigateToDestination(destinationName: string) {
  306 |     await test.step(`Navigate to ${destinationName} destination page`, async () => {
  307 |       await this.verifyDestinationCardVisible(destinationName);
  308 |       await this.clickExploreButton(destinationName);
  309 |     });
  310 |   }
  311 | 
  312 |   async verifyDestinationCardLayout(destinationName: string) {
  313 |     await test.step(`Verify ${destinationName} card has complete layout`, async () => {
  314 |       await this.verifyDestinationHeadingVisible(destinationName);
  315 |       await this.verifyDestinationPricingVisible(destinationName);
  316 |       await this.verifyExploreButtonVisible(destinationName);
  317 |     });
  318 |   }
  319 | 
  320 |   async verifyNavigationToDestinationPage(destinationName: string) {
  321 |     await test.step(`Verify navigation to ${destinationName} destination page`, async () => {
  322 |       const slug = destinationName.toLowerCase().replace(/ /g, '-');
  323 |       await expect(this.page).toHaveURL(new RegExp(`.*our-destinations/${slug}`));
  324 |     });
  325 |   }
  326 | 
  327 |   async verifyHomePageLoaded() {
  328 |     await test.step('Verify navigation back to homepage', async () => {
  329 |       await expect(this.page).toHaveURL(/.*vrs.preprod.travel.vodafone.com\/?(\?.*)?$/);
  330 |     });
  331 |   }
  332 | 
  333 |   async verifyCountriesTabHasContent() {
  334 |     await test.step('Verify Countries tab shows individual country cards', async () => {
  335 |       await expect(this.page.getByRole('heading', { level: 3, name: 'Afghanistan' })).toBeVisible();
  336 |     });
  337 |   }
  338 | }
  339 | 
```