import { test } from '../../../../fixtures/page-manager';
import { ValidLoginDetails, AppUrls } from '../../../../data/credentials';

test.describe('Top-up', () => {
    test('Top-up a limited eSIM with a limited top-up bundle', { tag: ['@regression', '@P1'] }, async ({ loginPage, homePage, myAccountPage, myEsimsPage, topUpPage, checkoutPage, paymentPage }) => {
        await loginPage.navigateAndLogin(AppUrls.login, ValidLoginDetails);
        await homePage.navigateToMyAccountTab();
        await myAccountPage.clickEsimsTab();
        await myEsimsPage.verifyMyEsimsPageLoaded();
        await myEsimsPage.verifyActiveLimitedEsimPresent();
        const regionName = await myEsimsPage.getRegionNameOfFirstActiveLimitedEsim();
        await myEsimsPage.clickTopUpOnFirstActiveLimitedEsim();
        await topUpPage.verifyTopUpModalOpened();

        const balanceBeforeTopUp = await topUpPage.getBalanceBeforeTopUp();
        const selectedTopUpOption = await topUpPage.selectTopUpOption(0);
        await topUpPage.verifyBalanceAfterTopUpMatchesRule(balanceBeforeTopUp, selectedTopUpOption);

        await topUpPage.clickCheckout();
        await topUpPage.verifyCheckoutOrderSummaryMatchesTopUpOption(selectedTopUpOption, regionName);
        await checkoutPage.proceedToPaymentAsLoggedInUser();
        await paymentPage.verifyPaymentGatewayLoaded();
        await paymentPage.performPaymentWithCardForLoggedInUsers();
    });

    test('Top-up an unlimited eSIM with an unlimited top-up bundle', { tag: ['@regression', '@P1'] }, async ({ loginPage, homePage, myAccountPage, myEsimsPage, topUpPage, checkoutPage, paymentPage }) => {
        await loginPage.navigateAndLogin(AppUrls.login, ValidLoginDetails);
        await homePage.navigateToMyAccountTab();
        await myAccountPage.clickEsimsTab();
        await myEsimsPage.verifyMyEsimsPageLoaded();
        await myEsimsPage.verifyActiveUnlimitedEsimPresent();
        const regionName = await myEsimsPage.getRegionNameOfFirstActiveUnlimitedEsim();
        await myEsimsPage.clickTopUpOnFirstActiveUnlimitedEsim();
        await topUpPage.verifyTopUpModalOpened();

        const selectedTopUpOption = await topUpPage.selectUnlimitedTopUpOption(0);
        // Data stays Unlimited and the new bundle's validity only starts once the current
        // unlimited plan expires — it does not stack on top of the remaining validity.
        await topUpPage.verifyUnlimitedBalanceAfterTopUpMatchesRule(selectedTopUpOption);

        await topUpPage.clickCheckout();
        await topUpPage.verifyCheckoutOrderSummaryMatchesUnlimitedTopUpOption(selectedTopUpOption, regionName);
        await checkoutPage.proceedToPaymentAsLoggedInUser();
        await paymentPage.verifyPaymentGatewayLoaded();
        await paymentPage.performPaymentWithCardForLoggedInUsers();
    });

    test('Top-up an unlimited eSIM with a limited top-up bundle', { tag: ['@regression', '@P1'] }, async ({ loginPage, homePage, myAccountPage, myEsimsPage, topUpPage, checkoutPage, paymentPage }) => {
        await loginPage.navigateAndLogin(AppUrls.login, ValidLoginDetails);
        await homePage.navigateToMyAccountTab();
        await myAccountPage.clickEsimsTab();
        await myEsimsPage.verifyMyEsimsPageLoaded();
        await myEsimsPage.verifyActiveUnlimitedEsimPresent();
        const regionName = await myEsimsPage.getRegionNameOfFirstActiveUnlimitedEsim();
        await myEsimsPage.clickTopUpOnFirstActiveUnlimitedEsim();
        await topUpPage.verifyTopUpModalOpened();

        const validityDaysRemainingBeforeTopUp = await topUpPage.getValidityDaysRemainingBeforeTopUp();
        const selectedTopUpOption = await topUpPage.selectTopUpOption(0);
        // The eSIM stays unlimited until its current validity runs out — only then does it
        // switch over to the limited top-up's data and validity, it doesn't apply immediately.
        await topUpPage.verifyLimitedBalanceAfterTopUpOnUnlimitedEsimMatchesRule(validityDaysRemainingBeforeTopUp, selectedTopUpOption);

        await topUpPage.clickCheckout();
        await topUpPage.verifyCheckoutOrderSummaryMatchesTopUpOption(selectedTopUpOption, regionName);
        await checkoutPage.proceedToPaymentAsLoggedInUser();
        await paymentPage.verifyPaymentGatewayLoaded();
        await paymentPage.performPaymentWithCardForLoggedInUsers();
    });
});
