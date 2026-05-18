import { test } from '../../../fixtures/page-manager';
import { AppUrls, RegistrationTestData, RegistrationErrorMessages } from '../../../data/credentials';

test.describe('Registration', () => {
    const navigate = async (loginOrSignupPage: any) => {
        await loginOrSignupPage.navigateToLoginOrSignUpPage(AppUrls.login);
        await loginOrSignupPage.proceedWithSignUp();
    };

    test('Register a new account with valid details', async ({ loginOrSignupPage, registrationPage }) => {
        await navigate(loginOrSignupPage);
        await registrationPage.fillDefaultForm();
        await registrationPage.submitRegistrationForm();
        await registrationPage.enterOTP(RegistrationTestData.otp);
        await registrationPage.verifyRegistrationSuccess();
    });

    test('Register with an already registered email shows error', async ({ loginOrSignupPage, registrationPage }) => {
        await navigate(loginOrSignupPage);
        await registrationPage.fillDefaultForm({ email: RegistrationTestData.existingEmail });
        await registrationPage.submitRegistrationForm();
        await registrationPage.enterOTP(RegistrationTestData.otp);
        await registrationPage.verifyErrorMessageForExistingEmail(RegistrationErrorMessages.emailAlreadyExists);
    });

    test('Register with an invalid email format shows validation error', async ({ loginOrSignupPage, registrationPage }) => {
        await navigate(loginOrSignupPage);
        await registrationPage.fillDefaultForm({ email: RegistrationTestData.invalidEmailFormat });
        await registrationPage.submitRegistrationForm();
        await registrationPage.verifyErrorMessageForInvalidEmailFormat(RegistrationErrorMessages.invalidEmailFormat);
    });

    test('Register with mismatched passwords shows error', async ({ loginOrSignupPage, registrationPage }) => {
        await navigate(loginOrSignupPage);
        await registrationPage.fillDefaultForm({ confirmPassword: RegistrationTestData.mismatchedPassword });
        await registrationPage.submitRegistrationForm();
        await registrationPage.verifyErrorMessageForPasswordMismatch(RegistrationErrorMessages.passwordMismatch);
    });

    test('Submit empty registration form shows required field errors', async ({ loginOrSignupPage, registrationPage }) => {
        await navigate(loginOrSignupPage);
        await registrationPage.submitRegistrationForm();
        await registrationPage.verifyErrorMessageForRequiredFields();
    });

    test('State Province dropdown is visible for USA', async ({ loginOrSignupPage, registrationPage }) => {
        await navigate(loginOrSignupPage);
        await registrationPage.selectCountry('USA');
        await registrationPage.verifyStateProvinceVisible(true);
    });

    test('State Province dropdown is visible for Canada', async ({ loginOrSignupPage, registrationPage }) => {
        await navigate(loginOrSignupPage);
        await registrationPage.selectCountry(RegistrationTestData.countryWithState);
        await registrationPage.verifyStateProvinceVisible(true);
    });

    test('State Province dropdown is hidden for non-US/Canada country', async ({ loginOrSignupPage, registrationPage }) => {
        await navigate(loginOrSignupPage);
        await registrationPage.selectCountry(RegistrationTestData.countryWithoutState);
        await registrationPage.verifyStateProvinceVisible(false);
    });

    test('Join with Google button is visible on registration form', async ({ loginOrSignupPage, registrationPage }) => {
        await navigate(loginOrSignupPage);
        await registrationPage.clickJoinWithGoogle();
    });

    test('Join with Apple button is visible on registration form', async ({ loginOrSignupPage, registrationPage }) => {
        await navigate(loginOrSignupPage);
        await registrationPage.clickJoinWithApple();
    });

    test('Terms and Conditions link opens in new tab', async ({ loginOrSignupPage, registrationPage }) => {
        await navigate(loginOrSignupPage);
        const popup = await registrationPage.clickTermsAndConditionsLink();
        await popup.waitForLoadState();
    });

    test('Privacy Notice link opens in new tab', async ({ loginOrSignupPage, registrationPage }) => {
        await navigate(loginOrSignupPage);
        const popup = await registrationPage.clickPrivacyNoticeLink();
        await popup.waitForLoadState();
    });

    test('Footer Privacy Policy link opens in new tab', async ({ loginOrSignupPage, registrationPage }) => {
        await navigate(loginOrSignupPage);
        const popup = await registrationPage.clickFooterPrivacyPolicy();
        await popup.waitForLoadState();
    });

    test('Footer Cookie Policy link opens in new tab', async ({ loginOrSignupPage, registrationPage }) => {
        await navigate(loginOrSignupPage);
        const popup = await registrationPage.clickFooterCookiePolicy();
        await popup.waitForLoadState();
    });

    test('Footer Terms and Conditions link opens in new tab', async ({ loginOrSignupPage, registrationPage }) => {
        await navigate(loginOrSignupPage);
        const popup = await registrationPage.clickFooterTermsAndConditions();
        await popup.waitForLoadState();
    });

    test('Login link navigates back to login page', async ({ loginOrSignupPage, registrationPage }) => {
        await navigate(loginOrSignupPage);
        await registrationPage.clickLoginLink();
    });
});
