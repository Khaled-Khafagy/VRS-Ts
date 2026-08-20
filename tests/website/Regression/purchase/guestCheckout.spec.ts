import { test } from '../../../../fixtures/page-manager';
import { generateGuestUserData, pickRandomDestination } from '../../../../utils/testDataGenerator';
import { GuestUserData, ValidLoginDetails, PaymentDetails, BillingDetails, AppUrls } from '../../../../data/credentials';
import { emailTestTimeout } from '../../../../playwright.config';

test.describe('Guest Checkout', () => {
    test('Guest checkout for non-existing user', { tag: ['@regression', '@P1'] }, async ({ homePage, regionPlansPage, cartPage, checkoutPage, emailVerificationPage, paymentPage, orderSuccessfulPage }) => {
        test.setTimeout(emailTestTimeout);
        const sentAt = Date.now();
        const guestData = generateGuestUserData();
        const destination = pickRandomDestination();
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.navigateToRegionPlansPage(destination.slug, destination.tab);
        await regionPlansPage.selectFirstPlan(destination.heading);
        await cartPage.proceedToCheckoutFromCart();
        await checkoutPage.fillPersonalDetailsForNonExistingUser(guestData);
        await checkoutPage.fillBillingAddressDetailsForUserAndProceedToPayment(BillingDetails);
        await emailVerificationPage.handleOTPVerificationNonExistingUser(guestData.email, sentAt);
        await paymentPage.fillCardDetailsAndPay(PaymentDetails);
        await orderSuccessfulPage.verifyOrderSuccessfulPageDisplayedForGuestUsers();
        await emailVerificationPage.verifyOTPEmailReceived(guestData.email, sentAt);
        await orderSuccessfulPage.verifyWelcomeEmailReceived(guestData.email, sentAt);
        await orderSuccessfulPage.verifyQRCodeEmailReceived(guestData.email, sentAt);
        await orderSuccessfulPage.verifyReceiptEmailReceived(guestData.email, sentAt);
       
    });

    test('Guest checkout with existing account email', { tag: ['@regression', '@P1'] }, async ({ homePage, regionPlansPage, cartPage, checkoutPage, emailVerificationPage, loginPage, paymentPage, orderSuccessfulPage, myAccountPage: _myAccountPage }) => {
        const destination = pickRandomDestination();
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.navigateToRegionPlansPage(destination.slug, destination.tab);
        await regionPlansPage.selectFirstPlan(destination.heading);
        await cartPage.proceedToCheckoutFromCart();
        await checkoutPage.fillPersonalDetailsForExistingUser(GuestUserData);
        await checkoutPage.fillBillingAddressDetailsForUserAndProceedToPayment(BillingDetails);
        await emailVerificationPage.handleOTPVerificationExistingUser();
        await loginPage.verifyRedirectionAndCompleteLoadToLoginPage();
        await loginPage.fillLoginDetailsAndSubmit(ValidLoginDetails);
        await checkoutPage.proceedToPaymentAsLoggedInUser();
        await paymentPage.performPaymentWithCardForLoggedInUsers();
        await orderSuccessfulPage.verifyOrderSuccessfulPageDisplayedForLoggedinUsers();
    });

    test('Guest checkout login with existing account', { tag: ['@regression', '@P2'] }, async ({ homePage, regionPlansPage, cartPage, checkoutPage, loginPage, paymentPage, orderSuccessfulPage, myAccountPage: _myAccountPage }) => {
        const destination = pickRandomDestination();
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.navigateToRegionPlansPage(destination.slug, destination.tab);
        await regionPlansPage.selectFirstPlan(destination.heading);
        await cartPage.proceedToCheckoutFromCart();
        await checkoutPage.guestCheckoutLoginWithExistingAccount();
        await loginPage.verifyRedirectionAndCompleteLoadToLoginPage();
        await loginPage.fillLoginDetailsAndSubmit(ValidLoginDetails);
        await checkoutPage.proceedToPaymentAsLoggedInUser();
        await paymentPage.performPaymentWithCardForLoggedInUsers();
        await orderSuccessfulPage.verifyOrderSuccessfulPageDisplayedForLoggedinUsers();
    });

});
