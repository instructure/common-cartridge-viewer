import { test, expect } from "./support/fixtures";
import type { Page } from "@playwright/test";

const assignmentHeading = (page: Page) =>
  page.getByRole("heading", { level: 1, name: "Assignment" });

test.describe("Single assignment cartridge", () => {
  test.beforeEach(async ({ loadByUpload }) => {
    await loadByUpload("single-assignment.imscc");
  });

  test("Header and assignment is displayed", async ({ page }) => {
    await expect(assignmentHeading(page)).toBeVisible();
    await expect(page.locator("header")).toBeVisible();
  });

  test("Nav is hidden", async ({ page }) => {
    await expect(page.locator("nav")).toHaveCount(0);
  });
});

test.describe("Single assignment cartridge (with attachment, compact)", () => {
  test.beforeEach(async ({ loadByUpload }) => {
    await loadByUpload("single-assignment.imscc", { query: "compact" });
  });

  test("Only the assignment shows", async ({ page }) => {
    await expect(assignmentHeading(page)).toBeVisible();
    await expect(page.locator("nav")).toHaveCount(0);
    await expect(page.locator("header")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "All Items" })).toHaveCount(0);
  });
});
