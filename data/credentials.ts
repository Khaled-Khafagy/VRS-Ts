import { GuestInfo, LoginInfo, BillingAddressInfo, CreditCardDetails } from '../Pages/index';

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

export const ErrorMessages = {
    invalidCredentials: 'Invalid Credentials',
    emailRequired: 'Email or phone number is required',
    passwordRequired: 'Password is required',
};

export const AppUrls = {
    base: process.env.BASE_URL ?? '',
    login: process.env.LOGIN_URL ?? '',
    ourDestinations: process.env.OUR_DESTINATIONS_URL ?? '',
};
