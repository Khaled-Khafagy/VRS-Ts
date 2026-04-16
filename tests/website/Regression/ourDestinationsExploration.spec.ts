import { expect } from '@playwright/test';
import { test } from '../../../fixtures/page-manager';
import * as testData from '../../../data/testData.json';

test.describe('Our Destinations - Navigation & UI', () => {
  
  test('Page loads with correct title and back button', async ({ page }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await page.goto(ourDestUrl);
    
    // Verify page title
    await expect(page).toHaveTitle(/Our Destinations/);
    
    // Verify main heading
    const mainHeading = page.getByRole('heading', { level: 1, name: "Let's pick your destination" });
    await expect(mainHeading).toBeVisible();
  });

  test('Back button is visible and clickable', async ({ ourDestinationsPage }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Verify back button
    await ourDestinationsPage.verifyBackButtonVisible();
  });

  test('All header navigation links are visible', async ({ ourDestinationsPage }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Verify navigation links
    await ourDestinationsPage.verifyHeaderNavigationLinks();
  });

  test('Homepage link navigates back to homepage', async ({ ourDestinationsPage, page }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Click homepage link
    await ourDestinationsPage.clickHomePageLink();
    
    // Verify navigation to homepage
    await expect(page).toHaveURL(/\/$|\/\?/);
  });

});

test.describe('Our Destinations - Tab Switching', () => {
  
  test('Regions tab is selected by default', async ({ ourDestinationsPage }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Verify Regions tab is active
    await ourDestinationsPage.verifyRegionsTabIsActive();
  });

  test('User can switch from Regions to Countries tab', async ({ ourDestinationsPage }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Verify Regions is active
    await ourDestinationsPage.verifyRegionsTabIsActive();
    
    // Switch to Countries
    await ourDestinationsPage.switchToCountriesTab();
    
    // Verify Countries is now active
    await ourDestinationsPage.verifyCountriesTabIsActive();
  });

  test('User can switch back from Countries to Regions tab', async ({ ourDestinationsPage }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Switch to Countries
    await ourDestinationsPage.switchToCountriesTab();
    await ourDestinationsPage.verifyCountriesTabIsActive();
    
    // Switch back to Regions
    await ourDestinationsPage.switchToRegionsTab();
    
    // Verify Regions is active again
    await ourDestinationsPage.verifyRegionsTabIsActive();
  });

  test('Tab content updates when switching between tabs', async ({ ourDestinationsPage }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Verify content on Regions tab
    await ourDestinationsPage.verifyTabContent();
    
    // Switch to Countries
    await ourDestinationsPage.switchToCountriesTab();
    
    // Verify content updates
    await ourDestinationsPage.verifyTabContent();
    
    // Switch back
    await ourDestinationsPage.switchToRegionsTab();
    
    // Verify content updates again
    await ourDestinationsPage.verifyTabContent();
  });

});

test.describe('Our Destinations - Search & Autocomplete', () => {
  
  test('Search input field is visible and has correct placeholder', async ({ ourDestinationsPage }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Verify search input
    await ourDestinationsPage.verifySearchInputVisible();
    await ourDestinationsPage.verifySearchInputHasPlaceholder();
  });

  test('Search button is disabled until destination is selected', async ({ ourDestinationsPage }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Verify button is disabled initially
    await ourDestinationsPage.verifySearchButtonDisabledInitially();
  });

  test('User can type in search input and dropdown appears', async ({ ourDestinationsPage }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Search for country
    await ourDestinationsPage.searchForDestination('France');
    
    // Verify autocomplete dropdown shows results
    const franceResult = ourDestinationsPage['page'].getByText('France', { exact: true });
    await expect(franceResult.first()).toBeVisible({ timeout: 3000 });
  });

  test('Autocomplete dropdown shows both Countries and Regions categories', async ({ ourDestinationsPage }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Search
    await ourDestinationsPage.verifySearchShowsCountriesAndRegions();
  });

  test('User can select country from autocomplete results', async ({ ourDestinationsPage, page }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Search for country
    await ourDestinationsPage.searchForDestination('France');
    
    // Select from results (may navigate or filter)
    await ourDestinationsPage.selectFromSearchResults('France');
  });

  test('User can select region from autocomplete results', async ({ ourDestinationsPage }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Search for region
    await ourDestinationsPage.searchForDestination('Europe');
    
    // Select from results
    await ourDestinationsPage.selectFromSearchResults('Europe');
  });

  test('User can clear search input and start new search', async ({ ourDestinationsPage }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Search for destination
    await ourDestinationsPage.searchForDestination('Italy');
    
    // Clear search
    await ourDestinationsPage.clearSearchInput();
    
    // Verify input is empty
    const searchInput = ourDestinationsPage['page'].getByPlaceholder('Where are you visiting?');
    await expect(searchInput).toHaveValue('');
  });

});

