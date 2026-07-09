import { test, expect } from "./support/fixtures";
import type { Page } from "@playwright/test";

const resolvedImage = (page: Page) => page.locator('img[src^="data:"]').first();
const unresolvedTokenImage = (page: Page) => page.locator('img[src*="FILEBASE"]');

test.describe("Course with multiple pages but no modules", () => {
  test.beforeEach(async ({ loadByUpload }) => {
    await loadByUpload("rich-content-cc-file.imscc");
  });

  test("Image with $IMS-CC-FILEBASE$ is visible", async ({ page }) => {
    await expect(resolvedImage(page)).toBeVisible();
    await expect(unresolvedTokenImage(page)).toHaveCount(0);
  });

  test("Image with %24IMS_CC_FILEBASE%24/files is visible", async ({ page }) => {
    await expect(resolvedImage(page)).toBeVisible();
    await expect(unresolvedTokenImage(page)).toHaveCount(0);
  });
});
