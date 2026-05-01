import { test } from '../../../fixtures/page-manager';
import { ValidLoginDetails, AppUrls, RefundReasons } from '../../../data/credentials';

test('Request refund for not installed eSIM', async ({ loginOrSignupPage, loginPage, homePage, myAccountPage, myEsimsPage, esimDetailsPage }) => {
    await loginOrSignupPage.navigateToLoginOrSignUpPage(AppUrls.login);
    await loginOrSignupPage.proceedWithLogin();
    await loginPage.verifyRedirectionAndCompleteLoadToLoginPage();
    await loginPage.fillLoginDetailsAndSubmit(ValidLoginDetails);
    await homePage.navigateToMyAccountTab();
    await myAccountPage.clickEsimsTab();
    await myEsimsPage.verifyMyEsimsPageLoaded();
    await myEsimsPage.verifyNotInstalledEsimPresent();
    await myEsimsPage.clickViewDetailsOnFirstNotInstalledEsim();
    await esimDetailsPage.verifyEsimDetailsPageLoaded();
    await esimDetailsPage.expandEsimDetailsAccordion();
    await esimDetailsPage.verifyRequestRefundButtonVisible();
    await esimDetailsPage.clickRequestRefund();
    await esimDetailsPage.selectRefundReason(RefundReasons.noLongerNeeded);
    await esimDetailsPage.submitRefundRequest();
    await esimDetailsPage.verifyRefundRequestSubmitted();
});
