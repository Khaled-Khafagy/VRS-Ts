import { execSync } from 'child_process';
import path from 'path';

export default async function globalTeardown() {
  if (process.env.CI) return;

  const root = path.resolve(__dirname);

  try {
    console.log('[teardown] generating allure report...');
    execSync('npx allure generate allure-results --clean -o allure-report', {
      cwd: root,
      stdio: 'inherit',
    });

    const reportPath = path.join(root, 'allure-report', 'index.html');
    console.log(`[teardown] opening ${reportPath}`);
    execSync(`open "${reportPath}"`);
    console.log('[teardown] done');
  } catch (e) {
    console.error('[teardown] error:', e);
  }
}
