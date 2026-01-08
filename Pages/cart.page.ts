import { expect,Page,test } from "@playwright/test";
import { BasePage } from "./base.page";     
export class CartPage extends BasePage  {
    private readonly cartPageLocators = {
        // Cart page locators
        continueToCheckoutButton: this.page.getByRole('button', { name: 'Continue to checkout' }),


    }
    constructor(page:Page) {

        super(page);
      }

        async proceedToCheckoutFromCart(){
            await test.step('Proceed to Checkout from Cart Page', async () => { 
            await this.assertContinueToCheckoutButtonIsEnabled();
            await this.cartPageLocators.continueToCheckoutButton.click();
            console.log("Proceeded to checkout from cart page.");
        });}

        
        async assertContinueToCheckoutButtonIsEnabled(){
            await expect(this.cartPageLocators.continueToCheckoutButton).toBeEnabled();
            console.log("Continue to checkout button is enabled in cart page.");
        }











    };