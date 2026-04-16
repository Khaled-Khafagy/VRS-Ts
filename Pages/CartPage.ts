import { expect,Page,test } from "@playwright/test";
import { BasePage } from "./BasePage";     
export class CartPage extends BasePage  {
    private readonly cartPageLocators = {
        // Cart page locators
        btnContinueToCheckout: this.page.getByRole('button', { name: 'Continue to checkout' }),


    }
    constructor(page:Page) {

        super(page);
      }

        async proceedToCheckoutFromCart(){
            await test.step('Proceed to Checkout from Cart Page', async () => { 
            await this.cartPageLocators.btnContinueToCheckout.click();
        });}

        
        











    };