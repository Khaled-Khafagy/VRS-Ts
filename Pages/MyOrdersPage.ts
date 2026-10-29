import { test, expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { TopUpOption } from './index';

export class MyOrdersPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async verifyTopUpOrderCompleted(regionName: string, option: TopUpOption) {
        const productName = `${regionName} ${option.dataGb}GB`;
        await test.step(`Verify '${productName}' order shows Completed status`, async () => {
            await expect(this.page.getByText(productName, { exact: true }).nth(0)).toBeVisible();
            await expect(this.page.getByText('Pending')).toHaveCount(0);
            await expect(this.page.getByText('Completed').first()).toBeVisible();
        });
    }
}
