import { test, expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { TopUpOption, UnlimitedTopUpOption, TopUpBalance } from './index';

export class TopUpPage extends BasePage {
    private readonly topUpPageLocators = {
        hdgSelectTopUp:             this.page.getByRole('heading', { name: 'Select a top-up' }),
        topUpOptionTitles:          this.page.getByText(/^\d+GB for \d+ Days$/),
        unlimitedTopUpOptionTitles: this.page.getByText(/^Unlimited for \d+ Days$/),
        lblDataValue:               this.page.getByText('Data', { exact: true }).locator('xpath=following-sibling::span[1]'),
        lblValidityValue:           this.page.getByText('Validity', { exact: true }).locator('xpath=following-sibling::span[1]'),
        txtValidityStartsAfterExpiryNote: this.page.getByText(/^Bundle validity will be/),
        txtDataAvailableAfterExpiryNote: this.page.getByText(/will be available after the expiration of current data plan$/),
        txtUnlimitedLostWarning: this.page.getByText(/^Your plan is unlimited for \d+ more days\./),
        btnCheckout:                this.page.getByRole('button', { name: 'Checkout', exact: true }),
        hdgOrderSummary:            this.page.getByRole('heading', { name: 'Order Summary' }),
        txtOrderSummaryItemName:    this.page.getByRole('heading', { level: 3 }),
        txtOrderSummaryItemDetails: this.page.getByText(/^\d+ GB, \d+ Days$/),
        txtOrderSummaryItemDetailsUnlimited: this.page.getByText(/^Unlimited, \d+ Days$/),
    };

    constructor(page: Page) {
        super(page);
    }

    async verifyTopUpModalOpened() {
        await test.step('Verify the Select a top-up modal is opened', async () => {
            await expect(this.topUpPageLocators.hdgSelectTopUp).toBeVisible();
        });
    }

    async getBalanceBeforeTopUp(): Promise<TopUpBalance> {
        return await test.step('Read current balance before top-up', async () => {
            const dataText = await this.topUpPageLocators.lblDataValue.innerText();
            const validityText = await this.topUpPageLocators.lblValidityValue.innerText();

            const dataMatch = dataText.match(/([\d.]+)\s*GB left of\s*([\d.]+)\s*GB/i);
            const validityMatch = validityText.match(/(\d+)\s*days?\s*left/i);

            return {
                dataRemainingGb: parseFloat(dataMatch?.[1] ?? '0'),
                dataTotalGb: parseFloat(dataMatch?.[2] ?? '0'),
                validityDaysRemaining: parseInt(validityMatch?.[1] ?? '0', 10),
            };
        });
    }

    async getValidityDaysRemainingBeforeTopUp(): Promise<number> {
        return await test.step('Read validity days remaining before top-up', async () => {
            const validityText = await this.topUpPageLocators.lblValidityValue.innerText();
            const validityMatch = validityText.match(/(\d+)\s*days?\s*left/i);
            return parseInt(validityMatch?.[1] ?? '0', 10);
        });
    }

    async selectUnlimitedTopUpOption(index: number): Promise<UnlimitedTopUpOption> {
        return await test.step(`Select unlimited top-up option #${index}`, async () => {
            const option = this.topUpPageLocators.unlimitedTopUpOptionTitles.nth(index);
            const titleText = await option.innerText();
            const priceText = await option.locator('xpath=following-sibling::span[1]').innerText();
            const titleMatch = titleText.match(/Unlimited for (\d+) Days/i);

            await option.click();

            return {
                validityDays: parseInt(titleMatch?.[1] ?? '0', 10),
                price: priceText.replace(/^USD\s*/i, '').trim(),
            };
        });
    }

    async selectTopUpOption(index: number): Promise<TopUpOption> {
        return await test.step(`Select top-up option #${index}`, async () => {
            const option = this.topUpPageLocators.topUpOptionTitles.nth(index);
            const titleText = await option.innerText();
            const priceText = await option.locator('xpath=following-sibling::span[1]').innerText();
            const titleMatch = titleText.match(/(\d+)GB for (\d+) Days/i);

            await option.click();

            return {
                dataGb: parseInt(titleMatch?.[1] ?? '0', 10),
                validityDays: parseInt(titleMatch?.[2] ?? '0', 10),
                price: priceText.replace(/^USD\s*/i, '').trim(),
            };
        });
    }

    async verifyBalanceAfterTopUpMatchesRule(before: TopUpBalance, option: TopUpOption) {
        await test.step('Verify balance after top-up: data is added on top, validity takes the higher value (not summed)', async () => {
            const dataAfterText = await this.topUpPageLocators.lblDataValue.innerText();
            const validityAfterText = await this.topUpPageLocators.lblValidityValue.innerText();

            const dataAfterMatch = dataAfterText.match(/([\d.]+)\s*GB/i);
            const validityAfterMatch = validityAfterText.match(/(\d+)\s*Days?/i);

            const dataAfterGb = parseFloat(dataAfterMatch?.[1] ?? '0');
            const validityAfterDays = parseInt(validityAfterMatch?.[1] ?? '0', 10);

            expect(dataAfterGb).toBeCloseTo(before.dataRemainingGb + option.dataGb, 1);
            expect(validityAfterDays).toBe(Math.max(before.validityDaysRemaining, option.validityDays));
        });
    }

    async verifyUnlimitedBalanceAfterTopUpMatchesRule(option: UnlimitedTopUpOption) {
        await test.step('Verify balance after unlimited top-up: data stays Unlimited, validity becomes the new bundle\'s days and only starts once the current one expires', async () => {
            await expect(this.topUpPageLocators.lblDataValue).toHaveText('Unlimited');
            await expect(this.topUpPageLocators.lblValidityValue).toHaveText(`${option.validityDays} Days`);
            await expect(this.topUpPageLocators.txtValidityStartsAfterExpiryNote).toHaveText(
                `Bundle validity will be ${option.validityDays} Days (it will start after the expiration of current data plan)`
            );
        });
    }

    async verifyLimitedBalanceAfterTopUpOnUnlimitedEsimMatchesRule(validityDaysRemainingBeforeTopUp: number, option: TopUpOption) {
        await test.step('Verify balance after topping up an unlimited eSIM with a limited bundle: the eSIM stays unlimited until its current validity expires, then switches to the top-up\'s limited data and validity', async () => {
            await expect(this.topUpPageLocators.txtUnlimitedLostWarning).toHaveText(
                `Your plan is unlimited for ${validityDaysRemainingBeforeTopUp} more days. After that, your top-up will be activated, the plan will no longer be unlimited and will use the top-up’s data and validity.`
            );
            await expect(this.topUpPageLocators.lblDataValue).toHaveText(`${option.dataGb}GB`);
            await expect(this.topUpPageLocators.txtDataAvailableAfterExpiryNote).toHaveText(
                `${option.dataGb}GB will be available after the expiration of current data plan`
            );
            await expect(this.topUpPageLocators.lblValidityValue).toHaveText(`${option.validityDays} Days`);
            await expect(this.topUpPageLocators.txtValidityStartsAfterExpiryNote).toHaveText(
                `Bundle validity will be ${option.validityDays} Days (it will start after the expiration of current data plan)`
            );
        });
    }

    async clickCheckout() {
        await test.step('Click Checkout button on the top-up modal', async () => {
            await this.topUpPageLocators.btnCheckout.click();
        });
    }

    async verifyCheckoutOrderSummaryMatchesTopUpOption(option: TopUpOption, regionName: string) {
        await test.step('Verify the top-up checkout Order Summary matches the selected top-up option', async () => {
            await expect(this.topUpPageLocators.hdgOrderSummary).toBeVisible();
            await expect(this.topUpPageLocators.txtOrderSummaryItemName).toHaveText(`${regionName} ${option.dataGb}GB`);
            await expect(this.topUpPageLocators.txtOrderSummaryItemDetails).toHaveText(`${option.dataGb} GB, ${option.validityDays} Days`);
            await expect(this.page.getByText(`USD ${option.price}`).first()).toBeVisible();
        });
    }

    async verifyCheckoutOrderSummaryMatchesUnlimitedTopUpOption(option: UnlimitedTopUpOption, regionName: string) {
        await test.step('Verify the top-up checkout Order Summary matches the selected unlimited top-up option', async () => {
            await expect(this.topUpPageLocators.hdgOrderSummary).toBeVisible();
            await expect(this.topUpPageLocators.txtOrderSummaryItemName).toHaveText(`${regionName} Unlimited Data`);
            await expect(this.topUpPageLocators.txtOrderSummaryItemDetailsUnlimited).toHaveText(`Unlimited, ${option.validityDays} Days`);
            await expect(this.page.getByText(`USD ${option.price}`).first()).toBeVisible();
        });
    }
}
