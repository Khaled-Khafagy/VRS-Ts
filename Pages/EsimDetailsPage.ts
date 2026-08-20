import { test, expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class EsimDetailsPage extends BasePage {
    private readonly esimDetailsPageLocators = {
        btnScanQrCode:           this.page.getByRole('button', { name: 'Scan QR Code' }),
        btnEnterDetailsManually: this.page.getByRole('button', { name: 'Enter details manually' }),
        btnViewActivationGuide:  this.page.getByRole('button', { name: 'View activation guide' }),
        btnRequestRefund:        this.page.getByRole('button', { name: 'Request a refund' }),
        ddlRefundReason:         this.page.getByRole('combobox'),
        btnSubmit:               this.page.getByRole('button', { name: 'Submit' }),
        msgRefundSuccess:        this.page.getByText('The refund request is being'),
        msgEsimInstalled:        this.page.getByText('Your eSIM is installed'),
        txtPurchaseDate:         this.page.getByText('Purchase date', { exact: true }).first().locator('xpath=following-sibling::span[1]'),
    };

    private readonly refundEligibilityDays = 14;

    constructor(page: Page) {
        super(page);
    }

    async verifyEsimDetailsPageLoaded() {
        await test.step('Verify eSIM Details page is loaded', async () => {
            await expect(this.esimDetailsPageLocators.btnScanQrCode).toBeVisible();
        });
    }

    async verifyRequestRefundButtonVisible() {
        await test.step('Verify Request a refund button is visible', async () => {
            await expect(this.esimDetailsPageLocators.btnRequestRefund).toBeVisible();
        });
    }

    async verifyActiveEsimDetailsPageLoaded() {
        await test.step('Verify eSIM Details page is loaded for an active/installed eSIM', async () => {
            await expect(this.esimDetailsPageLocators.msgEsimInstalled).toBeVisible();
        });
    }

    async verifyRequestRefundButtonNotVisible() {
        await test.step('Verify Request a refund button is not shown', async () => {
            await expect(this.esimDetailsPageLocators.btnRequestRefund).not.toBeVisible();
        });
    }

    async clickRequestRefund() {
        await test.step('Click Request a refund button', async () => {
            await this.esimDetailsPageLocators.btnRequestRefund.click();
        });
    }

    async selectRefundReason(reason: string) {
        await test.step(`Select refund reason: ${reason}`, async () => {
            await this.esimDetailsPageLocators.ddlRefundReason.selectOption(reason);
        });
    }

    async submitRefundRequest() {
        await test.step('Submit refund request', async () => {
            await this.esimDetailsPageLocators.btnSubmit.click();
        });
    }

    async verifyRefundRequestSubmitted() {
        await test.step('Verify refund request was submitted successfully', async () => {
            await expect(this.esimDetailsPageLocators.msgRefundSuccess).toBeVisible();
        });
    }

    async verifyRefundButtonVisibilityMatchesPurchaseDateRule() {
        await test.step('Verify Request a refund button visibility matches the 14-day purchase-date rule', async () => {
            const purchaseDateText = await this.esimDetailsPageLocators.txtPurchaseDate.innerText();
            const purchaseDate = new Date(purchaseDateText);
            const daysSincePurchase = Math.floor((Date.now() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24));

            if (daysSincePurchase <= this.refundEligibilityDays) {
                await expect(this.esimDetailsPageLocators.btnRequestRefund).toBeVisible();
            } else {
                await expect(this.esimDetailsPageLocators.btnRequestRefund).not.toBeVisible();
            }
        });
    }
}
