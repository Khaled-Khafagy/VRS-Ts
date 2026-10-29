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

    const rawPort = process.env.ALLURE_PORT ?? '4040';
    const port = /^\d+$/.test(rawPort) ? rawPort : '4040';
    const root = path.resolve(__dirname);
    try {
      // Kill any existing server on the port so the URL stays the same across runs
      try {
        if (process.platform === 'win32') {
          execSync(
            `powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }"`,
            { stdio: 'ignore' }
          );
        } else {
          execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: 'ignore' });
        }
      } catch {}

      execSync('npx allure generate allure-results --clean -o allure-report', { cwd: root, stdio: 'inherit' });
      spawn('npx', ['allure', 'open', '--port', port, 'allure-report'], {
        cwd: root,
        detached: true,
        stdio: 'ignore',
        shell: process.platform === 'win32',
      }).unref();
    } catch (e) {
      console.error('[allure-opener] error:', e);
    }
  }
}

export default AllureOpenerReporter;
