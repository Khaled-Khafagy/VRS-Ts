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
});
