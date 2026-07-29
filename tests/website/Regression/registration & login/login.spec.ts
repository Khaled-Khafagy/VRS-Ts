import { test } from '../../../../fixtures/page-manager';
import { ValidLoginDetails, InvalidLoginDetails, emptyLoginDetails, emptyEmailLoginDetails, emptyPasswordLoginDetails, AppUrls, LoginErrorMessages } from '../../../../data/credentials';

test.describe('Login', () => {
    test('Login with valid credentials', { tag: ['@regression', '@P1'] }, async ({ loginOrSignupPage, loginPage, homePage, myAccountPage }) => {
        await loginOrSignupPage.navigateToLoginOrSignUpPage(AppUrls.login);
        await loginOrSignupPage.proceedWithLogin();
        await loginPage.verifyRedirectionAndCompleteLoadToLoginPage();
        await loginPage.fillLoginDetailsAndSubmit(ValidLoginDetails);
        await homePage.navigateToMyAccountTab();
        await myAccountPage.signOutFromAccount();
    });

    test('Login with invalid credentials', { tag: ['@regression', '@P2'] }, async ({ loginOrSignupPage, loginPage }) => {
        await loginOrSignupPage.navigateToLoginOrSignUpPage(AppUrls.login);
        await loginOrSignupPage.proceedWithLogin();
        await loginPage.verifyRedirectionAndCompleteLoadToLoginPage();
        await loginPage.fillLoginDetailsAndSubmit(InvalidLoginDetails);
        await loginPage.verifyErrorMessageForInvalidUsername(LoginErrorMessages.invalidCredentials);
    });

    test('Login with empty credentials', { tag: ['@regression', '@P2'] }, async ({ loginOrSignupPage, loginPage }) => {
        await loginOrSignupPage.navigateToLoginOrSignUpPage(AppUrls.login);
        await loginOrSignupPage.proceedWithLogin();
        await loginPage.verifyRedirectionAndCompleteLoadToLoginPage();
        await loginPage.fillLoginDetailsAndSubmit(emptyLoginDetails);
        await loginPage.verifyErrorMessageForEmptyEmail(LoginErrorMessages.emailRequired);
    });

    test('Login with empty email', { tag: ['@regression', '@P2'] }, async ({ loginOrSignupPage, loginPage }) => {
        await loginOrSignupPage.navigateToLoginOrSignUpPage(AppUrls.login);
        await loginOrSignupPage.proceedWithLogin();
        await loginPage.verifyRedirectionAndCompleteLoadToLoginPage();
        await loginPage.fillLoginDetailsAndSubmit(emptyEmailLoginDetails);
        await loginPage.verifyErrorMessageForEmptyEmail(LoginErrorMessages.emailRequired);
    });

    test('Login with empty password', { tag: ['@regression', '@P2'] }, async ({ loginOrSignupPage, loginPage }) => {
        await loginOrSignupPage.navigateToLoginOrSignUpPage(AppUrls.login);
        await loginOrSignupPage.proceedWithLogin();
        await loginPage.verifyRedirectionAndCompleteLoadToLoginPage();
        await loginPage.fillLoginDetailsAndSubmit(emptyPasswordLoginDetails);
        await loginPage.verifyErrorMessageForEmptyPassword(LoginErrorMessages.passwordRequired);
    });

    test('Cancel login navigates back to VRS', { tag: ['@regression', '@P3'] }, async ({ loginOrSignupPage, loginPage }) => {
        await loginOrSignupPage.navigateToLoginOrSignUpPage(AppUrls.login);
        await loginOrSignupPage.proceedWithLogin();
        await loginPage.verifyRedirectionAndCompleteLoadToLoginPage();
        await loginPage.clickCancelButton();
        await loginPage.verifyNavigationBackToVRS();
    });

    test('Forgot password link navigates to reset password page', { tag: ['@regression', '@P3'] }, async ({ loginOrSignupPage, loginPage }) => {
        await loginOrSignupPage.navigateToLoginOrSignUpPage(AppUrls.login);
        await loginOrSignupPage.proceedWithLogin();
        await loginPage.verifyRedirectionAndCompleteLoadToLoginPage();
        await loginPage.clickForgotPasswordLink();
        await loginPage.verifyNavigationToForgotPasswordPage();
    });
});
