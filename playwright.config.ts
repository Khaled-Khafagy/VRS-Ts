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
  timeout: 120000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  /* */
  reporter: [['allure-playwright']],

  /**
   * 2. SHARED SETTINGS (The "Stealth" & "Bypass" layer)
   */
  use: {
    // /* FIX: The whitelisted header */
    // extraHTTPHeaders: {
    //   'x_vrs_automation': process.env.BYPASS_SECRET || 'guq1dtu2tfx@CXY2dpt'.trim(),
    // },

    /* FIX: Blank screen issues */
    ignoreHTTPSErrors: true,
    
    /* FIX: Window Resize/Minimize */
    headless: false, 
    viewport: null, // Required for --start-maximized to work correctly
    
    launchOptions: {
      args: [
        '--start-maximized', 
        '--disable-blink-features=AutomationControlled'
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
        // This is the missing piece: it cancels the default 1280x720 
        // that comes hidden inside the 'devices' object.
        viewport: null,
        deviceScaleFactor: undefined,
      },
    }
  ],
});