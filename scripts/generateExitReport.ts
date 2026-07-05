import * as fs from 'fs';
import * as path from 'path';

// ── Types ───────────────────────────────────────────────────────────────────

interface TestError {
  message?: string;
  value?: string;
}

interface TestResultEntry {
  status: string;
  duration: number;
  errors: TestError[];
  retry: number;
  startTime?: string;
}

interface TestEntry {
  status: string;
  results: TestResultEntry[];
  projectName?: string;
}

interface Spec {
  title: string;
  ok: boolean;
  tests: TestEntry[];
  file?: string;
  line?: number;
}

interface Suite {
  title: string;
  specs?: Spec[];
  suites?: Suite[];
  file?: string;
}

interface PlaywrightStats {
  startTime: string;
  duration: number;
  expected: number;
  unexpected: number;
  flaky: number;
  skipped: number;
}

interface PlaywrightReport {
  suites: Suite[];
  stats: PlaywrightStats;
  errors: TestError[];
}

interface FlatResult {
  suiteName: string;
  title: string;
  status: 'passed' | 'failed' | 'skipped' | 'flaky';
  duration: number;
  error: string;
  retries: number;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function collectSpecs(suite: Suite, parentName: string, out: FlatResult[]): void {
  const suiteName = suite.title || parentName;

  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests) {
      const lastResult = test.results[test.results.length - 1];
      const rawStatus = test.status as string;

      let status: FlatResult['status'] = 'passed';
      if (rawStatus === 'unexpected') status = 'failed';
      else if (rawStatus === 'expected') status = 'passed';
      else if (rawStatus === 'flaky') status = 'flaky';
      else if (rawStatus === 'skipped') status = 'skipped';
      else if (rawStatus === 'failed') status = 'failed';

      const errorMsg = lastResult?.errors
        ?.map(e => e.message ?? e.value ?? '')
        .join(' ')
        .replace(/\x1B\[[0-9;]*m/g, '')  // strip ANSI
        .trim()
        .split('\n')[0] ?? '';

      out.push({
        suiteName,
        title: spec.title,
        status,
        duration: lastResult?.duration ?? 0,
        error: errorMsg,
        retries: test.results.length - 1,
      });
    }
  }

  for (const child of suite.suites ?? []) {
    collectSpecs(child, suiteName, out);
  }
}

function msToHuman(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  if (m === 0) return `${s}s`;
  return `${m}m ${s % 60}s`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
  });
}

// ── Main ─────────────────────────────────────────────────────────────────────

const RESULTS_PATH = path.resolve('test-results/results.json');
const HTML_OUT     = path.resolve('test-results/exit-report.html');
const MD_OUT       = path.resolve('test-results/exit-report.md');

if (!fs.existsSync(RESULTS_PATH)) {
  console.error(`❌  No results found at ${RESULTS_PATH}. Run Playwright with --reporter=json first.`);
  process.exit(1);
}

const report: PlaywrightReport = JSON.parse(fs.readFileSync(RESULTS_PATH, 'utf-8'));
const stats = report.stats;

const allResults: FlatResult[] = [];
for (const suite of report.suites) {
  collectSpecs(suite, suite.title, allResults);
}

const total   = allResults.length;
const passed  = allResults.filter(r => r.status === 'passed').length;
const failed  = allResults.filter(r => r.status === 'failed').length;
const flaky   = allResults.filter(r => r.status === 'flaky').length;
const skipped = allResults.filter(r => r.status === 'skipped').length;
const passRate = total > 0 ? Math.round(((passed + flaky) / total) * 100) : 0;

// Count distinct automated TCs (all specs in this run are automated)
const automatedCount = total;
// Automation % = automated / total. Since we only run automated tests,
// this serves as the base for the JIRA automation coverage metric.

const failedTests = allResults.filter(r => r.status === 'failed' || r.status === 'flaky');
const runDate     = formatDate(stats.startTime);
const duration    = msToHuman(stats.duration);