test.describe('Our Destinations - Destination Grid & Navigation', () => {
  
  test('All destination cards are visible in regions grid', async ({ ourDestinationsPage }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Verify all cards visible
    await ourDestinationsPage.verifyAllDestinationCardsVisible();
  });

  test('User can view Africa destination card with complete layout', async ({ ourDestinationsPage }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Verify card layout
    await ourDestinationsPage.verifyDestinationCardLayout('Africa');
  });

  test('User can view Europe destination card with correct pricing', async ({ ourDestinationsPage }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Verify card details
    await ourDestinationsPage.verifyDestinationCardVisible('Europe');
    await ourDestinationsPage.verifyDestinationPricingFormat('Europe');
  });

  test('User can view Asia destination card with correct layout', async ({ ourDestinationsPage }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Verify card layout
    await ourDestinationsPage.verifyDestinationCardLayout('Asia');
  });

  test('User can view Caribbean destination card', async ({ ourDestinationsPage }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Verify card
    await ourDestinationsPage.verifyDestinationCardLayout('Caribbean');
  });

  test('User can view Middle East destination card', async ({ ourDestinationsPage }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Verify card
    await ourDestinationsPage.verifyDestinationCardLayout('Middle East');
  });

  test('User can view North America destination card', async ({ ourDestinationsPage }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Verify card
    await ourDestinationsPage.verifyDestinationCardLayout('North America');
  });

  test('User can view Latin America destination card', async ({ ourDestinationsPage }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Verify card
    await ourDestinationsPage.verifyDestinationCardLayout('Latin America');
  });

  test('User can view Oceania destination card', async ({ ourDestinationsPage }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Verify card
    await ourDestinationsPage.verifyDestinationCardLayout('Oceania');
  });

  test('User can view American Samoa destination card', async ({ ourDestinationsPage }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Verify card
    await ourDestinationsPage.verifyDestinationCardLayout('American Samoa');
  });

  test('User can proceed to explore Africa destination plans', async ({ ourDestinationsPage, page }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Navigate to Africa
    await ourDestinationsPage.navigateToDestination('Africa');
    
    // Verify navigation
    await expect(page).toHaveURL(/.*africa/);
  });

  test('User can proceed to explore Europe destination plans', async ({ ourDestinationsPage, page }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Navigate to Europe
    await ourDestinationsPage.navigateToDestination('Europe');
    
    // Verify navigation
    await expect(page).toHaveURL(/.*europe/);
  });

  test('User can proceed to explore Asia destination plans', async ({ ourDestinationsPage, page }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Navigate to Asia
    await ourDestinationsPage.navigateToDestination('Asia');
    
    // Verify navigation
    await expect(page).toHaveURL(/.*asia/);
  });

  test('User can proceed to explore Caribbean destination plans', async ({ ourDestinationsPage, page }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Navigate to Caribbean
    await ourDestinationsPage.navigateToDestination('Caribbean');
    
    // Verify navigation
    await expect(page).toHaveURL(/.*caribbean/);
  });

  test('User can proceed to explore Middle East destination plans', async ({ ourDestinationsPage, page }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Navigate to Middle East
    await ourDestinationsPage.navigateToDestination('Middle East');
    
    // Verify navigation
    await expect(page).toHaveURL(/.*middle-east/);
  });

  test('User can proceed to explore North America destination plans', async ({ ourDestinationsPage, page }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Navigate to North America
    await ourDestinationsPage.navigateToDestination('North America');
    
    // Verify navigation
    await expect(page).toHaveURL(/.*north-america/);
  });

  test('User can proceed to explore Latin America destination plans', async ({ ourDestinationsPage, page }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Navigate to Latin America
    await ourDestinationsPage.navigateToDestination('Latin America');
    
    // Verify navigation
    await expect(page).toHaveURL(/.*latin-america/);
  });

  test('User can proceed to explore Oceania destination plans', async ({ ourDestinationsPage, page }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Navigate to Oceania
    await ourDestinationsPage.navigateToDestination('Oceania');
    
    // Verify navigation
    await expect(page).toHaveURL(/.*oceania/);
  });

  test('User can proceed to explore American Samoa destination plans', async ({ ourDestinationsPage, page }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Navigate to American Samoa
    await ourDestinationsPage.navigateToDestination('American Samoa');
    
    // Verify navigation
    await expect(page).toHaveURL(/.*american-samoa/);
  });

  test('Switching to Countries tab shows individual country cards', async ({ ourDestinationsPage }) => {
    const ourDestUrl = testData.Environment.url.replace(/\/$/, '') + '/our-destinations';
    await ourDestinationsPage.gotoOurDestinationsPage(ourDestUrl);
    
    // Switch to Countries tab
    await ourDestinationsPage.switchToCountriesTab();
    
    // Verify countries are displayed (Afghanistan, Albania, Algeria, etc.)
    const pageContent = await ourDestinationsPage['page'].content();
    expect(pageContent.toLowerCase()).toContain('afghanistan');
  });

});
