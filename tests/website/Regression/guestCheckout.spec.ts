import { test } from '../../../fixtures/page-manager';
import * as testData from '../../../data/testData.json';
import {generateGuestUserData} from '../../../utils/testDataGenerator';
import { skip } from 'node:test';


test('Guest checkout for Non Existing User', async ({ homePage, regionPlansPage,cartPage,checkoutPage,paymentPage,orderSuccessfulPage }) => {
    
    await homePage.gotoHomepage(testData.Environment.url);
    await homePage.navigateToEuropeRegionPlansPage();
    await regionPlansPage.selectplanInEuropeRegion();
    await cartPage.proceedToCheckoutFromCart();
    await checkoutPage.fillPersonalDetailsForNonExistingUser(generateGuestUserData());
    await checkoutPage.fillBillingAddressDetailsForUserAndProceedToPayment(testData.billingDetails);
    await checkoutPage.handleOTPVerificationNonExistingUser();
    await paymentPage.fillCardDetailsAndPay(testData.paymentDetails);
    await orderSuccessfulPage.verifyOrderSuccessfulPageDisplayedForGuestUsers();

    
    

});
test('Guest Checkout inserting Existing Account in E-mail field', async ({ homePage, regionPlansPage,cartPage,checkoutPage,loginPage,paymentPage,orderSuccessfulPage,myAccountPage}) => {
   
    await homePage.gotoHomepage(testData.Environment.url);
    await homePage.navigateToEuropeRegionPlansPage();
    await regionPlansPage.selectplanInEuropeRegion();
    await cartPage.proceedToCheckoutFromCart();
    await checkoutPage.fillPersonalDetailsForExistingUser(testData.GuestDetailsForalreadyRegisteredUser);
    await checkoutPage.fillBillingAddressDetailsForUserAndProceedToPayment(testData.billingDetails);
    await checkoutPage.handleOTPVerificationExistingUser();
    await loginPage.verifyRedirectionAndCompleteLoadToLoginPage();
    await loginPage.fillLoginDetailsAndSubmit(testData.ValidLoginDetails);
    await checkoutPage.proceedToPayment();
    await paymentPage.performPaymentWithCardForLoggedInUsers();
    await orderSuccessfulPage.verifyOrderSuccessfulPageDisplayedForLoggedinUsers();
    await homePage.NavigateToMyAccountTab();
    await myAccountPage.signOutFromAccount();
  
}); 
test(' Guest Checkout ( login with existing account)',  async ({ homePage, regionPlansPage,cartPage,checkoutPage,loginPage,paymentPage, orderSuccessfulPage,myAccountPage}) => {     
   
    await homePage.gotoHomepage(testData.Environment.url);
    await homePage.navigateToEuropeRegionPlansPage();
    await regionPlansPage.selectplanInEuropeRegion();
    await cartPage.proceedToCheckoutFromCart();
    await checkoutPage.GuestCheckoutLoginWithExistingAccount();
    await loginPage.verifyRedirectionAndCompleteLoadToLoginPage();
    await loginPage.fillLoginDetailsAndSubmit(testData.ValidLoginDetails);
    await checkoutPage.proceedToPayment();
    await paymentPage.performPaymentWithCardForLoggedInUsers();
    await orderSuccessfulPage.verifyOrderSuccessfulPageDisplayedForLoggedinUsers(); 
    await homePage.NavigateToMyAccountTab();
    await myAccountPage.signOutFromAccount();

});     