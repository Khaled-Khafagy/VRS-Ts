import { test } from '../../../fixtures/page-manager';
import { AppUrls } from '../../../data/credentials';

test.describe('Our Destinations Exploration', () => {
    test('Our Destinations page loads with correct title and heading', async ({ ourDestinationsPage }) => {
        await ourDestinationsPage.gotoOurDestinationsPage(AppUrls.ourDestinations);
        await ourDestinationsPage.verifyPageTitle();
    });

    test('Back button is visible on Our Destinations page', async ({ ourDestinationsPage }) => {
        await ourDestinationsPage.gotoOurDestinationsPage(AppUrls.ourDestinations);
        await ourDestinationsPage.verifyBackButtonVisible();
    });

    test('Header navigation links are visible', async ({ ourDestinationsPage }) => {
        await ourDestinationsPage.gotoOurDestinationsPage(AppUrls.ourDestinations);
        await ourDestinationsPage.verifyHeaderNavigationLinks();
    });

    test('Homepage link navigates back to homepage', async ({ ourDestinationsPage }) => {
        await ourDestinationsPage.gotoOurDestinationsPage(AppUrls.ourDestinations);
        await ourDestinationsPage.clickHomePageLink();
        await ourDestinationsPage.verifyHomePageLoaded();
    });

    test('Regions tab is selected by default', async ({ ourDestinationsPage }) => {
        await ourDestinationsPage.gotoOurDestinationsPage(AppUrls.ourDestinations);
        await ourDestinationsPage.verifyRegionsTabIsActive();
    });

    test('Switch from Regions tab to Countries tab', async ({ ourDestinationsPage }) => {
        await ourDestinationsPage.gotoOurDestinationsPage(AppUrls.ourDestinations);
        await ourDestinationsPage.verifyRegionsTabIsActive();
        await ourDestinationsPage.switchToCountriesTab();
        await ourDestinationsPage.verifyCountriesTabIsActive();
    });

    test('Switch back from Countries tab to Regions tab', async ({ ourDestinationsPage }) => {
        await ourDestinationsPage.gotoOurDestinationsPage(AppUrls.ourDestinations);
        await ourDestinationsPage.switchToCountriesTab();
        await ourDestinationsPage.switchToRegionsTab();
        await ourDestinationsPage.verifyRegionsTabIsActive();
    });

    test('All region destination cards are visible in grid', async ({ ourDestinationsPage }) => {
        await ourDestinationsPage.gotoOurDestinationsPage(AppUrls.ourDestinations);
        await ourDestinationsPage.verifyAllDestinationCardsVisible();
    });

    test('Destination card shows heading, pricing and explore button', async ({ ourDestinationsPage }) => {
        await ourDestinationsPage.gotoOurDestinationsPage(AppUrls.ourDestinations);
        await ourDestinationsPage.verifyDestinationCardLayout('Europe');
    });

    test('Search input is visible with correct placeholder', async ({ ourDestinationsPage }) => {
        await ourDestinationsPage.gotoOurDestinationsPage(AppUrls.ourDestinations);
        await ourDestinationsPage.verifySearchInputVisible();
        await ourDestinationsPage.verifySearchInputHasPlaceholder();
    });

    test('Search button is disabled before a destination is selected', async ({ ourDestinationsPage }) => {
        await ourDestinationsPage.gotoOurDestinationsPage(AppUrls.ourDestinations);
        await ourDestinationsPage.verifySearchButtonDisabledInitially();
    });

    test('Typing in search input shows autocomplete dropdown', async ({ ourDestinationsPage }) => {
        await ourDestinationsPage.gotoOurDestinationsPage(AppUrls.ourDestinations);
        await ourDestinationsPage.searchForDestination('France');
        await ourDestinationsPage.verifySearchDropdownVisible('France');
    });

    test('Search results show Countries and Regions categories', async ({ ourDestinationsPage }) => {
        await ourDestinationsPage.gotoOurDestinationsPage(AppUrls.ourDestinations);
        await ourDestinationsPage.verifySearchShowsCountriesAndRegions();
    });

    test('Clear search input resets to empty state', async ({ ourDestinationsPage }) => {
        await ourDestinationsPage.gotoOurDestinationsPage(AppUrls.ourDestinations);
        await ourDestinationsPage.searchForDestination('Italy');
        await ourDestinationsPage.clearSearchInput();
        await ourDestinationsPage.verifySearchInputIsEmpty();
    });

    test('Navigating to Africa destination loads Africa plans page', async ({ ourDestinationsPage }) => {
        await ourDestinationsPage.gotoOurDestinationsPage(AppUrls.ourDestinations);
        await ourDestinationsPage.navigateToDestination('Africa');
        await ourDestinationsPage.verifyNavigationToDestinationPage('Africa');
    });

    test('Navigating to Europe destination loads Europe plans page', async ({ ourDestinationsPage }) => {
        await ourDestinationsPage.gotoOurDestinationsPage(AppUrls.ourDestinations);
        await ourDestinationsPage.navigateToDestination('Europe');
        await ourDestinationsPage.verifyNavigationToDestinationPage('Europe');
    });

    test('Countries tab displays individual country cards', async ({ ourDestinationsPage }) => {
        await ourDestinationsPage.gotoOurDestinationsPage(AppUrls.ourDestinations);
        await ourDestinationsPage.switchToCountriesTab();
        await ourDestinationsPage.verifyCountriesTabHasContent();
    });
});
