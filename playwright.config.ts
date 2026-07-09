import { defineConfig, devices } from "@playwright/test";
import type { ReporterDescription } from "@playwright/test";

const baseURL = process.env.CCV_BASE_URL || "http://localhost:5000";
const isLocal = baseURL.includes("localhost");

const reporter: ReporterDescription[] = process.env.CI
  ? [
      ["list"],
      ["github"],
      ["blob", process.env.PW_BLOB ? { fileName: `report-${process.env.PW_BLOB}.zip` } : {}],
    ]
  : [["list"], ["html", { open: "never" }], ["junit", { outputFile: "report/e2e-junit.xml" }]];

export default defineConfig({
  testDir: "./e2e",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter,
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  ...(isLocal
    ? {
        webServer: {
          command: "node_modules/.bin/superstatic -p 5000 ./build -s",
          url: "http://localhost:5000",
          reuseExistingServer: !process.env.CI,
          timeout: 60_000,
        },
      }
    : {}),
});
