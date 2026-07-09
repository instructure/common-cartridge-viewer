import { test, expect } from "./support/fixtures";
import { TIMEOUTS } from "./support/timeouts";
import type { Page } from "@playwright/test";

const pageLink = (page: Page, name: string) => page.getByRole("link", { name });
const mathJax = (page: Page) => page.locator("mjx-container.MathJax").first();

test.describe("LaTeX Equations", () => {
  test.beforeEach(async ({ loadByUpload }) => {
    await loadByUpload("latex.imscc");
  });

  test("Page 1 displays MathJax", async ({ page }) => {
    await pageLink(page, "Page 1").click();
    await expect(mathJax(page)).toBeVisible({ timeout: TIMEOUTS.load });
  });

  test("Page 2 displays MathJax", async ({ page }) => {
    await pageLink(page, "Page 2").click();
    await expect(mathJax(page)).toBeVisible({ timeout: TIMEOUTS.load });
  });
});
