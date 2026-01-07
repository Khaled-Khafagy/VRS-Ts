import { test as base } from '@playwright/test';
import { HomePage } from '../Pages/home.page';
import { RegionPlansPage } from '../Pages/Region.plans.page';
import { CartPage } from '../Pages/cart.page';
import { CheckoutPage } from '../Pages/checkout.page';
// Import other pages as you create them

// 1. Define a type for your fixtures
type MyFixtures = {
    homePage: HomePage;
    regionPlansPage: RegionPlansPage;   
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
    // Add other pages here
};
   

// 2. Extend the base test with your custom pages
export const test = base.extend<MyFixtures>({
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
    // Add other pages here
});

export { expect } from '@playwright/test';