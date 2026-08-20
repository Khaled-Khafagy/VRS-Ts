import { test } from '../../../fixtures/page-manager';
import { AppUrls } from '../../../data/credentials';

test.describe('Homepage Exploration', () => {
    test('Homepage hero banner is visible', { tag: ['@sanity', '@P2'] }, async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.verifyHeroBannerVisible();
    });

    test('Homepage stats bar is visible', { tag: ['@sanity', '@P3'] }, async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.verifyStatsBarVisible();
    });

    test('Header navigation links are visible', { tag: ['@sanity', '@P2'] }, async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.verifyHeaderNavigationLinksVisible();
    });

    test('Regions tab is selected by default', { tag: ['@sanity', '@P2'] }, async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.scrollToPopularDestinations();
        await homePage.verifyRegionsTabIsActive();
    });

    test('Switch from Regions tab to Countries tab', { tag: ['@sanity', '@P2'] }, async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.scrollToPopularDestinations();
        await homePage.verifyRegionsTabIsActive();
        await homePage.switchToCountriesTab();
        await homePage.verifyCountriesTabIsActive();
    });

    test('Switch back from Countries tab to Regions tab', { tag: ['@sanity', '@P3'] }, async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.scrollToPopularDestinations();
        await homePage.switchToCountriesTab();
        await homePage.switchToRegionsTab();
        await homePage.verifyRegionsTabIsActive();
    });

    test('All destination region cards are visible', { tag: ['@sanity', '@P2'] }, async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.scrollToPopularDestinations();
        await homePage.verifyRegionCardVisible('Europe');
        await homePage.verifyRegionCardVisible('North America');
        await homePage.verifyRegionCardVisible('Africa');
        await homePage.verifyRegionCardVisible('Asia');
        await homePage.verifyRegionCardVisible('Middle East');
        await homePage.verifyRegionCardVisible('Caribbean');
    });

    test('All destination countries cards are visible', { tag: ['@sanity', '@P2'] }, async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.scrollToPopularDestinations();
        await homePage.switchToCountriesTab();
        await homePage.verifyAllCountryCardsVisible();
    });

    test('Navigate to Europe destination from homepage', { tag: ['@sanity', '@P2'] }, async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.scrollToPopularDestinations();
        await homePage.exploreRegion('Europe');
        await homePage.verifyNavigationToRegionPage('Europe');
    });

    test('Navigate to North America destination from homepage', { tag: ['@sanity', '@P2'] }, async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.scrollToPopularDestinations();
        await homePage.exploreRegion('North America');
        await homePage.verifyNavigationToRegionPage('North America');
    });

    test('Navigate to Africa destination from homepage', { tag: ['@sanity', '@P2'] }, async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.scrollToPopularDestinations();
        await homePage.exploreRegion('Africa');
        await homePage.verifyNavigationToRegionPage('Africa');
    });

    test('Navigate to Asia destination from homepage', { tag: ['@sanity', '@P2'] }, async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.scrollToPopularDestinations();
        await homePage.exploreRegion('Asia');
        await homePage.verifyNavigationToRegionPage('Asia');
    });

    test('Navigate to Middle East destination from homepage', { tag: ['@sanity', '@P2'] }, async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.scrollToPopularDestinations();
        await homePage.exploreRegion('Middle East');
        await homePage.verifyNavigationToRegionPage('Middle East');
    });

    test('Navigate to Caribbean destination from homepage', { tag: ['@sanity', '@P2'] }, async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.scrollToPopularDestinations();
        await homePage.exploreRegion('Caribbean');
        await homePage.verifyNavigationToRegionPage('Caribbean');
    });

    test('Search input is visible with correct placeholder', { tag: ['@sanity', '@P2'] }, async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.verifySearchInputVisible();
        await homePage.verifySearchInputPlaceholder();
    });

    test('Find a plan button is disabled initially', { tag: ['@sanity', '@P3'] }, async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.verifyFindAPlanButtonDisabled();
    });

    test('Typing in search input enables the Find a plan button', { tag: ['@sanity', '@P3'] }, async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.verifyFindAPlanButtonDisabled();
        await homePage.searchForCountry('France');
        await homePage.verifyFindAPlanButtonEnabled();
    });

    test('Clearing search input resets to empty state', { tag: ['@sanity', '@P3'] }, async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.searchForCountry('Italy');
        await homePage.clearSearchInput();
        await homePage.verifySearchInputIsEmpty();
    });

    test('Hero carousel is visible with first slide active and Previous button disabled', { tag: ['@sanity', '@P2'] }, async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.verifyCarouselVisible();
        await homePage.verifyCarouselSlideActive(1);
        await homePage.verifyCarouselPreviousButtonDisabled();
        await homePage.verifyCarouselDotsCount(3);
    });

    test('Clicking Next advances the carousel to the next slide', { tag: ['@sanity', '@P2'] }, async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.clickCarouselNext();
        await homePage.verifyCarouselSlideActive(2);
        await homePage.verifyCarouselNextButtonEnabled();
    });

    test('Clicking Previous returns the carousel to the first slide', { tag: ['@sanity', '@P3'] }, async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.clickCarouselNext();
        await homePage.verifyCarouselSlideActive(2);
        await homePage.clickCarouselPrevious();
        await homePage.verifyCarouselSlideActive(1);
        await homePage.verifyCarouselPreviousButtonDisabled();
    });

    test('Reaching the last carousel slide disables the Next button', { tag: ['@sanity', '@P3'] }, async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.clickCarouselNext();
        await homePage.clickCarouselNext();
        await homePage.verifyCarouselSlideActive(3);
        await homePage.verifyCarouselNextButtonDisabled();
    });
});
