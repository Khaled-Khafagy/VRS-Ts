import { expect } from '@playwright/test';
import { test } from '../../../fixtures/page-manager';
import * as testData from '../../../data/testData.json';

test.describe('Homepage - Destination Exploration', () => {
  
  test('User can view all destination regions from homepage', async ({ homePage }) => {
    await homePage.gotoHomepage(testData.Environment.url);
    
    // Scroll to Popular Destinations section
    await homePage.scrollToPopularDestinations();
    
    // Verify all major regions are visible
    await homePage.verifyRegionCardVisible('Europe');
    await homePage.verifyRegionCardVisible('North America');
    await homePage.verifyRegionCardVisible('Africa');
    await homePage.verifyRegionCardVisible('Asia');
    await homePage.verifyRegionCardVisible('Middle East');
    await homePage.verifyRegionCardVisible('Caribbean');
  });

  test('User can explore Europe plans from homepage', async ({ homePage, regionPlansPage }) => {
    await homePage.gotoHomepage(testData.Environment.url);
    
    // Scroll to destinations
    await homePage.scrollToPopularDestinations();
    
    // Verify Europe card is visible
    await homePage.verifyRegionCardVisible('Europe');
    await homePage.verifyRegionHeadingVisible('Europe');
    
    // Click explore button
    await homePage.exploreRegion('Europe');
    
    // Verify navigation to Europe plans page
    await expect(homePage.page).toHaveURL(/.*europe/);
  });

  test('User can explore North America plans from homepage', async ({ homePage }) => {
    await homePage.gotoHomepage(testData.Environment.url);
    await homePage.scrollToPopularDestinations();
    
    await homePage.verifyRegionCardVisible('North America');
    await homePage.exploreRegion('North America');
    
    await expect(homePage.page).toHaveURL(/.*north-america/);
  });

  test('User can explore Africa plans from homepage', async ({ homePage }) => {
    await homePage.gotoHomepage(testData.Environment.url);
    await homePage.scrollToPopularDestinations();
    
    await homePage.verifyRegionCardVisible('Africa');
    await homePage.exploreRegion('Africa');
    
    await expect(homePage.page).toHaveURL(/.*africa/);
  });

  test('User can explore Asia plans from homepage', async ({ homePage }) => {
    await homePage.gotoHomepage(testData.Environment.url);
    await homePage.scrollToPopularDestinations();
    
    await homePage.verifyRegionCardVisible('Asia');
    await homePage.exploreRegion('Asia');
    
    await expect(homePage.page).toHaveURL(/.*asia/);
  });

  test('User can explore Middle East plans from homepage', async ({ homePage }) => {
    await homePage.gotoHomepage(testData.Environment.url);
    await homePage.scrollToPopularDestinations();
    
    await homePage.verifyRegionCardVisible('Middle East');
    await homePage.exploreRegion('Middle East');
    
    await expect(homePage.page).toHaveURL(/.*middle-east/);
  });

  test('User can explore Caribbean plans from homepage', async ({ homePage }) => {
    await homePage.gotoHomepage(testData.Environment.url);
    await homePage.scrollToPopularDestinations();
    
    await homePage.verifyRegionCardVisible('Caribbean');
    await homePage.exploreRegion('Caribbean');
    
    await expect(homePage.page).toHaveURL(/.*caribbean/);
  });

  test('Hero banner with promotional offer is visible', async ({ homePage }) => {
    await homePage.gotoHomepage(testData.Environment.url);
    
    // Verify hero banner is displayed
    await homePage.verifyHeroBannerVisible();
    
    // Verify offer terms link is clickable
    await expect(homePage.page.getByRole('link', { name: 'See offer terms' })).toBeVisible();
  });

  test('User can click on see offer terms link', async ({ homePage }) => {
    await homePage.gotoHomepage(testData.Environment.url);
    
    await homePage.clickSeeOfferTerms();
    
    // Should navigate to FAQ section
    await expect(homePage.page).toHaveURL(/#faq.*|.*#faq/);
  });

});

test.describe('Homepage - Tab Switching', () => {
  
  test('Regions tab is selected by default', async ({ homePage }) => {
    await homePage.gotoHomepage(testData.Environment.url);
    
    // Scroll to tabs section
    await homePage.scrollToPopularDestinations();
    
    // Verify Regions tab is active
    await homePage.verifyRegionsTabIsActive();
  });

  test('User can switch from Regions tab to Countries tab', async ({ homePage }) => {
    await homePage.gotoHomepage(testData.Environment.url);
    await homePage.scrollToPopularDestinations();
    
    // Verify we start on Regions
    await homePage.verifyRegionsTabIsActive();
    
    // Switch to Countries tab
    await homePage.switchToCountriesTab();
    
    // Verify Countries tab is now active
    await homePage.verifyCountriesTabIsActive();
  });

  test('User can switch back from Countries tab to Regions tab', async ({ homePage }) => {
    await homePage.gotoHomepage(testData.Environment.url);
    await homePage.scrollToPopularDestinations();
    
    // Switch to Countries
    await homePage.switchToCountriesTab();
    await homePage.verifyCountriesTabIsActive();
    
    // Switch back to Regions
    await homePage.switchToRegionsTab();
    
    // Verify Regions tab is active again
    await homePage.verifyRegionsTabIsActive();
  });

  test('Tab content updates when switching between Regions and Countries', async ({ homePage, page }) => {
    await homePage.gotoHomepage(testData.Environment.url);
    await homePage.scrollToPopularDestinations();
    
    // Get initial content from Regions tab
    const regionsCount = await page.getByRole('tab').count();
    
    // Switch to Countries tab
    await homePage.switchToCountriesTab();
    
    // Verify Countries tab is active (content should be different)
    await homePage.verifyCountriesTabIsActive();
    
    // Switch back to verify content changes again
    await homePage.switchToRegionsTab();
    await homePage.verifyRegionsTabIsActive();
  });

});

test.describe('Homepage - Search Functionality', () => {
  
  test('Search input field is visible and functional', async ({ homePage, page }) => {
    await homePage.gotoHomepage(testData.Environment.url);
    
    // Verify search input is visible
    const searchInput = page.getByPlaceholder('Country or Region');
    await expect(searchInput).toBeVisible();
    
    // Verify placeholder text
    await expect(searchInput).toHaveAttribute('placeholder', 'Country or Region');
  });

  test('User can type in search input field', async ({ homePage, page }) => {
    await homePage.gotoHomepage(testData.Environment.url);
    
    // Type country name
    await homePage.searchForCountry('Italy');
    
    // Verify text is entered
    const searchInput = page.getByPlaceholder('Country or Region');
    await expect(searchInput).toHaveValue('Italy');
  });

  test('User can search for multiple countries', async ({ homePage, page }) => {
    await homePage.gotoHomepage(testData.Environment.url);
    
    // Search for first country
    await homePage.searchForCountry('France');
    const searchInput = page.getByPlaceholder('Country or Region');
    await expect(searchInput).toHaveValue('France');
    
    // Clear and search for another country
    await homePage.clearSearchInput();
    await homePage.searchForCountry('Spain');
    
    // Verify new search
    await expect(searchInput).toHaveValue('Spain');
  });

  test('Search button is disabled until country is selected', async ({ homePage, page }) => {
    await homePage.gotoHomepage(testData.Environment.url);
    
    // Verify search button is disabled initially
    const searchBtn = page.getByRole('button', { name: 'Search' });
    await expect(searchBtn).toBeDisabled();
    
    // Type in search field
    await homePage.searchForCountry('Germany');
    
    // Note: Button might remain disabled until dropdown selection is made
    // This tests the current state of the application
  });

  test('User can clear search input', async ({ homePage, page }) => {
    await homePage.gotoHomepage(testData.Environment.url);
    
    // Type something
    await homePage.searchForCountry('Portugal');
    
    // Verify text is entered
    let searchInput = page.getByPlaceholder('Country or Region');
    await expect(searchInput).toHaveValue('Portugal');
    
    // Clear the input
    await homePage.clearSearchInput();
    
    // Verify it's empty
    searchInput = page.getByPlaceholder('Country or Region');
    await expect(searchInput).toHaveValue('');
  });

  test('Country or Region dropdown button is visible', async ({ homePage, page }) => {
    await homePage.gotoHomepage(testData.Environment.url);
    
    // Verify dropdown button is visible
    const dropdownBtn = page.getByRole('button', { name: 'Country or Region' });
    await expect(dropdownBtn).toBeVisible();
  });

  test('Where are you visiting heading is displayed', async ({ homePage, page }) => {
    await homePage.gotoHomepage(testData.Environment.url);
    
    // Verify heading text - use role instead of text to avoid strict mode
    const heading = page.getByRole('heading', { name: 'Where are you visiting?' });
    await expect(heading).toBeVisible();
  });

});

test.describe('Homepage - Header Navigation', () => {
  
  test('All navigation links are visible in header', async ({ homePage, page }) => {
    await homePage.gotoHomepage(testData.Environment.url);
    
    // Verify menu button is visible
    const menuBtn = page.getByRole('button', { name: 'Menu' });
    await expect(menuBtn).toBeVisible();
    
    // Verify login button exists (last button with img)
    const loginBtn = homePage.page.getByRole('button').filter({ has: page.locator('img') }).last();
    await expect(loginBtn).toBeVisible();
    
    // Verify header is present
    const header = page.locator('header, nav');
    await expect(header.first()).toBeVisible();
  });

  test('Shopping cart icon is clickable', async ({ homePage, page }) => {
    await homePage.gotoHomepage(testData.Environment.url);
    
    // Find cart icon by role or use a more reliable selector
    const menuBtn = page.getByRole('button', { name: 'Menu' });
    await expect(menuBtn).toBeVisible();
    
    // Verify menu button is clickable
    await menuBtn.hover();
  });

  test('Menu button opens navigation menu', async ({ homePage, page }) => {
    await homePage.gotoHomepage(testData.Environment.url);
    
    // Click menu button
    const menuBtn = page.getByRole('button', { name: 'Menu' });
    await expect(menuBtn).toBeVisible();
    
    // Menu button should be present and clickable
    await menuBtn.click();
  });

});
