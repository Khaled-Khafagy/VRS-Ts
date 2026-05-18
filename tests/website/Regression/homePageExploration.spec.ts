import { test } from '../../../fixtures/page-manager';
import { AppUrls } from '../../../data/credentials';

test.describe('Homepage Exploration', () => {
    test('Homepage hero banner is visible', async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.verifyHeroBannerVisible();
    });

    test('See offer terms link is visible on homepage', async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.verifySeeOfferTermsLinkVisible();
    });

    test('Header navigation links are visible', async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.verifyHeaderNavigationLinksVisible();
    });

    test('Regions tab is selected by default', async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.scrollToPopularDestinations();
        await homePage.verifyRegionsTabIsActive();
    });

    test('Switch from Regions tab to Countries tab', async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.scrollToPopularDestinations();
        await homePage.verifyRegionsTabIsActive();
        await homePage.switchToCountriesTab();
        await homePage.verifyCountriesTabIsActive();
    });

    test('Switch back from Countries tab to Regions tab', async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.scrollToPopularDestinations();
        await homePage.switchToCountriesTab();
        await homePage.switchToRegionsTab();
        await homePage.verifyRegionsTabIsActive();
    });

    test('All destination region cards are visible', async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.scrollToPopularDestinations();
        await homePage.verifyRegionCardVisible('Europe');
        await homePage.verifyRegionCardVisible('North America');
        await homePage.verifyRegionCardVisible('Africa');
        await homePage.verifyRegionCardVisible('Asia');
        await homePage.verifyRegionCardVisible('Middle East');
        await homePage.verifyRegionCardVisible('Caribbean');
    });

    test('All destination countries cards are visible', async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.scrollToPopularDestinations();
        await homePage.switchToCountriesTab();
        await homePage.verifyAllCountryCardsVisible();
    });

    test('Navigate to Europe destination from homepage', async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.scrollToPopularDestinations();
        await homePage.exploreRegion('Europe');
        await homePage.verifyNavigationToRegionPage('Europe');
    });

    test('Navigate to North America destination from homepage', async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.scrollToPopularDestinations();
        await homePage.exploreRegion('North America');
        await homePage.verifyNavigationToRegionPage('North America');
    });

    test('Navigate to Africa destination from homepage', async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.scrollToPopularDestinations();
        await homePage.exploreRegion('Africa');
        await homePage.verifyNavigationToRegionPage('Africa');
    });

    test('Navigate to Asia destination from homepage', async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.scrollToPopularDestinations();
        await homePage.exploreRegion('Asia');
        await homePage.verifyNavigationToRegionPage('Asia');
    });

    test('Navigate to Middle East destination from homepage', async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.scrollToPopularDestinations();
        await homePage.exploreRegion('Middle East');
        await homePage.verifyNavigationToRegionPage('Middle East');
    });

    test('Navigate to Caribbean destination from homepage', async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.scrollToPopularDestinations();
        await homePage.exploreRegion('Caribbean');
        await homePage.verifyNavigationToRegionPage('Caribbean');
    });

    test('Search input is visible with correct placeholder', async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.verifySearchInputVisible();
        await homePage.verifySearchInputPlaceholder();
    });

    test('Search button is disabled initially', async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.verifySearchButtonDisabled();
    });

    test('Typing in search input enables the search button', async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.verifySearchButtonDisabled();
        await homePage.searchForCountry('France');
        await homePage.verifySearchButtonEnabled();
    });

    test('Clearing search input resets to empty state', async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.searchForCountry('Italy');
        await homePage.clearSearchInput();
        await homePage.verifySearchInputIsEmpty();
    });
});
