import { test } from '../../../fixtures/page-manager';
import { generateGuestUserData } from '../../../utils/testDataGenerator';
import { GuestUserData, ValidLoginDetails, PaymentDetails, BillingDetails, AppUrls } from '../../../data/credentials';

test('Guest checkout for non-existing user', async ({ homePage, regionPlansPage, cartPage, checkoutPage, emailVerificationPage, paymentPage, orderSuccessfulPage }) => {
    await homePage.gotoHomepage(AppUrls.base);
    await homePage.navigateToEuropeRegionPlansPage();
    await regionPlansPage.selectPlanInEuropeRegion();
    await cartPage.proceedToCheckoutFromCart();
    await checkoutPage.fillPersonalDetailsForNonExistingUser(generateGuestUserData());
    await checkoutPage.fillBillingAddressDetailsForUserAndProceedToPayment(BillingDetails);
    await emailVerificationPage.handleOTPVerificationNonExistingUser();
    await paymentPage.fillCardDetailsAndPay(PaymentDetails);
    await orderSuccessfulPage.verifyOrderSuccessfulPageDisplayedForGuestUsers();
});

test('Guest checkout with existing account email', async ({ homePage, regionPlansPage, cartPage, checkoutPage, emailVerificationPage, loginPage, paymentPage, orderSuccessfulPage, myAccountPage }) => {
    await homePage.gotoHomepage(AppUrls.base);
    await homePage.navigateToEuropeRegionPlansPage();
    await regionPlansPage.selectPlanInEuropeRegion();
    await cartPage.proceedToCheckoutFromCart();
    await checkoutPage.fillPersonalDetailsForExistingUser(GuestUserData);
    await checkoutPage.fillBillingAddressDetailsForUserAndProceedToPayment(BillingDetails);
    await emailVerificationPage.handleOTPVerificationExistingUser();
    await loginPage.verifyRedirectionAndCompleteLoadToLoginPage();
    await loginPage.fillLoginDetailsAndSubmit(ValidLoginDetails);
    await checkoutPage.proceedToPaymentAsLoggedInUser();
    await paymentPage.performPaymentWithCardForLoggedInUsers();
    await orderSuccessfulPage.verifyOrderSuccessfulPageDisplayedForLoggedinUsers();
    await homePage.navigateToMyAccountTab();
    await myAccountPage.signOutFromAccount();
});

test('Guest checkout login with existing account', async ({ homePage, regionPlansPage, cartPage, checkoutPage, loginPage, paymentPage, orderSuccessfulPage, myAccountPage }) => {
    await homePage.gotoHomepage(AppUrls.base);
    await homePage.navigateToEuropeRegionPlansPage();
    await regionPlansPage.selectPlanInEuropeRegion();
    await cartPage.proceedToCheckoutFromCart();
    await checkoutPage.guestCheckoutLoginWithExistingAccount();
    await loginPage.verifyRedirectionAndCompleteLoadToLoginPage();
    await loginPage.fillLoginDetailsAndSubmit(ValidLoginDetails);
    await checkoutPage.proceedToPaymentAsLoggedInUser();
    await paymentPage.performPaymentWithCardForLoggedInUsers();
    await orderSuccessfulPage.verifyOrderSuccessfulPageDisplayedForLoggedinUsers();
    await homePage.navigateToMyAccountTab();
    await myAccountPage.signOutFromAccount();
});
