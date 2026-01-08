import { test } from '../../../fixtures/page-manager';
import * as testData from '../../../data/testData.json';
import {generateGuestUserData} from '../../../utils/testDataGenerator';

test('Guest checkout for Non Existing User', async ({ homePage, regionPlansPage,cartPage,checkoutPage }) => {
    // homePage is already initialized and ready to go!
    await homePage.gotoHomepage();
    await homePage.navigateToEuropeRegionPlansPage();
    await regionPlansPage.selectplanInEuropeRegion();
    await cartPage.proceedToCheckoutFromCart();
    await checkoutPage.fillPersonalDetailsForNonExistingUser(generateGuestUserData());
    await checkoutPage.fillBillingDetailsForUserAndProceedToPayment(testData.billingDetails);
    await checkoutPage.handleOTPVerificationNonExistingUser();
    

});
test('Guest checkout for Existing User', async ({ homePage, regionPlansPage,cartPage,checkoutPage }) => {
    // homePage is already initialized and ready to go!
    await homePage.gotoHomepage();
    await homePage.navigateToEuropeRegionPlansPage();
    await regionPlansPage.selectplanInEuropeRegion();
    await cartPage.proceedToCheckoutFromCart();
    await checkoutPage.fillPersonalDetailsForExistingUser(testData.alreadyRegisteredUser);
    await checkoutPage.fillBillingDetailsForUserAndProceedToPayment(testData.billingDetails);
    await checkoutPage.handleOTPVerificationExistingUser();
  
}); 