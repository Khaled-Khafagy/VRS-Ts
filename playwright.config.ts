import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

/**
 * 1. FIX: Load .env file
 * Ensure you have run: npm install dotenv
 */
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  timeout: 60000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  /* */
  reporter: [['allure-playwright']],

  /**
   * 2. SHARED SETTINGS (The "Stealth" & "Bypass" layer)
   */
  use: {

    /* FIX: Blank screen issues */
    ignoreHTTPSErrors: true,
    
    headless: !!process.env.CI,
    viewport: process.env.CI ? { width: 1920, height: 1080 } : null,

    launchOptions: {
      args: [
        ...(!process.env.CI ? ['--start-maximized'] : []),
        '--disable-blink-features=AutomationControlled',
      ],
    },

    /* */
    actionTimeout: 20000,
    navigationTimeout: 60000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  /**
   * 3. PROJECTS
   */
  projects: [
    {
     name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: process.env.CI ? { width: 1920, height: 1080 } : null,
        deviceScaleFactor: undefined,
      },
    }
  ],
});