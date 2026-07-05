import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

// ── Timeout constants (all configurable via env vars) ─────────────────────
export const emailTestTimeout  = parseInt(process.env.EMAIL_TEST_TIMEOUT  ?? '300000');
export const setupTimeout      = parseInt(process.env.SETUP_TIMEOUT       ?? '180000');
export const testTimeout       = parseInt(process.env.TEST_TIMEOUT        ?? '60000');
export const expectTimeout     = parseInt(process.env.EXPECT_TIMEOUT      ?? '60000');
export const actionTimeout     = parseInt(process.env.ACTION_TIMEOUT      ?? '30000');
export const navigationTimeout = parseInt(process.env.NAVIGATION_TIMEOUT  ?? '30000');
export const typingDelay       = parseInt(process.env.TYPING_DELAY        ?? '100');
export const shortDelay        = parseInt(process.env.SHORT_DELAY         ?? '300');
export const animationDelay    = parseInt(process.env.ANIMATION_DELAY     ?? '2000');

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  timeout: testTimeout,
  expect: { timeout: expectTimeout },
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : 4,

  reporter: [
    ['allure-playwright'],
    ['./allure-opener-reporter.ts'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],

  use: {
    ignoreHTTPSErrors: true,
    headless: !!process.env.CI,
    viewport: process.env.CI ? { width: 1920, height: 1080 } : null,

    launchOptions: {
      args: [
        ...(!process.env.CI ? ['--start-maximized'] : []),
        '--disable-blink-features=AutomationControlled',
      ],
    },

    actionTimeout: actionTimeout,
    navigationTimeout: navigationTimeout,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'setup',
      testMatch: '**/auth.setup.ts',
      use: { headless: false },
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
        viewport: process.env.CI ? { width: 1920, height: 1080 } : null,
        deviceScaleFactor: undefined,
      },
      dependencies: ['setup'],
    },
  ],
});
