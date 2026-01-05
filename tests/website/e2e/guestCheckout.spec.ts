import { Page, expect, test } from "@playwright/test";
import { HomePage } from "../../../Pages/home.page";
test("Guest Checkout", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
});