import { test } from '../../../../fixtures/page-manager';
import { generateGuestUserData, pickRandomTravelTogetherPlanDestination } from '../../../../utils/testDataGenerator';
import { AppUrls, BillingDetails, DeclinedCardDetails } from '../../../../data/credentials';
import { emailTestTimeout } from '../../../../playwright.config';

test.describe('Purchase - Negative Scenarios', () => {

    test('TC-NEG-01: Guest checkout - declined credit card shows payment error',
        { tag: ['@regression', '@P2', '@negative'] },
        async ({ homePage, regionPlansPage, cartPage, checkoutPage, emailVerificationPage, paymentPage }) => {
            test.setTimeout(emailTestTimeout);
            const sentAt = Date.now();
            const guestData = generateGuestUserData();
            const dest = pickRandomTravelTogetherPlanDestination();
            await homePage.gotoHomepage(AppUrls.base);
            await homePage.navigateToRegionPlansPage(dest.slug, dest.tab);
            await regionPlansPage.selectTravelTogetherPlan(dest.heading);
            await cartPage.verifyCartLoaded();
            await cartPage.proceedToCheckoutFromCart();
            await checkoutPage.fillPersonalDetailsForNonExistingUser(guestData);
            await checkoutPage.fillBillingAddressDetailsForUserAndProceedToPayment(BillingDetails);
            await emailVerificationPage.handleOTPVerificationNonExistingUser(guestData.email, sentAt);
            await paymentPage.fillCardDetailsAndPay(DeclinedCardDetails);
            await paymentPage.verifyCardDeclinedError();
        });

});
