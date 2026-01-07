import { test } from '../../../fixtures/page-manager';

test('Guest checkout', async ({ homePage, regionPlansPage }) => {
    // homePage is already initialized and ready to go!
    await homePage.gotoHomepage();
    await homePage.navigateToEuropeRegionPlansPage();
    await regionPlansPage.selectplanInEuropeRegion();
    // You can add more steps here as needed
  

});