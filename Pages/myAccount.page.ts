import {test, expect, Page, } from '@playwright/test';  
import { BasePage } from './base.page';
import { sign } from 'node:crypto';
export class MyAccountPage extends BasePage {
    private readonly myAccountPageLocators = {
        // My Account page locators
        signOutButton: this.page.getByRole('button', { name: 'Sign Out' }),
       
    };

    constructor(page: Page) {
        super(page);
    }

    async signOutFromAccount(){
        await test.step('Sign Out from My Account', async () => {
        await this.myAccountPageLocators.signOutButton.click();
        console.log("Clicked on Sign Out button to log out from account.");
    })  
    }

}