import { test } from '../../../fixtures/page-manager';
import { AppUrls, PartnersPageData } from '../../../data/credentials';
import { generatePartnerRequestData } from '../../../utils/testDataGenerator';

/**
 * Feature: Partners page — TE-1509 (parent TE-700)
 * Environment: TEST (portal-vrs-test) — run with BASE_URL pointing at the test environment.
 * Source of truth: TE-1509 acceptance criteria + Figma "Travel eSIM 2.0 - Web" node 11174-160013.
 *
 * Open questions raised while deriving the cases (confirm with BA/design):
 *  - AC lists Mastercard, UEFA, AWIN, Ferryhopper; Figma shows Mastercard, UEFA, Trip.com, Ferryhopper, TAP Airlines.
 *    Only the partners common to both are asserted strictly (PartnersPageData.confirmedPartners).
 *  - Company size DDL: Figma lists five options incl. "1000+ employees"; AC does not list them.
 *  - Success copy: AC screenshot says "Sent Successfully!", Figma says "Message sent" — both accepted.
 *  - Delivery of the request to Travel.partners@vodafone.com cannot be asserted from the UI (manual check).
 */
test.describe('Partners page - TE-1509', () => {

    // ── Navigation / entry points ──────────────────────────────────────────

    test('TC-01 Partners page is accessible from the top navigation menu', { tag: ['@feature', '@TE-1509', '@P1', '@navigation'] }, async ({ partnersPage }) => {
        await partnersPage.gotoHomepage(AppUrls.base);
        await partnersPage.verifyHeaderPartnersLinkIsActive();
        await partnersPage.clickHeaderPartnersLink();
        await partnersPage.waitForPartnersPageLoaded();
        await partnersPage.verifyHeroBanner();
    });

    test('TC-02 Partners page is accessible from the footer', { tag: ['@feature', '@TE-1509', '@P1', '@navigation'] }, async ({ partnersPage }) => {
        await partnersPage.gotoHomepage(AppUrls.base);
        await partnersPage.verifyFooterPartnersLinkVisible();
        await partnersPage.clickFooterPartnersLink();
        await partnersPage.waitForPartnersPageLoaded();
        await partnersPage.verifyHeroBanner();
    });

    // ── Hero banner ────────────────────────────────────────────────────────

    test('TC-03 Hero banner shows headline, sub-copy, image and "Partner with us" CTA', { tag: ['@feature', '@TE-1509', '@P1', '@hero'] }, async ({ partnersPage }) => {
        await partnersPage.gotoPartnersPage();
        await partnersPage.verifyHeroBanner();
    });

    test('TC-04 Hero "Partner with us" CTA navigates to the "Become a Partner" section', { tag: ['@feature', '@TE-1509', '@P1', '@hero'] }, async ({ partnersPage }) => {
        await partnersPage.gotoPartnersPage();
        await partnersPage.clickHeroPartnerWithUsCta();
        await partnersPage.verifyBecomeAPartnerSectionInView();
    });

    // ── Featured partners ──────────────────────────────────────────────────

    test('TC-05 Featured Partners section displays the active partners', { tag: ['@feature', '@TE-1509', '@P1', '@featured-partners'] }, async ({ partnersPage }) => {
        await partnersPage.gotoPartnersPage();
        await partnersPage.verifyFeaturedPartnersHeading();
        await partnersPage.verifyPartnersDisplayed(PartnersPageData.confirmedPartners);
    });

    test('TC-06 Each partner card shows image, name, short description and CTA', { tag: ['@feature', '@TE-1509', '@P1', '@featured-partners'] }, async ({ partnersPage }) => {
        await partnersPage.gotoPartnersPage();
        await partnersPage.verifyEachPartnerCardContent();
    });

    test('TC-07 Each partner CTA opens the partner site in a new tab', { tag: ['@feature', '@TE-1509', '@P1', '@featured-partners'] }, async ({ partnersPage }) => {
        await partnersPage.gotoPartnersPage();
        await partnersPage.verifyEachPartnerCtaOpensPartnerSiteInNewTab();
    });

    test('TC-08 "More partners coming soon" is displayed after the last partner', { tag: ['@feature', '@TE-1509', '@P2', '@featured-partners'] }, async ({ partnersPage }) => {
        await partnersPage.gotoPartnersPage();
        await partnersPage.verifyMorePartnersComingSoonAfterLastCard();
    });

    // ── Stats bar ──────────────────────────────────────────────────────────

    test('TC-09 Stats bar shows three values with labels', { tag: ['@feature', '@TE-1509', '@P2', '@stats'] }, async ({ partnersPage }) => {
        await partnersPage.gotoPartnersPage();
        await partnersPage.verifyStatsBar(PartnersPageData.stats);
    });

    // ── Why partner with us ────────────────────────────────────────────────

    test('TC-10 "Why partner with us" shows four value-proposition blocks', { tag: ['@feature', '@TE-1509', '@P2', '@why-partner'] }, async ({ partnersPage }) => {
        await partnersPage.gotoPartnersPage();
        await partnersPage.verifyWhyPartnerWithUsSection(PartnersPageData.whyPartnerWithUsBlocks);
    });

    // ── Become a Partner form ──────────────────────────────────────────────

    test('TC-11 Form shows all fields, all marked mandatory', { tag: ['@feature', '@TE-1509', '@P1', '@form'] }, async ({ partnersPage }) => {
        await partnersPage.gotoPartnersPage();
        await partnersPage.verifyBecomeAPartnerFormFields();
        await partnersPage.verifyAllFormFieldsAreMandatory();
    });

    test('TC-12 Company size dropdown lists the designed options', { tag: ['@feature', '@TE-1509', '@P2', '@form'] }, async ({ partnersPage }) => {
        await partnersPage.gotoPartnersPage();
        await partnersPage.scrollToBecomeAPartnerForm();
        await partnersPage.verifyCompanySizeOptions(PartnersPageData.companySizeOptions);
    });

    test('TC-13 "Send Message" is disabled on an untouched form', { tag: ['@feature', '@TE-1509', '@P1', '@form'] }, async ({ partnersPage }) => {
        await partnersPage.gotoPartnersPage();
        await partnersPage.scrollToBecomeAPartnerForm();
        await partnersPage.verifySendMessageDisabled();
    });

    test('TC-14 "Send Message" stays disabled while any mandatory field is missing', { tag: ['@feature', '@TE-1509', '@P1', '@form'] }, async ({ partnersPage }) => {
        await partnersPage.gotoPartnersPage();
        await partnersPage.verifySendMessageDisabledWhenEachMandatoryFieldIsMissing(generatePartnerRequestData());
    });

    test('TC-15 "Send Message" stays disabled until the Privacy Policy is accepted', { tag: ['@feature', '@TE-1509', '@P1', '@form'] }, async ({ partnersPage }) => {
        await partnersPage.gotoPartnersPage();
        await partnersPage.scrollToBecomeAPartnerForm();
        await partnersPage.fillPartnerForm(generatePartnerRequestData(), { acceptPrivacyPolicy: false });
        await partnersPage.verifySendMessageDisabled();
        await partnersPage.acceptPrivacyPolicy();
        await partnersPage.verifySendMessageEnabled();
    });

    test('TC-16 "Send Message" is enabled once every field is completed and the Privacy Policy accepted', { tag: ['@feature', '@TE-1509', '@P1', '@form'] }, async ({ partnersPage }) => {
        await partnersPage.gotoPartnersPage();
        await partnersPage.scrollToBecomeAPartnerForm();
        await partnersPage.fillPartnerForm(generatePartnerRequestData());
        await partnersPage.verifySendMessageEnabled();
    });

    test('TC-17 Privacy Policy link points to the Privacy & Cookie Policy', { tag: ['@feature', '@TE-1509', '@P3', '@form'] }, async ({ partnersPage }) => {
        await partnersPage.gotoPartnersPage();
        await partnersPage.scrollToBecomeAPartnerForm();
        await partnersPage.verifyPrivacyPolicyLink();
    });

    test('TC-18 Successful submission shows the confirmation and "Send another message" resets the form', { tag: ['@feature', '@TE-1509', '@P1', '@form', '@submission'] }, async ({ partnersPage }) => {
        await partnersPage.gotoPartnersPage();
        await partnersPage.scrollToBecomeAPartnerForm();
        await partnersPage.fillPartnerForm(generatePartnerRequestData());
        await partnersPage.clickSendMessage();
        await partnersPage.verifySuccessMessage();
        await partnersPage.clickSendAnotherMessage();
        await partnersPage.verifyFormIsDisplayedAndEmpty();
    });

    test('TC-19 Failed submission shows the error state and "Try again" re-sends the request once back online', { tag: ['@feature', '@TE-1509', '@P1', '@form', '@submission'] }, async ({ partnersPage }) => {
        await partnersPage.gotoPartnersPage();
        await partnersPage.scrollToBecomeAPartnerForm();
        await partnersPage.fillPartnerForm(generatePartnerRequestData());
        await partnersPage.clickSendMessageWhileOffline();
        await partnersPage.clickTryAgain();
        await partnersPage.verifySuccessMessage();
    });

    // ── About section ──────────────────────────────────────────────────────

    test('TC-20 About section shows copy and image below the form', { tag: ['@feature', '@TE-1509', '@P2', '@about'] }, async ({ partnersPage }) => {
        await partnersPage.gotoPartnersPage();
        await partnersPage.verifyAboutSection();
        await partnersPage.verifyAboutSectionIsBelowForm();
    });

    test('TC-21 About section shows the three-step partnership process', { tag: ['@feature', '@TE-1509', '@P2', '@about'] }, async ({ partnersPage }) => {
        await partnersPage.gotoPartnersPage();
        await partnersPage.verifyThreeStepPartnershipProcess();
    });

    // ── FAQs ───────────────────────────────────────────────────────────────

    test('TC-22 FAQ section lists the questions', { tag: ['@feature', '@TE-1509', '@P2', '@faq'] }, async ({ partnersPage }) => {
        await partnersPage.gotoPartnersPage();
        await partnersPage.verifyFaqSection(PartnersPageData.faqQuestions);
    });

    test('TC-23 FAQ questions expand and collapse', { tag: ['@feature', '@TE-1509', '@P2', '@faq'] }, async ({ partnersPage }) => {
        await partnersPage.gotoPartnersPage();
        await partnersPage.verifyFaqQuestionsExpandAndCollapse(PartnersPageData.faqQuestions);
    });

    // ── Footer ─────────────────────────────────────────────────────────────

    test('TC-24 Footer is displayed on the Partners page', { tag: ['@feature', '@TE-1509', '@P3', '@footer'] }, async ({ partnersPage }) => {
        await partnersPage.gotoPartnersPage();
        await partnersPage.verifyFooterVisible();
    });
});
