import {expect,Page, test } from "@playwright/test";
import { BasePage } from "./base.page";

export class HomePage extends BasePage {
private readonly homePageLocators = {
    //header locators
 homepageHeaderlink : this.page.getByRole('link', { name: 'Homepage' }),
 ourDestinationsHeaderlink : this.page.getByRole('link', { name: 'Our Destinations' }),
 uefaHeaderlink : this.page.getByRole('link', { name: 'UEFA Champions League' }),
 abouteSIMHeaderlink : this.page.getByRole('link', { name: 'About eSIM' }),
 helpHeaderlink : this.page.getByRole('link', { name: 'Help' }),
 heroBannerHeading : this.page.getByRole('heading', { name: 'Save 20% on travel internet' }),
// cartHeaderlink : this.page.getByRole('link', { name: 'Cart' }), needs to be modified by Ahmed alamelden
//  languageAndCurrencyHeaderlink : this.page.getByRole('button', { name: 'Language and Currency' }),needs to be modified by Ahmed alamelden
userProfileIconAsLoggeedin: this.page.locator('div.avatar_overlay__bto13x9:visible'),

 

 //popular regions locators//
europeRegionExploreButton :this.page.locator("a[href='/our-destinations/europe']"),
};



constructor(page: Page) {
    super(page);
  }
  async gotoHomepage() {
    await test.step('Navigate to Home Page and Accept cookies', async () => {
    await this.navigateToHomePage('https://r10-test.digitalretail.vodafone.com/vrs-taas-portal/');
    await this.acceptCookies();
    await this.assertVisibiltyOfHeroBannerHeading();

    });}
  async assertVisibiltyOfHeroBannerHeading(){
    await expect(this.homePageLocators.heroBannerHeading).toBeVisible();
 console.log("Hero banner heading is visible.");
}

async assertUserIsLoggedIn(){
    await test.step('Assert User is logged in by checking user profile icon', async () => {
    await expect(this.homePageLocators.userProfileIconAsLoggeedin).toBeVisible();
    console.log("User is logged in, profile icon is visible.");
});}  
async navigateToEuropeRegionPlansPage(){
    await test.step('Navigate to Europe Region Plans Page', async () => {   
    await this.homePageLocators.europeRegionExploreButton.click();
    console.log("Navigated to Europe region plans page.");  });}



















  };
