import { defineConfig } from "@playwright/test";

export default defineConfig({
  reporter: [
    ["html", { open: "never" }],
    ["json", { outputFile: "report/e2e-report.json" }],
    ["junit", { outputFile: "report/e2e-junit.xml" }],
  ],
});
