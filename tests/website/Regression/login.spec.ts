import { test } from '../../../fixtures/page-manager';
import { ValidLoginDetails, InvalidLoginDetails, emptyLoginDetails, emptyEmailLoginDetails, emptyPasswordLoginDetails, AppUrls, ErrorMessages } from '../../../data/credentials';

test('Login with valid credentials', async ({ loginOrSignupPage, loginPage, homePage, myAccountPage }) => {
    await loginOrSignupPage.navigateToLoginOrSignUpPage(AppUrls.login);
    await loginOrSignupPage.proceedWithLogin();
    await loginPage.verifyRedirectionAndCompleteLoadToLoginPage();
    await loginPage.fillLoginDetailsAndSubmit(ValidLoginDetails);
    await homePage.navigateToMyAccountTab();
    await myAccountPage.signOutFromAccount();
});

test('Login with invalid credentials', async ({ loginOrSignupPage, loginPage }) => {
    await loginOrSignupPage.navigateToLoginOrSignUpPage(AppUrls.login);
    await loginOrSignupPage.proceedWithLogin();
    await loginPage.verifyRedirectionAndCompleteLoadToLoginPage();
    await loginPage.fillLoginDetailsAndSubmit(InvalidLoginDetails);
    await loginPage.verifyErrorMessageForInvalidUsername(ErrorMessages.invalidCredentials);
});

test('Login with empty credentials', async ({ loginOrSignupPage, loginPage }) => {
    await loginOrSignupPage.navigateToLoginOrSignUpPage(AppUrls.login);
    await loginOrSignupPage.proceedWithLogin();
    await loginPage.verifyRedirectionAndCompleteLoadToLoginPage();
    await loginPage.fillLoginDetailsAndSubmit(emptyLoginDetails);
    await loginPage.verifyErrorMessageForEmptyEmail(ErrorMessages.emailRequired);
});

test('Login with empty email', async ({ loginOrSignupPage, loginPage }) => {
    await loginOrSignupPage.navigateToLoginOrSignUpPage(AppUrls.login);
    await loginOrSignupPage.proceedWithLogin();
    await loginPage.verifyRedirectionAndCompleteLoadToLoginPage();
    await loginPage.fillLoginDetailsAndSubmit(emptyEmailLoginDetails);
    await loginPage.verifyErrorMessageForEmptyEmail(ErrorMessages.emailRequired);
});

test('Login with empty password', async ({ loginOrSignupPage, loginPage }) => {
    await loginOrSignupPage.navigateToLoginOrSignUpPage(AppUrls.login);
    await loginOrSignupPage.proceedWithLogin();
    await loginPage.verifyRedirectionAndCompleteLoadToLoginPage();
    await loginPage.fillLoginDetailsAndSubmit(emptyPasswordLoginDetails);
    await loginPage.verifyErrorMessageForEmptyPassword(ErrorMessages.passwordRequired);
});

test('Cancel login navigates back to VRS', async ({ loginOrSignupPage, loginPage }) => {
    await loginOrSignupPage.navigateToLoginOrSignUpPage(AppUrls.login);
    await loginOrSignupPage.proceedWithLogin();
    await loginPage.verifyRedirectionAndCompleteLoadToLoginPage();
    await loginPage.clickCancelButton();
    await loginPage.verifyNavigationBackToVRS();
});

test('Forgot password link navigates to reset password page', async ({ loginOrSignupPage, loginPage }) => {
    await loginOrSignupPage.navigateToLoginOrSignUpPage(AppUrls.login);
    await loginOrSignupPage.proceedWithLogin();
    await loginPage.verifyRedirectionAndCompleteLoadToLoginPage();
    await loginPage.clickForgotPasswordLink();
    await loginPage.verifyNavigationToForgotPasswordPage();
});
