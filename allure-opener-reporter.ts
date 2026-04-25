import { Reporter } from '@playwright/test/reporter';
import { spawn, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

class AllureOpenerReporter implements Reporter {
  onBegin() {
    const resultsDir = path.resolve(__dirname, 'allure-results');
    const reportDir = path.resolve(__dirname, 'allure-report');
    if (fs.existsSync(resultsDir)) fs.rmSync(resultsDir, { recursive: true, force: true });
    if (fs.existsSync(reportDir)) fs.rmSync(reportDir, { recursive: true, force: true });
  }

  onEnd() {
    if (process.env.CI) return;

    const root = path.resolve(__dirname);
    try {
      execSync('npx allure generate allure-results --clean -o allure-report', { cwd: root, stdio: 'inherit' });
      spawn('npx', ['allure', 'open', 'allure-report'], {
        cwd: root,
        detached: true,
        stdio: 'ignore',
      }).unref();
    } catch (e) {
      console.error('[allure-opener] error:', e);
    }
  }
}

export default AllureOpenerReporter;
