import { test } from '../../../fixtures/page-manager';
import * as testData from '../../../data/testData.json';
import {generateGuestUserData} from '../../../utils/testDataGenerator';


test('Guest checkout for Non Existing User', async ({ homePage, regionPlansPage,cartPage,checkoutPage,paymentPage,orderSuccessfulPage }) => {
    
    await homePage.gotoHomepage();
    await homePage.navigateToEuropeRegionPlansPage();
    await regionPlansPage.selectplanInEuropeRegion();
    await cartPage.proceedToCheckoutFromCart();
    await checkoutPage.fillPersonalDetailsForNonExistingUser(generateGuestUserData());
    await checkoutPage.fillBillingAddressDetailsForUserAndProceedToPayment(testData.billingDetails);
    await checkoutPage.handleOTPVerificationNonExistingUser();
    await paymentPage.fillCardDetailsAndPay(testData.paymentDetails);
    await orderSuccessfulPage.verifyOrderSuccessfulPageDisplayed();
    
    

});
test.skip('Guest Checkout inserting Existing Account in E-mail field', async ({ homePage, regionPlansPage,cartPage,checkoutPage,loginPage,paymentPage,orderSuccessfulPage }) => {
   
    await homePage.gotoHomepage();
    await homePage.navigateToEuropeRegionPlansPage();
    await regionPlansPage.selectplanInEuropeRegion();
    await cartPage.proceedToCheckoutFromCart();
    await checkoutPage.fillPersonalDetailsForExistingUser(testData.GuestDetailsForalreadyRegisteredUser);
    await checkoutPage.fillBillingAddressDetailsForUserAndProceedToPayment(testData.billingDetails);
    await checkoutPage.handleOTPVerificationExistingUser();
    await loginPage.verifyRedirectionAndCompleteLoadToLoginPage();
    await loginPage.fillLoginDetailsAndSubmit(testData.ValidLoginDetails);
    await checkoutPage.assertRedirectionToChecoutPageWithUserLoggedinAndFieldsArefilled();
    await checkoutPage.proceedToPayment();
    await paymentPage.selectSaveCardAndPay();
    await orderSuccessfulPage.verifyOrderSuccessfulPageDisplayed();
  
}); 
test.skip(' Guest Checkout ( login with existing account)',  async ({ homePage, regionPlansPage,cartPage,checkoutPage,loginPage,paymentPage, orderSuccessfulPage}) => {     
   
    await homePage.gotoHomepage();
    await homePage.navigateToEuropeRegionPlansPage();
    await regionPlansPage.selectplanInEuropeRegion();
    await cartPage.proceedToCheckoutFromCart();
    await checkoutPage.GuestCheckoutLoginWithExistingAccount();
    await loginPage.verifyRedirectionAndCompleteLoadToLoginPage();
    await loginPage.fillLoginDetailsAndSubmit(testData.ValidLoginDetails);
    await checkoutPage.assertRedirectionToChecoutPageWithUserLoggedinAndFieldsArefilled(); 
    await checkoutPage.proceedToPayment();
    await paymentPage.selectSaveCardAndPay();
    await orderSuccessfulPage.verifyOrderSuccessfulPageDisplayed(); 



});     