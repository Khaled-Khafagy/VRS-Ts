
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
    export interface loginInfo {
    email: string;
    password: string;
    }
