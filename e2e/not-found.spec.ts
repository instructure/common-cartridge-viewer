import { test, expect } from "./support/fixtures";
import type { Page } from "@playwright/test";

const failedToLoad = (page: Page) =>
  page.locator("span", { hasText: "Failed to load resource" }).first();

test.describe("Accessibility Workshop cartridge", () => {
  test("Resources not found in imsmanifest.xml", async ({ page }) => {
    await page.goto(`/?manifest=${encodeURIComponent("/test-cartridges/doesnot/exist.xml")}`);
    await expect(failedToLoad(page)).toBeVisible();
  });

  test("Failed to load cartridge", async ({ page }) => {
    await page.goto(`/?manifest=${encodeURIComponent("/test-cartridges/doesnotexist.imscc")}`);
    await expect(failedToLoad(page)).toBeVisible();
  });

  test("Cartridge loaded, but resource not found", async ({ page, loadByUpload }) => {
    await loadByUpload("course-1.imscc");
    await page.evaluate(() => {
      window.location.hash = "#/resources/notfound";
    });
    await expect(page.locator("span", { hasText: "Resource Unavailable" }).first()).toBeVisible();
  });
});
