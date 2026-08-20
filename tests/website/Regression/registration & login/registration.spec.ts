import { test } from '../../../../fixtures/page-manager';
import { AppUrls, RegistrationTestData, RegistrationErrorMessages } from '../../../../data/credentials';
import { generateAliasEmail } from '../../../../utils/testDataGenerator';
import { emailTestTimeout } from '../../../../playwright.config';

test.describe('Registration', () => {
    const navigate = async (loginOrSignupPage: any) => {
        await loginOrSignupPage.navigateToLoginOrSignUpPage(AppUrls.login);
        await loginOrSignupPage.proceedWithSignUp();
    };

    test('Register a new account with valid details', { tag: ['@regression', '@P1'] }, async ({ loginOrSignupPage, registrationPage }) => {
        test.setTimeout(emailTestTimeout);
        const sentAt = Date.now();
        const email = generateAliasEmail();
        await navigate(loginOrSignupPage);
        await registrationPage.fillDefaultForm({ email });
        await registrationPage.submitRegistrationForm();
        const otp = await registrationPage.getOTPFromEmail(email, sentAt);
        await registrationPage.enterOTP(otp);
        await registrationPage.verifyRegistrationSuccess();
        await registrationPage.verifyWelcomeEmailReceived(email, sentAt);
    });

    test('Register with an already registered email shows error', { tag: ['@regression', '@P2'] }, async ({ loginOrSignupPage, registrationPage }) => {
        test.setTimeout(emailTestTimeout);
        const sentAt = Date.now();
        await navigate(loginOrSignupPage);
        await registrationPage.fillDefaultForm({ email: RegistrationTestData.existingEmail });
        await registrationPage.submitRegistrationForm();
        await registrationPage.verifyErrorMessageForExistingEmail(RegistrationErrorMessages.emailAlreadyExists);
    });

    test('Register with an invalid email format shows validation error', { tag: ['@regression', '@P2'] }, async ({ loginOrSignupPage, registrationPage }) => {
        await navigate(loginOrSignupPage);
        await registrationPage.fillDefaultForm({ email: RegistrationTestData.invalidEmailFormat });
        await registrationPage.submitRegistrationForm();
        await registrationPage.verifyErrorMessageForInvalidEmailFormat(RegistrationErrorMessages.invalidEmailFormat);
    });

    test('Register with mismatched passwords shows error', { tag: ['@regression', '@P2'] }, async ({ loginOrSignupPage, registrationPage }) => {
        await navigate(loginOrSignupPage);
        await registrationPage.fillDefaultForm({ confirmPassword: RegistrationTestData.mismatchedPassword });
        await registrationPage.submitRegistrationForm();
        await registrationPage.verifyErrorMessageForPasswordMismatch(RegistrationErrorMessages.passwordMismatch);
    });

    test('Submit empty registration form shows required field errors', { tag: ['@regression', '@P2'] }, async ({ loginOrSignupPage, registrationPage }) => {
        await navigate(loginOrSignupPage);
        await registrationPage.submitRegistrationForm();
        await registrationPage.verifyErrorMessageForRequiredFields();
    });

    test('Register with a password shorter than 8 characters shows too weak error', { tag: ['@regression', '@P2'] }, async ({ loginOrSignupPage, registrationPage }) => {
        await navigate(loginOrSignupPage);
        await registrationPage.fillDefaultForm({ password: 'Ab1@567', confirmPassword: 'Ab1@567' });
        await registrationPage.submitRegistrationForm();
        await registrationPage.verifyPasswordTooShortError();
    });

    test('Register with a password meeting fewer than 3 character categories shows too weak error', { tag: ['@regression', '@P2'] }, async ({ loginOrSignupPage, registrationPage }) => {
        await navigate(loginOrSignupPage);
        await registrationPage.fillDefaultForm({ password: 'abcdefg1', confirmPassword: 'abcdefg1' });
        await registrationPage.submitRegistrationForm();
        await registrationPage.verifyPasswordTooWeakError();
    });

    test('Password requirements checklist updates live as the password is typed', { tag: ['@regression', '@P3'] }, async ({ loginOrSignupPage, registrationPage }) => {
        await navigate(loginOrSignupPage);

        await registrationPage.fillEmail(generateAliasEmail());
        await registrationPage.fillPassword('abc');
        await registrationPage.fillConfirmPassword('abc');
        await registrationPage.verifyPasswordRuleAchieved('Small letters', true);
        await registrationPage.verifyPasswordRuleAchieved('Uppercase letters', false);
        await registrationPage.verifyPasswordRuleAchieved('Numbers', false);
        await registrationPage.verifyPasswordRuleAchieved('Special characters', false);
        await registrationPage.submitForm();
        await registrationPage.verifyPasswordTooShortError();

        await registrationPage.fillPassword('Abcdefg1');
        await registrationPage.verifyPasswordRuleAchieved('Uppercase letters', true);
        await registrationPage.verifyPasswordRuleAchieved('Small letters', true);
        await registrationPage.verifyPasswordRuleAchieved('Numbers', true);
        await registrationPage.verifyPasswordRuleAchieved('Special characters', false);
    });

    test('State Province dropdown is visible for USA', { tag: ['@regression', '@P3'] }, async ({ loginOrSignupPage, registrationPage }) => {
        await navigate(loginOrSignupPage);
        await registrationPage.selectCountry('USA');
        await registrationPage.verifyStateProvinceVisible(true);
    });

    test('State Province dropdown is visible for Canada', { tag: ['@regression', '@P3'] }, async ({ loginOrSignupPage, registrationPage }) => {
        await navigate(loginOrSignupPage);
        await registrationPage.selectCountry(RegistrationTestData.countryWithState);
        await registrationPage.verifyStateProvinceVisible(true);
    });

    test('State Province dropdown is hidden for non-US/Canada country', { tag: ['@regression', '@P3'] }, async ({ loginOrSignupPage, registrationPage }) => {
        await navigate(loginOrSignupPage);
        await registrationPage.selectCountry(RegistrationTestData.countryWithoutState);
        await registrationPage.verifyStateProvinceVisible(false);
    });

    test('Join with Google button is visible on registration form', { tag: ['@regression', '@P3'] }, async ({ loginOrSignupPage, registrationPage }) => {
        await navigate(loginOrSignupPage);
        await registrationPage.clickJoinWithGoogle();
    });

    test('Join with Apple button is visible on registration form', { tag: ['@regression', '@P3'] }, async ({ loginOrSignupPage, registrationPage }) => {
        await navigate(loginOrSignupPage);
        await registrationPage.clickJoinWithApple();
    });

    test('Terms and Conditions link opens in new tab', { tag: ['@regression', '@P3'] }, async ({ loginOrSignupPage, registrationPage }) => {
        await navigate(loginOrSignupPage);
        const popup = await registrationPage.clickTermsAndConditionsLink();
        await popup.waitForLoadState();
    });

    test('Privacy Notice link opens in new tab', { tag: ['@regression', '@P3'] }, async ({ loginOrSignupPage, registrationPage }) => {
        await navigate(loginOrSignupPage);
        const popup = await registrationPage.clickPrivacyNoticeLink();
        await popup.waitForLoadState();
    });

    test('Footer Privacy Policy link opens in new tab', { tag: ['@regression', '@P3'] }, async ({ loginOrSignupPage, registrationPage }) => {
        await navigate(loginOrSignupPage);
        const popup = await registrationPage.clickFooterPrivacyPolicy();
        await popup.waitForLoadState();
    });

    test('Footer Cookie Policy link opens in new tab', { tag: ['@regression', '@P3'] }, async ({ loginOrSignupPage, registrationPage }) => {
        await navigate(loginOrSignupPage);
        const popup = await registrationPage.clickFooterCookiePolicy();
        await popup.waitForLoadState();
    });

    test('Footer Terms and Conditions link opens in new tab', { tag: ['@regression', '@P3'] }, async ({ loginOrSignupPage, registrationPage }) => {
        await navigate(loginOrSignupPage);
        const popup = await registrationPage.clickFooterTermsAndConditions();
        await popup.waitForLoadState();
    });

    test('Login link navigates back to login page', { tag: ['@regression', '@P3'] }, async ({ loginOrSignupPage, registrationPage }) => {
        await navigate(loginOrSignupPage);
        await registrationPage.clickLoginLink();
    });
});
