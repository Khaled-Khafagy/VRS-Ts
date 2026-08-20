import { test, expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyEsimsPage extends BasePage {
    private readonly myEsimsPageLocators = {
        hdgMyEsims:    this.page.getByRole('heading', { name: /eSIM/i }),
        esimPlanCards: this.page.getByLabel('eSIM plan card'),
    };

    constructor(page: Page) {
        super(page);
    }

    private cardWithBadge(badgeText: string) {
        return this.myEsimsPageLocators.esimPlanCards.filter({ hasText: badgeText }).first();
    }

    private activeLimitedCard() {
        return this.myEsimsPageLocators.esimPlanCards.filter({ hasText: 'Active' }).filter({ hasNotText: 'Unlimited' }).first();
    }

    private activeUnlimitedCard() {
        return this.myEsimsPageLocators.esimPlanCards.filter({ hasText: 'Active' }).filter({ hasText: 'Unlimited' }).first();
    }

    async verifyMyEsimsPageLoaded() {
        await test.step('Verify My eSIMs page is loaded', async () => {
            await expect(this.myEsimsPageLocators.hdgMyEsims).toBeVisible();
        });
    }

    async verifyNotInstalledEsimPresent() {
        await test.step('Verify at least one Not Installed eSIM is present', async () => {
            await expect(this.cardWithBadge('Not installed')).toBeVisible();
        });
    }

    async clickViewDetailsOnFirstNotInstalledEsim() {
        await test.step('Click See details on first Not Installed eSIM', async () => {
            await this.cardWithBadge('Not installed').getByRole('button', { name: 'See details' }).click();
        });
    }

    async verifyActiveEsimPresent() {
        await test.step('Verify at least one Active eSIM is present', async () => {
            await expect(this.cardWithBadge('Active')).toBeVisible();
        });
    }

    async clickViewDetailsOnFirstActiveEsim() {
        await test.step('Click See details on first Active eSIM', async () => {
            await this.cardWithBadge('Active').getByRole('button', { name: 'See details' }).click();
        });
    }

    async verifyActiveLimitedEsimPresent() {
        await test.step('Verify at least one Active limited (non-unlimited) eSIM is present', async () => {
            await expect(this.activeLimitedCard()).toBeVisible();
        });
    }

    async verifyActiveUnlimitedEsimPresent() {
        await test.step('Verify at least one Active unlimited eSIM is present', async () => {
            await expect(this.activeUnlimitedCard()).toBeVisible();
        });
    }

    async clickTopUpOnFirstActiveLimitedEsim() {
        await test.step('Click Top-up on first Active limited eSIM', async () => {
            await this.activeLimitedCard().getByRole('button', { name: 'Top-up' }).click();
        });
    }

    async clickTopUpOnFirstActiveUnlimitedEsim() {
        await test.step('Click Top-up on first Active unlimited eSIM', async () => {
            await this.activeUnlimitedCard().getByRole('button', { name: 'Top-up' }).click();
        });
    }

    async getRegionNameOfFirstActiveLimitedEsim(): Promise<string> {
        return await test.step('Get the region/country name of the first Active limited eSIM', async () => {
            const cardText = await this.activeLimitedCard().innerText();
            return cardText.split('\n')[0].trim();
        });
    }

    async getRegionNameOfFirstActiveUnlimitedEsim(): Promise<string> {
        return await test.step('Get the region/country name of the first Active unlimited eSIM', async () => {
            const cardText = await this.activeUnlimitedCard().innerText();
            return cardText.split('\n')[0].trim();
        });
    }
}
