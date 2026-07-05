import { test } from '../../../fixtures/page-manager';
import { generateGuestUserData, pickRandomTravelTogetherPlanDestination } from '../../../utils/testDataGenerator';
import { AppUrls, ValidLoginDetails, GuestUserData, PaymentDetails, BillingDetails, TravelTogetherPlanPromoCode } from '../../../data/credentials';

test.describe('Travel Together Plan - Purchase Journey (TE-90)', () => {

    test('TC-01: Guest checkout - new user - Desktop',
        { tag: ['@regression', '@P1', '@travelTogetherPlan'] },
        async ({ homePage, regionPlansPage, cartPage, checkoutPage, emailVerificationPage, paymentPage, orderSuccessfulPage }) => {
            const guestData = generateGuestUserData();
            const dest = pickRandomTravelTogetherPlanDestination();
            await homePage.gotoHomepage(AppUrls.base);
            await homePage.navigateToRegionPlansPage(dest.slug, dest.tab);
            await regionPlansPage.verifyTravelTogetherPlanBannerVisible();
            await regionPlansPage.openGlobalPlanDetailsModal();
            await regionPlansPage.verifyGlobalPlanDetailsModal();
            await regionPlansPage.proceedFromModalToCart();
            await cartPage.verifyCartLoaded();
            await cartPage.expandAndVerifyWhatsIncluded();
            await cartPage.proceedToCheckoutFromCart();
            await checkoutPage.fillPersonalDetailsForNonExistingUser(guestData);
            await checkoutPage.fillBillingAddressDetailsForUserAndProceedToPayment(BillingDetails);
            await emailVerificationPage.handleOTPVerificationNonExistingUser();
            await paymentPage.fillCardDetailsAndPay(PaymentDetails);
            await orderSuccessfulPage.verifyTravelTogetherPlanOrderSuccessForGuestUser();
        });

    test('TC-03: Guest checkout - existing account email - Desktop',
        { tag: ['@regression', '@P1', '@travelTogetherPlan'] },
        async ({ homePage, regionPlansPage, cartPage, checkoutPage, emailVerificationPage, loginPage, paymentPage, orderSuccessfulPage, myAccountPage: _myAccountPage }) => {
            const dest = pickRandomTravelTogetherPlanDestination();
            await homePage.gotoHomepage(AppUrls.base);
            await homePage.navigateToRegionPlansPage(dest.slug, dest.tab);
            await regionPlansPage.verifyTravelTogetherPlanBannerVisible();
            await regionPlansPage.selectTravelTogetherPlan(dest.heading);
            await cartPage.verifyCartLoaded();
            await cartPage.proceedToCheckoutFromCart();
            await checkoutPage.fillPersonalDetailsForExistingUser(GuestUserData);
            await checkoutPage.fillBillingAddressDetailsForUserAndProceedToPayment(BillingDetails);
            await emailVerificationPage.handleOTPVerificationExistingUser();
            await loginPage.verifyRedirectionAndCompleteLoadToLoginPage();
            await loginPage.fillLoginDetailsAndSubmit(ValidLoginDetails);
            await checkoutPage.proceedToPaymentAsLoggedInUser();
            await paymentPage.performPaymentWithCardForLoggedInUsers();
            await orderSuccessfulPage.verifyTravelTogetherPlanOrderSuccessForLoggedInUser();
        });

    test('TC-05: Logged-in user checkout - Desktop',
        { tag: ['@regression', '@P1', '@travelTogetherPlan'] },
        async ({ loginPage, homePage, regionPlansPage, cartPage, checkoutPage, paymentPage, orderSuccessfulPage, myAccountPage: _myAccountPage }) => {
            const dest = pickRandomTravelTogetherPlanDestination();
            await loginPage.navigateAndLogin(AppUrls.login, ValidLoginDetails);
            await homePage.navigateToRegionPlansPage(dest.slug, dest.tab);
            await regionPlansPage.verifyTravelTogetherPlanBannerVisible();
            await regionPlansPage.selectTravelTogetherPlan(dest.heading);
            await cartPage.verifyCartLoaded();
            await cartPage.proceedToCheckoutFromCart();
            await checkoutPage.proceedToPaymentAsLoggedInUser();
            await paymentPage.performPaymentWithCardForLoggedInUsers();
            await orderSuccessfulPage.verifyTravelTogetherPlanOrderSuccessForLoggedInUser();
        });

    test('TC-08: Promotional code application - Desktop',
        { tag: ['@regression', '@P2', '@travelTogetherPlan'] },
        async ({ homePage, regionPlansPage, cartPage, checkoutPage, emailVerificationPage, paymentPage, orderSuccessfulPage }) => {
            const guestData = generateGuestUserData();
            const dest = pickRandomTravelTogetherPlanDestination();
            const sentAt = Date.now();
            await homePage.gotoHomepage(AppUrls.base);
            await homePage.navigateToRegionPlansPage(dest.slug, dest.tab);
            await regionPlansPage.verifyTravelTogetherPlanBannerVisible();
            await regionPlansPage.selectTravelTogetherPlan(dest.heading);
            await cartPage.verifyCartLoaded();
            await cartPage.applyPromoCode(TravelTogetherPlanPromoCode);
            await cartPage.verifyOrderSummaryVisible();
            const orderSummary = await cartPage.captureOrderSummary();
            await cartPage.proceedToCheckoutFromCart();
            await checkoutPage.fillPersonalDetailsForNonExistingUser(guestData);
            await checkoutPage.fillBillingAddressDetailsForUserAndProceedToPayment(BillingDetails);
            await emailVerificationPage.handleOTPVerificationNonExistingUser();
            await paymentPage.fillCardDetailsAndPay(PaymentDetails);
            await orderSuccessfulPage.verifyTravelTogetherPlanOrderSuccessForGuestUser();
            await orderSuccessfulPage.verifyQRCodeEmailReceived(guestData.email, sentAt);
            await orderSuccessfulPage.verifyReceiptEmailMatchesOrderSummary(guestData.email, sentAt, orderSummary);
        });

});
