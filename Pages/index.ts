
    export interface GuestInfo {
    firstName: string;
    lastName: string;
    email: string;
    }

    export interface NonExistingUser {
    firstName: string;
    lastName: string;
    email: string;
    }
    export interface BillingAddressInfo {
    country: string;
    city?: string;
    state?: string;
    addressLine1?: string;
    addressLine2?: string;
    zipCode?: string;
     }

    export interface CreditCardDetails {
     number: string;
    expiry: string;
    cvc: string;
    name: string;
    }
    export interface LoginInfo {
    email: string;
    password: string;
    }

    export interface SSOInfo {
    email: string;
    pin: string;
    }

    export interface RegistrationInfo {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    country: string;
    stateProvince?: string;
    }
