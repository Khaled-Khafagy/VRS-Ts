import {test, expect} from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';
import { loginScenarios } from '../Data/login.data';
test.describe ('VodafoneLogin - Full Suite', ()=> {
  
  for (const scenario of loginScenarios){
    test(scenario.name, async({page})=>{
      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      await loginPage.login(scenario.data.username, scenario.data.password);

      if (scenario.isPositive) {
        await expect(page).toHaveURL ('https://vrs.preprod.travel.vodafone.com/')
      }else{
        const error = await loginPage.getErrorMessage();
        expect (error). toContain(scenario.expectedError);
      }
    });
  
  }

});