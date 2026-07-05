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
    };

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
}
