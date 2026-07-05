import { test as setup } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { setupTimeout } from '../playwright.config';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');
const CF_SESSION_COOKIE = 'CF_AppSession';
const EXPIRY_BUFFER_MS  = 5 * 60 * 1000; // re-auth 5 min before actual expiry

setup('Cloudflare SSO authentication', async ({ page }) => {
    setup.setTimeout(setupTimeout);

    if (fs.existsSync(authFile)) {
        const stored = JSON.parse(fs.readFileSync(authFile, 'utf8'));
        const cookies: Array<{ name: string; expires: number }> = stored?.cookies ?? [];
        const hasCookies = cookies.length > 0;
        const cfSession = cookies.find(c => c.name === CF_SESSION_COOKIE);
        const cfSessionValid = cfSession && cfSession.expires > 0
            && (cfSession.expires * 1000) - Date.now() > EXPIRY_BUFFER_MS;

        if (hasCookies && cfSessionValid) {
            const expiresIn = Math.round(((cfSession!.expires * 1000) - Date.now()) / 60000);
            console.log(`Reusing cached SSO session (CF_Session expires in ${expiresIn} min)`);
            return;
        }
        if (!hasCookies) {
            console.log('Cached session file is empty — re-authenticating.');
        } else {
            console.log('CF_Session cookie expired or missing — re-authenticating.');
        }
    }

    console.log('\n>>> SSO session missing or expired.');
    console.log('>>> A browser window will open. Complete authentication manually, then wait.\n');

    await page.goto(process.env.BASE_URL ?? '');

    // Wait up to 3 minutes for you to complete auth and land on the app
    await page.waitForURL(
        url => {
            const href = url.toString();
            return !href.includes('microsoftonline.com')
                && !href.includes('cloudflareaccess.com')
                && !href.includes('device.login');
        },
        { timeout: setupTimeout }
    );

    fs.mkdirSync(path.dirname(authFile), { recursive: true });
    await page.context().storageState({ path: authFile });
    const saved = JSON.parse(fs.readFileSync(authFile, 'utf8'));
    const cfSession = saved?.cookies?.find((c: { name: string; expires: number }) => c.name === CF_SESSION_COOKIE);
    const expiresIn = cfSession?.expires > 0
        ? Math.round((cfSession.expires * 1000 - Date.now()) / 60000)
        : '?';
    console.log(`SSO session saved — CF_Session valid for ~${expiresIn} more minutes.`);
});
