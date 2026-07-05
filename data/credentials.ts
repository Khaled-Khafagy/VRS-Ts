import { GuestInfo, LoginInfo, BillingAddressInfo, CreditCardDetails, SSOInfo } from '../Pages/index';

export const ValidLoginDetails: LoginInfo = {
    email: process.env.TEST_EMAIL ?? '',
    password: process.env.TEST_PASSWORD ?? '',
};

export const GuestUserData: GuestInfo = {
    firstName: process.env.Exiting_Guest_User_Firt_Name ?? '',
    lastName: process.env.Exiting_Guest_User_Last_Name ?? '',
    email: process.env.TEST_EMAIL ?? '',
};

export const InvalidLoginDetails: LoginInfo = {
    email: process.env.INVALID_LOGIN_EMAIL ?? '',
    password: process.env.INVALID_LOGIN_PASSWORD ?? '',
};

export const emptyLoginDetails: LoginInfo = {
    email: '',
    password: '',
};

export const emptyEmailLoginDetails: LoginInfo = {
    email: '',
    password: process.env.INVALID_LOGIN_PASSWORD ?? '',
};

export const emptyPasswordLoginDetails: LoginInfo = {
    email: process.env.INVALID_LOGIN_EMAIL ?? '',
    password: '',
};

export const PaymentDetails: CreditCardDetails = {
    number: process.env.PAYMENT_CARD_NUMBER ?? '',
    expiry: process.env.PAYMENT_EXPIRY ?? '',
    cvc: process.env.PAYMENT_CVC ?? '',
    name: process.env.PAYMENT_NAME ?? '',
};

export const BillingDetails: BillingAddressInfo = {
    country: process.env.BILLING_COUNTRY ?? '',
    state: process.env.BILLING_STATE ?? '',
    city: process.env.BILLING_CITY ?? '',
    addressLine1: process.env.BILLING_ADDRESS_LINE1 ?? '',
    addressLine2: process.env.BILLING_ADDRESS_LINE2 ?? '',
    zipCode: process.env.BILLING_ZIP_CODE ?? '',
};

export const LoginErrorMessages = {
    invalidCredentials: 'Invalid Credentials',
    emailRequired: 'Email or phone number is required',
    passwordRequired: 'Password is required',
};

export const SSOCredentials: SSOInfo = {
    email: process.env.SSO_EMAIL ?? '',
    pin:   process.env.SSO_PIN ?? '',
};

export const AppUrls = {
    base: process.env.BASE_URL ?? '',
    login: process.env.LOGIN_URL ?? '',
    ourDestinations: process.env.OUR_DESTINATIONS_URL ?? '',
};

export const RegistrationTestData = {
    validPassword:          process.env.REGISTRATION_TEST_PASSWORD ?? '',
    mismatchedPassword:     process.env.REGISTRATION_MISMATCHED_PASSWORD ?? '',
    otp:                    process.env.REGISTRATION_OTP ?? '',
    invalidEmailFormat:     process.env.REGISTRATION_INVALID_EMAIL_FORMAT ?? '',
    existingEmail:          process.env.TEST_EMAIL ?? '',
    firstName:              process.env.REGISTRATION_TEST_FIRST_NAME ?? '',
    lastName:               process.env.REGISTRATION_TEST_LAST_NAME ?? '',
    country:                process.env.REGISTRATION_COUNTRY ?? '',
    stateProvince:          process.env.REGISTRATION_STATE_PROVINCE ?? '',
    countryWithState:       process.env.REGISTRATION_COUNTRY_WITH_STATE ?? '',
    countryWithoutState:    process.env.REGISTRATION_COUNTRY_WITHOUT_STATE ?? '',
};

export const TravelTogetherPlanPromoCode = 'VF-EMPLOYEEDSC2025';

export const RefundReasons = {
    noLongerNeeded: 'E-SIM is no longer needed: My travel plans have changed',
};

export const RegistrationErrorMessages = {
    emailAlreadyExists: 'Your e-mail address already exists',
    invalidEmailFormat: 'Format is invalid. Please, enter a valid one.',
    passwordMismatch: 'Password does not match',
    firstNameRequired: 'First name is required',
    lastNameRequired: 'Family name is required',
    emailRequired: 'Email is required',
    passwordRequired: 'Password is required',
    confirmPasswordRequired : 'Confirmed password is required'
};



