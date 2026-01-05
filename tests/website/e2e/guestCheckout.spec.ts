import { test, expect } from '../../../fixtures/page-manager';

test('Guest checkout', async ({ homePage }) => {
    // homePage is already initialized and ready to go!
    await homePage.goto();
    await homePage.assertVisibiltyOfHeroBannerHeading();
  

});