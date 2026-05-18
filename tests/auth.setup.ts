import { test as setup } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');
const SESSION_TTL_HOURS = 23;

setup('Cloudflare SSO authentication', async ({ page }) => {
    if (fs.existsSync(authFile)) {
        const ageHours = (Date.now() - fs.statSync(authFile).mtimeMs) / (1000 * 60 * 60);
        if (ageHours < SESSION_TTL_HOURS) {
            console.log(`Reusing cached SSO session (${Math.round(ageHours)}h old — valid for ${SESSION_TTL_HOURS}h)`);
            return;
        }
    }

    console.log('\n>>> SSO session missing or expired.');
    console.log('>>> A browser window will open. Complete Windows Hello authentication, then wait.\n');

    await page.goto(process.env.BASE_URL ?? '');

    // Wait up to 2 minutes for the user to complete Windows Hello and land back on VRS
    await page.waitForURL(/vrs\.preprod\.travel\.vodafone\.com/, { timeout: 120000 });

    fs.mkdirSync(path.dirname(authFile), { recursive: true });
    await page.context().storageState({ path: authFile });
    console.log('SSO session saved — tests will reuse this for the next 23 hours.');
});
