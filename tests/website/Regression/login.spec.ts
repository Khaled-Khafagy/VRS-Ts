import { test } from '../../../fixtures/page-manager';
import * as testData from '../../../data/testData.json';

test('Login with valid credentials', async ({ loginOrSignupPage, loginPage }) => {
    await loginOrSignupPage.navigateToLoginOrSignUpPage(testData.LoginOrSignUpLink.url);
    await loginOrSignupPage.proceedWithLogin();
    await loginPage.verifyRedirectionAndCompleteLoadToLoginPage();
    await loginPage.fillLoginDetailsAndSubmit(testData.ValidLoginDetails);
});

test('Login with invalid credentials', async ({ loginOrSignupPage, loginPage }) => {
    await loginOrSignupPage.navigateToLoginOrSignUpPage(testData.LoginOrSignUpLink.url);
    await loginOrSignupPage.proceedWithLogin();
    await loginPage.verifyRedirectionAndCompleteLoadToLoginPage();
    await loginPage.fillLoginDetailsAndSubmit(testData.InvalidLoginDetails);
    await loginPage.verifyErrorMessageForInvalidCredentials(testData.InvalidLoginErrorMessage);

});
