import { test } from '../../../fixtures/page-manager';
import { AppUrls, ValidLoginDetails } from '../../../data/credentials';
import { emailTestTimeout } from '../../../playwright.config';

test.describe('Logged-in Checkout', () => {
    test('One e-Sim checkout as logged-in user', { tag: ['@regression', '@P1'] }, async ({ loginPage, homePage, regionPlansPage, cartPage, checkoutPage, paymentPage, orderSuccessfulPage, myAccountPage: _myAccountPage, randomDestination }) => {
        test.setTimeout(emailTestTimeout);
        const sentAt = Date.now();
        await loginPage.navigateAndLogin(AppUrls.login, ValidLoginDetails);
        await homePage.navigateToRegionPlansPage(randomDestination.slug, randomDestination.tab);
        await regionPlansPage.selectFirstPlan(randomDestination.heading);
        await cartPage.proceedToCheckoutFromCart();
        await checkoutPage.proceedToPaymentAsLoggedInUser();
        await paymentPage.performPaymentWithCardForLoggedInUsers();
        await orderSuccessfulPage.verifyOrderSuccessfulPageDisplayedForLoggedinUsers();
        await orderSuccessfulPage.verifyQRCodeEmailReceived(ValidLoginDetails.email, sentAt);
        await orderSuccessfulPage.verifyReceiptEmailReceived(ValidLoginDetails.email, sentAt);
    });

    test('Multiple eSIM checkout as logged-in user', { tag: ['@regression', '@P2'] }, async ({ loginPage, homePage, regionPlansPage, cartPage, checkoutPage, paymentPage, orderSuccessfulPage, myAccountPage: _myAccountPage, twoRandomRegions }) => {
        test.setTimeout(emailTestTimeout);
        const sentAt = Date.now();
        const [first, second] = twoRandomRegions;
        await loginPage.navigateAndLogin(AppUrls.login, ValidLoginDetails);
        await homePage.navigateToRegionPlansPage(first.slug, first.tab);
        await regionPlansPage.addToCart(first.heading);
        await homePage.gotoHomepage(AppUrls.base);
        await homePage.navigateToRegionPlansPage(second.slug, second.tab);
        await regionPlansPage.selectFirstPlan(second.heading);
        await cartPage.proceedToCheckoutFromCart();
        await checkoutPage.proceedToPaymentAsLoggedInUser();
        await paymentPage.performPaymentWithCardForLoggedInUsers();
        await orderSuccessfulPage.verifyOrderSuccessfulPageDisplayedForLoggedinUsers();
        await orderSuccessfulPage.verifyQRCodeEmailReceived(ValidLoginDetails.email, sentAt);
        await orderSuccessfulPage.verifyReceiptEmailReceived(ValidLoginDetails.email, sentAt);
    });
});
