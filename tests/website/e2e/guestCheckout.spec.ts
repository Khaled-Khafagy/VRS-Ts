import { test } from '../../../fixtures/page-manager';
import * as testData from '../../../testData.json';

test('Guest checkout', async ({ homePage, regionPlansPage,cartPage,checkoutPage }) => {
    // homePage is already initialized and ready to go!
    await homePage.gotoHomepage();
    await homePage.navigateToEuropeRegionPlansPage();
    await regionPlansPage.selectplanInEuropeRegion();
    await cartPage.proceedToCheckoutFromCart();
    await checkoutPage.fillBillingDetails(testData.validUser);
    await checkoutPage.proceedToPayment();
    await checkoutPage.handleOTPVerification();

});