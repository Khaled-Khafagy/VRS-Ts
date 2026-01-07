import { test as base } from '@playwright/test';
import { HomePage } from '../Pages/home.page';
import { RegionPlansPage } from '../Pages/Region.plans.page';
// Import other pages as you create them

// 1. Define a type for your fixtures
type MyFixtures = {
    homePage: HomePage;
    regionPlansPage: RegionPlansPage;   
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
});

export { expect } from '@playwright/test';