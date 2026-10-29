import { test } from '../../../../fixtures/page-manager';
import { AppUrls, ValidLoginDetails, RegistrationTestData, PaymentDetails, BillingDetails, PromoCodes, PromoDiscounts } from '../../../../data/credentials';
import { generateAliasEmail, generateGuestUserData } from '../../../../utils/testDataGenerator';
import { emailTestTimeout } from '../../../../playwright.config';

test.describe('Promos and Vouchers', () => {

    test('T3596: [Eligible - Login] Guest with no completed orders logs in, 15% applied to cheapest plan and purchase completed', { tag: ['@regression', '@P1', '@promo'] }, async ({ loginOrSignupPage, registrationPage, loginPage, homePage, regionPlansPage, cartPage, checkoutPage, paymentPage, orderSuccessfulPage, myAccountPage }) => {
        test.setTimeout(emailTestTimeout * 2);
        // A brand-new account is the only reliable "no completed orders" user — any fixed env account
        // becomes ineligible after the first successful run.
        const email = generateAliasEmail();
        const registeredAt = Date.now();
        await loginOrSignupPage.navigateToLoginOrSignUpPage(AppUrls.login);
        await loginOrSignupPage.proceedWithSignUp();
        await registrationPage.fillDefaultForm({ email });
        await registrationPage.submitRegistrationForm();
        const otp = await registrationPage.getOTPFromEmail(email, registeredAt);
        await registrationPage.enterOTP(otp);
        await registrationPage.verifyRegistrationSuccess();
        await registrationPage.clickContinueToAccount();

        // Known bug: registering leaves an SSO session behind, and a later "login" silently succeeds
        // on that stale session without the credentials form ever appearing — which would make this
        // test skip exercising a real login entirely. Sign out and wipe all site data (cookies +
        // storage, like DevTools' "Clear site data") first, so the login below actually goes through
        // Vodafone ID with the real credentials.
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.navigateToMyAccountTab();
        await myAccountPage.signOutFromAccount();
        await homePage.clearBrowserStorageAndCookies();

        await loginPage.navigateAndLogin(AppUrls.login, { email, password: RegistrationTestData.validPassword });

        // Pinned to Europe (not the randomDestination fixture): confirmed live to have 7 distinctly-priced
        // regular plans, so 1st/2nd/3rd "Add to cart" always resolve to genuinely different plans — a
        // smaller single-country destination isn't guaranteed to have 3 plan tiers.
        // Re-navigate before each add: once a plan's own button is clicked it swaps to quantity controls,
        // which would shift the nth() index of the remaining "Add to cart" buttons on the same page load.
        await homePage.navigateToRegionPlansPage('europe', 'regions');
        await regionPlansPage.addToCart('Europe');
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.navigateToRegionPlansPage('europe', 'regions');
        await regionPlansPage.addSecondPlanToCart('Europe');
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.navigateToRegionPlansPage('europe', 'regions');
        await regionPlansPage.addThirdPlanToCart('Europe');

        await cartPage.navigateToUrl(`${AppUrls.base}/checkout/cart`);
        await cartPage.applyPromoCode(PromoCodes.newCustomerVoucher);
        await cartPage.verifyPromoCodeAccepted(PromoCodes.newCustomerVoucher);
        // The real check for "applied to cheapest plan": confirms the discount was computed off the
        // cheapest of the three line items specifically, not 15% of the combined subtotal — those two
        // give different numbers whenever the plans are priced differently, which they are here.
        await cartPage.verifyDiscountAppliedToCheapestLineItem(PromoDiscounts.newCustomerPercent);

        const sentAt = Date.now();
        const orderSummary = await cartPage.captureOrderSummary();
        await cartPage.proceedToCheckoutFromCart();
        await checkoutPage.fillBillingAddressDetailsForUserAndProceedToPayment(BillingDetails);
        await paymentPage.fillCardDetailsAndPay(PaymentDetails);
        await orderSuccessfulPage.verifyOrderSuccessfulPageDisplayedForLoggedinUsers();
        await orderSuccessfulPage.verifyReceiptEmailMatchesOrderSummary(email, sentAt, orderSummary);
    });

    test('T3597: [Ineligible] Voucher rejected for accounts with completed orders or already used voucher', { tag: ['@regression', '@P1', '@promo', '@negative'] }, async ({ loginPage, homePage, regionPlansPage, cartPage, myAccountPage: _myAccountPage, randomDestination }) => {
        await loginPage.navigateAndLogin(AppUrls.login, ValidLoginDetails);
        // await cartPage.clearCartIfNotEmpty(`${AppUrls.base}/checkout/cart`);
        await homePage.navigateToRegionPlansPage(randomDestination.slug, randomDestination.tab);
        await regionPlansPage.selectFirstPlan(randomDestination.heading);
        await cartPage.verifyNoDiscountApplied();
        await cartPage.applyPromoCode(PromoCodes.newCustomerVoucher);
        await cartPage.verifyPromoCodeRejected();
        await cartPage.verifyNoDiscountApplied();
    });

    test('T3789: Promo code application - valid code', { tag: ['@regression', '@P1', '@promo'] }, async ({ homePage, regionPlansPage, cartPage, checkoutPage, emailVerificationPage, paymentPage, orderSuccessfulPage, randomDestination }) => {
        test.setTimeout(emailTestTimeout);
        const sentAt = Date.now();
        const guestData = generateGuestUserData();
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.navigateToRegionPlansPage(randomDestination.slug, randomDestination.tab);
        await regionPlansPage.selectFirstPlan(randomDestination.heading);
        await cartPage.applyPromoCode(PromoCodes.valid);
        await cartPage.verifyPromoCodeAccepted(PromoCodes.valid);
        const orderSummary = await cartPage.captureOrderSummary();
        await cartPage.proceedToCheckoutFromCart();
        await checkoutPage.fillPersonalDetailsForNonExistingUser(guestData);
        await checkoutPage.fillBillingAddressDetailsForUserAndProceedToPayment(BillingDetails);
        await emailVerificationPage.handleOTPVerificationNonExistingUser(guestData.email, sentAt);
        await paymentPage.fillCardDetailsAndPay(PaymentDetails);
        await orderSuccessfulPage.verifyOrderSuccessfulPageDisplayedForGuestUsers();
        await orderSuccessfulPage.verifyReceiptEmailMatchesOrderSummary(guestData.email, sentAt, orderSummary);
    });

    test('T3789: Promo code application - invalid code is rejected', { tag: ['@regression', '@P2', '@promo', '@negative'] }, async ({ homePage, regionPlansPage, cartPage, randomDestination }) => {
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.navigateToRegionPlansPage(randomDestination.slug, randomDestination.tab);
        await regionPlansPage.selectFirstPlan(randomDestination.heading);
        await cartPage.applyPromoCode(PromoCodes.invalid);
        await cartPage.verifyPromoCodeRejected();
        await cartPage.verifyNoDiscountApplied();
    });

    test('T3790: 15% off new customers (Socials promo)', { tag: ['@regression', '@P1', '@promo'] }, async ({ homePage, regionPlansPage, cartPage, loginOrSignupPage, registrationPage, checkoutPage, paymentPage, orderSuccessfulPage, myAccountPage: _myAccountPage, randomDestination }) => {
        test.setTimeout(emailTestTimeout * 2);
        const email = generateAliasEmail();
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.navigateToRegionPlansPage(randomDestination.slug, randomDestination.tab);
        await regionPlansPage.selectFirstPlan(randomDestination.heading);
        await cartPage.applyPromoCode(PromoCodes.socials);

        // Applying the code while logged out does a full-page redirect to the VRS /login screen
        // (same LoginOrSignupPage modal registration.spec.ts uses) — not an inline button on the cart.
        const registeredAt = Date.now();
        await loginOrSignupPage.proceedWithSignUp();
        await registrationPage.fillDefaultForm({ email });
        await registrationPage.submitRegistrationForm();
        const otp = await registrationPage.getOTPFromEmail(email, registeredAt);
        await registrationPage.enterOTP(otp);
        await registrationPage.verifyRegistrationSuccess();
        await registrationPage.clickContinueToAccount();
        await cartPage.verifyRedirectedBackToCart();

        await cartPage.verifyPromoCodeAccepted(PromoCodes.socials);
        await cartPage.verifyDiscountPercentageApplied(PromoDiscounts.socialsPercent);
        const orderSummary = await cartPage.captureOrderSummary();
        const sentAt = Date.now();
        await cartPage.proceedToCheckoutFromCart();
        await checkoutPage.fillBillingAddressDetailsForUserAndProceedToPayment(BillingDetails);
        await paymentPage.fillCardDetailsAndPay(PaymentDetails);
        await orderSuccessfulPage.verifyOrderSuccessfulPageDisplayedForLoggedinUsers();
        await orderSuccessfulPage.verifyReceiptEmailMatchesOrderSummary(email, sentAt, orderSummary);
    });
});