// ── HTML Report ──────────────────────────────────────────────────────────────

const failedRows = failedTests.length === 0
  ? `<tr><td colspan="5" style="text-align:center;color:#888;padding:20px">No failures — all tests passed ✓</td></tr>`
  : failedTests.map(r => `
    <tr>
      <td>${escHtml(r.suiteName)}</td>
      <td>${escHtml(r.title)}</td>
      <td><span class="badge ${r.status === 'flaky' ? 'flaky' : 'fail'}">${r.status}</span></td>
      <td>${msToHuman(r.duration)}</td>
      <td class="error-msg">${escHtml(r.error || '—')}</td>
    </tr>`).join('');

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>VRS Test Exit Report</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f4f4; color: #222; }

    header {
      background: #E60000;
      color: #fff;
      padding: 24px 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    header h1 { font-size: 22px; font-weight: 700; letter-spacing: 0.5px; }
    header .meta { font-size: 13px; opacity: 0.9; text-align: right; line-height: 1.6; }

    main { max-width: 1100px; margin: 32px auto; padding: 0 24px; }

    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    .card {
      background: #fff;
      border-radius: 8px;
      padding: 20px 16px;
      text-align: center;
      box-shadow: 0 1px 4px rgba(0,0,0,.08);
    }
    .card .number { font-size: 36px; font-weight: 700; }
    .card .label  { font-size: 12px; color: #666; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
    .card.pass  .number { color: #22a854; }
    .card.fail  .number { color: #E60000; }
    .card.skip  .number { color: #f5a623; }
    .card.flaky .number { color: #9b59b6; }
    .card.total .number { color: #333; }
    .card.dur   .number { font-size: 24px; color: #333; }

    .bars { background: #fff; border-radius: 8px; padding: 20px 24px; margin-bottom: 32px; box-shadow: 0 1px 4px rgba(0,0,0,.08); }
    .bar-row { margin-bottom: 14px; }
    .bar-row label { font-size: 13px; color: #555; display: flex; justify-content: space-between; margin-bottom: 6px; }
    .bar-bg { background: #e9ecef; border-radius: 4px; height: 12px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 4px; transition: width .4s; }
    .bar-pass  { background: #22a854; }
    .bar-auto  { background: #E60000; }

    section { background: #fff; border-radius: 8px; padding: 20px 24px; margin-bottom: 32px; box-shadow: 0 1px 4px rgba(0,0,0,.08); }
    section h2 { font-size: 15px; font-weight: 600; margin-bottom: 16px; border-bottom: 1px solid #eee; padding-bottom: 10px; }

    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { background: #f8f8f8; text-align: left; padding: 10px 12px; font-weight: 600; color: #444; border-bottom: 2px solid #eee; }
    td { padding: 9px 12px; border-bottom: 1px solid #f0f0f0; vertical-align: top; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #fafafa; }
    .error-msg { color: #c0392b; font-family: monospace; font-size: 12px; max-width: 400px; word-break: break-word; }

    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .badge.fail  { background: #fdecea; color: #c0392b; }
    .badge.flaky { background: #f3e6ff; color: #7d3c98; }

    footer { text-align: center; font-size: 12px; color: #aaa; padding: 20px 0 40px; }
  </style>
</head>
<body>

<header>
  <div>
    <h1>VRS — Test Exit Report</h1>
    <div style="font-size:13px;opacity:.85;margin-top:4px">Travel eSIM · Pre-Production</div>
  </div>
  <div class="meta">
    <div><strong>Run Date:</strong> ${runDate}</div>
    <div><strong>Duration:</strong> ${duration}</div>
    <div><strong>Environment:</strong> vrs.preprod.travel.vodafone.com</div>
  </div>
</header>

<main>

  <div class="cards">
    <div class="card total">
      <div class="number">${total}</div>
      <div class="label">Total Tests</div>
    </div>
    <div class="card pass">
      <div class="number">${passed}</div>
      <div class="label">Passed</div>
    </div>
    <div class="card fail">
      <div class="number">${failed}</div>
      <div class="label">Failed</div>
    </div>
    <div class="card flaky">
      <div class="number">${flaky}</div>
      <div class="label">Flaky</div>
    </div>
    <div class="card skip">
      <div class="number">${skipped}</div>
      <div class="label">Skipped</div>
    </div>
    <div class="card dur">
      <div class="number">${duration}</div>
      <div class="label">Total Duration</div>
    </div>
  </div>

  <div class="bars">
    <div class="bar-row">
      <label><span>Pass Rate</span><span>${passRate}%</span></label>
      <div class="bar-bg"><div class="bar-fill bar-pass" style="width:${passRate}%"></div></div>
    </div>
    <div class="bar-row">
      <label><span>Automated TCs (this run)</span><span>${automatedCount} / ${total}</span></label>
      <div class="bar-bg"><div class="bar-fill bar-auto" style="width:100%"></div></div>
    </div>
  </div>

  <section>
    <h2>Failed &amp; Flaky Tests (${failedTests.length})</h2>
    <table>
      <thead>
        <tr>
          <th>Suite</th>
          <th>Test Name</th>
          <th>Status</th>
          <th>Duration</th>
          <th>Error</th>
        </tr>
      </thead>
      <tbody>
        ${failedRows}
      </tbody>
    </table>
  </section>

  <section>
    <h2>All Test Results</h2>
    <table>
      <thead>
        <tr>
          <th>Suite</th>
          <th>Test Name</th>
          <th>Status</th>
          <th>Duration</th>
          <th>Retries</th>
        </tr>
      </thead>
      <tbody>
        ${allResults.map(r => `
        <tr>
          <td>${escHtml(r.suiteName)}</td>
          <td>${escHtml(r.title)}</td>
          <td style="color:${r.status === 'passed' ? '#22a854' : r.status === 'skipped' ? '#f5a623' : r.status === 'flaky' ? '#9b59b6' : '#E60000'};font-weight:600">${r.status}</td>
          <td>${msToHuman(r.duration)}</td>
          <td>${r.retries}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </section>

</main>

<footer>
  Generated by VRS Automation Framework · ${new Date().toISOString()} · C2 General — Travel eSIM Testing Strategy
</footer>

</body>
</html>`;

fs.writeFileSync(HTML_OUT, html, 'utf-8');
console.log(`✅  HTML exit report → ${HTML_OUT}`);

// ── Markdown Report ──────────────────────────────────────────────────────────

const failedMdRows = failedTests.length === 0
  ? '| — | — | — | — | All tests passed |'
  : failedTests.map(r =>
      `| ${r.suiteName} | ${r.title} | ${r.status} | ${msToHuman(r.duration)} | ${r.error.replace(/\|/g, '\\|').slice(0, 120)} |`
    ).join('\n');

const md = `# VRS Test Exit Report

> **Environment:** vrs.preprod.travel.vodafone.com · **Run Date:** ${runDate} · **Duration:** ${duration}

## Summary

| Metric | Value |
|--------|-------|
| Total Tests | ${total} |
| ✅ Passed | ${passed} |
| ❌ Failed | ${failed} |
| 🔁 Flaky | ${flaky} |
| ⏭ Skipped | ${skipped} |
| Pass Rate | **${passRate}%** |
| Automated TCs | ${automatedCount} |

## Failed & Flaky Tests

| Suite | Test Name | Status | Duration | Error |
|-------|-----------|--------|----------|-------|
${failedMdRows}

## All Results

| Suite | Test Name | Status | Duration |
|-------|-----------|--------|----------|
${allResults.map(r => `| ${r.suiteName} | ${r.title} | ${r.status} | ${msToHuman(r.duration)} |`).join('\n')}

---
*Generated by VRS Automation Framework — ${new Date().toISOString()}*
`;

fs.writeFileSync(MD_OUT, md, 'utf-8');
console.log(`✅  Markdown exit report → ${MD_OUT}`);
