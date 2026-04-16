import {test, expect, Page, } from '@playwright/test';  
import { BasePage } from './BasePage';
import { sign } from 'node:crypto';
export class MyAccountPage extends BasePage {
    private readonly myAccountPageLocators = {
        // My Account page locators
        btnSignOut: this.page.getByRole('button', { name: 'Sign Out' }),
       
    };

    constructor(page: Page) {
        super(page);
    }

    async signOutFromAccount(){
        await test.step('Sign Out from My Account', async () => {
        await this.myAccountPageLocators.btnSignOut.click();
      
    })  
    }

}