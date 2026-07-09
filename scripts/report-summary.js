const fs = require("fs");

const reportPath = "report/e2e-report.json";
if (!fs.existsSync(reportPath)) {
  process.exit(0);
}

const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
const stats = report.stats || {};

const failed = [];
const flaky = [];

const walk = (suites) => {
  for (const suite of suites || []) {
    for (const spec of suite.specs || []) {
      for (const test of spec.tests || []) {
        const name = `${spec.title} [${test.projectName}]`;
        if (test.status === "unexpected") {
          failed.push(name);
        } else if (test.status === "flaky") {
          flaky.push(name);
        }
      }
    }
    walk(suite.suites);
  }
};
walk(report.suites);

const passed = stats.expected || 0;
const failedCount = stats.unexpected || 0;
const flakyCount = stats.flaky || 0;
const skipped = stats.skipped || 0;
const total = passed + failedCount + flakyCount + skipped;
const passRate = total ? Math.round((passed / total) * 100) : 0;
const seconds = Math.round((stats.duration || 0) / 1000);

let md = "## E2E test results\n\n";
md += `**${passRate}% pass** — ✅ ${passed} passed · ❌ ${failedCount} failed · ⚠️ ${flakyCount} flaky · ⚪ ${skipped} skipped · ${seconds}s\n\n`;

if (failed.length) {
  md += "### ❌ Failed\n\n" + failed.map((f) => `- ${f}`).join("\n") + "\n\n";
}

if (flaky.length) {
  md += "### ⚠️ Flaky\n\n" + flaky.map((f) => `- ${f}`).join("\n") + "\n\n";
}

const summaryFile = process.env.GITHUB_STEP_SUMMARY;
if (summaryFile) {
  fs.appendFileSync(summaryFile, md);
} else {
  process.stdout.write(md);
}
