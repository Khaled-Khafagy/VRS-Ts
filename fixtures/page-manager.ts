import { test as base } from '@playwright/test';
import { HomePage } from '../Pages/HomePage';
import { RegionPlansPage } from '../Pages/RegionPlansPage';
import { CartPage } from '../Pages/CartPage';
import { CheckoutPage } from '../Pages/CheckoutPage';
import { PaymentPage } from '../Pages/PaymentPage';   
import { OrderSuccessfulPage } from '../Pages/OrderSuccessfulPage'; 
import { LoginPage } from '../Pages/LoginPage';
import { MyAccountPage } from '../Pages/MyAccountPage';
import { EmailVerificationPage } from '../Pages/EmailVerificationPage';
import { LoginOrSignupPage } from '../Pages/LoginOrSignupPage';
import { OurDestinationsPage } from '../Pages/OurDestinationsPage';
// Import other pages as you create them

// 1. Define a type for your fixtures
type MyFixtures = {
    homePage: HomePage;
    regionPlansPage: RegionPlansPage;   
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
    paymentPage: PaymentPage;   
    orderSuccessfulPage: OrderSuccessfulPage;
    loginPage: LoginPage;
    loginOrSignupPage: LoginOrSignupPage;
    myAccountPage: MyAccountPage; 
    emailVerificationPage: EmailVerificationPage;
    ourDestinationsPage: OurDestinationsPage;
    // Add other pages here
};

// Custom page fixture that skips teardown if KEEP_BROWSER is set
const customPage = base.extend({
    page: async ({ page }, use) => {
        await use(page);
        // Skip browser teardown if environment variable is set
        if (process.env.KEEP_BROWSER) {
            // Don't close the page/browser
            return;
        }
        // Otherwise, normal teardown happens automatically
    },
});
   

// 2. Extend the base test with your custom pages
export const test = customPage.extend<MyFixtures>({
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },
    regionPlansPage: async ({ page }, use) => {
        const regionPlansPage = new RegionPlansPage(page);
        await use(regionPlansPage);
    }
    ,
    cartPage: async ({ page }, use) => {
        const cartPage = new CartPage(page);
        await use(cartPage);
    },      
    checkoutPage: async ({ page }, use) => {
        const checkoutPage = new CheckoutPage(page);
        await use(checkoutPage);
    }
    ,
    paymentPage: async ({ page }, use) => {
        const paymentPage = new PaymentPage(page);
        await use(paymentPage);
    }   
    ,
    orderSuccessfulPage: async ({ page }, use) => {
        const orderSuccessfulPage = new OrderSuccessfulPage(page);
        await use(orderSuccessfulPage);
    }   
    ,
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    }    
    ,    myAccountPage: async ({ page }, use) => {
        const myAccountPage = new MyAccountPage(page);
        await use(myAccountPage);
    }         
    , 
    loginOrSignupPage: async ({ page }, use) => {
        const loginOrSignupPage = new LoginOrSignupPage(page);
        await use(loginOrSignupPage);
    },
    
    emailVerificationPage: async ({ page }, use) => {
        const emailVerificationPage = new EmailVerificationPage(page);
        await use(emailVerificationPage);
    },
    
    ourDestinationsPage: async ({ page }, use) => {
        const ourDestinationsPage = new OurDestinationsPage(page);
        await use(ourDestinationsPage);
    }

    // Add other pages here
});