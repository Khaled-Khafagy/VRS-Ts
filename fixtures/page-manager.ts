import { test as base } from '@playwright/test';
import { DestinationOption, pickRandomDestination, pickRandomRegion } from '../utils/testDataGenerator';
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
import { RegistationPage } from '../Pages/RegistationPage';
import { MyEsimsPage } from '../Pages/MyEsimsPage';
import { EsimDetailsPage } from '../Pages/EsimDetailsPage';
import { SSOPage } from '../Pages/SSOPage';
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
    registrationPage: RegistationPage;
    myEsimsPage: MyEsimsPage;
    esimDetailsPage: EsimDetailsPage;
    ssoPage: SSOPage;
    randomDestination: DestinationOption;
    twoRandomRegions: [DestinationOption, DestinationOption];
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
        // Force sign-out after every test (pass or fail) to free the limited session
        try {
            const avatar = page.locator('div.avatar_overlay__bto13x9:visible');
            if (await avatar.isVisible({ timeout: 3000 })) {
                await avatar.click();
                await page.getByRole('button', { name: 'Sign Out' }).click({ timeout: 5000 });
            }
        } catch {
            // Session already closed or user not logged in — nothing to do
        }
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
    },

    registrationPage: async ({ page }, use) => {
        const registrationPage = new RegistationPage(page);
        await use(registrationPage);
    },

    myEsimsPage: async ({ page }, use) => {
        const myEsimsPage = new MyEsimsPage(page);
        await use(myEsimsPage);
    },

    esimDetailsPage: async ({ page }, use) => {
        const esimDetailsPage = new EsimDetailsPage(page);
        await use(esimDetailsPage);
    },

    ssoPage: async ({ page }, use) => {
        const ssoPage = new SSOPage(page);
        await use(ssoPage);
    },

    randomDestination: async ({}, use) => {
        await use(pickRandomDestination());
    },

    twoRandomRegions: async ({}, use) => {
        await use([pickRandomRegion(), pickRandomRegion()]);
    },

    // Add other pages here
});