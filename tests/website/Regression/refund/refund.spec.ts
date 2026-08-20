import { test } from '../../../../fixtures/page-manager';
import { ValidLoginDetails, AppUrls, RefundReasons } from '../../../../data/credentials';
import { emailTestTimeout } from '../../../../playwright.config';

test.describe('Refund', () => {
    test('Request refund for not installed eSIM', { tag: ['@regression', '@P1'] }, async ({ loginPage, homePage, myAccountPage, myEsimsPage, esimDetailsPage, orderSuccessfulPage }) => {
        test.setTimeout(emailTestTimeout);
        const sentAt = Date.now();
        await loginPage.navigateAndLogin(AppUrls.login, ValidLoginDetails);
        await homePage.navigateToMyAccountTab();
        await myAccountPage.clickEsimsTab();
        await myEsimsPage.verifyMyEsimsPageLoaded();
        await myEsimsPage.verifyNotInstalledEsimPresent();
        await myEsimsPage.clickViewDetailsOnFirstNotInstalledEsim();
        await esimDetailsPage.verifyEsimDetailsPageLoaded();
        await esimDetailsPage.verifyRequestRefundButtonVisible();
        await esimDetailsPage.clickRequestRefund();
        await esimDetailsPage.selectRefundReason(RefundReasons.noLongerNeeded);
        await esimDetailsPage.submitRefundRequest();
        await esimDetailsPage.verifyRefundRequestSubmitted();
        await orderSuccessfulPage.verifyRefundEmailReceived(ValidLoginDetails.email, sentAt);
    });

    test('Verify the Refund button is not shown for an active eSIM', { tag: ['@regression', '@P1', '@negative'] }, async ({ loginPage, homePage, myAccountPage, myEsimsPage, esimDetailsPage }) => {
        await loginPage.navigateAndLogin(AppUrls.login, ValidLoginDetails);
        await homePage.navigateToMyAccountTab();
        await myAccountPage.clickEsimsTab();
        await myEsimsPage.verifyMyEsimsPageLoaded();
        await myEsimsPage.verifyActiveEsimPresent();
        await myEsimsPage.clickViewDetailsOnFirstActiveEsim();
        await esimDetailsPage.verifyActiveEsimDetailsPageLoaded();
        await esimDetailsPage.verifyRequestRefundButtonNotVisible();
    });

    test('My eSIMs Details Page | Verify the Refund button is removed after 14 days for a still-not-installed eSIM | Web', { tag: ['@regression', '@P1', '@edge'] }, async ({ loginPage, homePage, myAccountPage, myEsimsPage, esimDetailsPage }) => {
        await loginPage.navigateAndLogin(AppUrls.login, ValidLoginDetails);
        await homePage.navigateToMyAccountTab();
        await myAccountPage.clickEsimsTab();
        await myEsimsPage.verifyMyEsimsPageLoaded();
        await myEsimsPage.verifyNotInstalledEsimPresent();
        await myEsimsPage.clickViewDetailsOnFirstNotInstalledEsim();
        await esimDetailsPage.verifyEsimDetailsPageLoaded();
        await esimDetailsPage.verifyRefundButtonVisibilityMatchesPurchaseDateRule();
    });

    test('My eSIMs Details Page | Verify the Refund button is available for a not-installed eSIM within 14 days of purchase | Web', { tag: ['@regression', '@P1'] }, async ({ loginPage, homePage, myAccountPage, myEsimsPage, esimDetailsPage }) => {
        await loginPage.navigateAndLogin(AppUrls.login, ValidLoginDetails);
        await homePage.navigateToMyAccountTab();
        await myAccountPage.clickEsimsTab();
        await myEsimsPage.verifyMyEsimsPageLoaded();
        await myEsimsPage.verifyNotInstalledEsimPresent();
        await myEsimsPage.clickViewDetailsOnFirstNotInstalledEsim();
        await esimDetailsPage.verifyEsimDetailsPageLoaded();
        await esimDetailsPage.verifyRefundButtonVisibilityMatchesPurchaseDateRule();
    });
});
