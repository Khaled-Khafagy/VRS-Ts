import { test } from '../../../fixtures/page-manager';
import { AppUrls } from '../../../data/credentials';

test.describe('Footer Links', () => {

    // ── Visibility ─────────────────────────────────────────────────────────

    test('Footer - Top Destinations section: all links are visible', { tag: ['@sanity', '@P2', '@footer'] }, async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.verifyFooterTopDestinationsSectionVisible();
    });

    test('Footer - Legal section: all links are visible', { tag: ['@sanity', '@P2', '@footer'] }, async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.verifyFooterLegalSectionVisible();
    });

    test('Footer - Help and Support section: all links are visible', { tag: ['@sanity', '@P2', '@footer'] }, async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.verifyFooterHelpSupportSectionVisible();
    });

    // ── Navigation ─────────────────────────────────────────────────────────

    test('Footer - Top Destinations links navigate to correct destination pages', { tag: ['@sanity', '@P2', '@footer'] }, async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.clickEachTopDestinationFooterLinkAndVerify(AppUrls.base);
    });

    test('Footer - Legal links navigate to correct pages', { tag: ['@sanity', '@P2', '@footer'] }, async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.clickEachLegalFooterLinkAndVerify(AppUrls.base);
    });

    test('Footer - Help and Support links navigate to correct pages', { tag: ['@sanity', '@P2', '@footer'] }, async ({ homePage }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.clickEachHelpSupportFooterLinkAndVerify(AppUrls.base);
    });
});
