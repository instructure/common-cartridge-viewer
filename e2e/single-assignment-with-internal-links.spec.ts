import { test, expect } from "./support/fixtures";
import type { Page } from "@playwright/test";

const ASSIGNMENT_HASH = "#/resources/iaa4b4fdadec793530c31c58a249e0879";

const gotoAssignment = (page: Page) =>
  page.evaluate((hash) => {
    window.location.hash = hash;
  }, ASSIGNMENT_HASH);

const richContentLink = (page: Page, name: string) =>
  page.locator(".RichContent a", { hasText: name }).first();

const DESCRIPTION_LINKS = [
  "wiki sample",
  "Docviewer Assignment",
  "Basic Quiz",
  "Google RCE Announcement",
  "Simple Discussion",
  "api mod 1",
];

const UNAVAILABLE_LINKS = [
  "wiki sample",
  "Docviewer Assignment",
  "Basic Quiz",
  "Google RCE Announcement",
  "Simple Discussion",
];

test.describe("Single assignment cartridge (with attachment)", () => {
  test.beforeEach(async ({ loadByUpload, page }) => {
    await loadByUpload("course-1.imscc");
    await gotoAssignment(page);
  });

  test("Description is displayed with links", async ({ page }) => {
    for (const name of DESCRIPTION_LINKS) {
      await expect(richContentLink(page, name)).toBeVisible();
    }
  });

  test("Unavailable resource links show proper message", async ({ page }) => {
    const unavailableResourceHeading = page
      .locator("span", { hasText: "Resource Unavailable" })
      .first();
    for (const name of UNAVAILABLE_LINKS) {
      await gotoAssignment(page);
      await expect(richContentLink(page, name)).toBeVisible();
      await richContentLink(page, name).click();
      await expect(unavailableResourceHeading).toBeVisible();
    }
  });
});
