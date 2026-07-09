import { test, expect } from "./support/fixtures";
import type { Page } from "@playwright/test";

const heading = (page: Page) => page.getByRole("heading", { level: 1, name: "Our Purpose" });

test.describe("Single page cartridge", () => {
  test.beforeEach(async ({ loadByUpload }) => {
    await loadByUpload("single-page.imscc");
  });

  test("Header and assignment is displayed", async ({ page }) => {
    await expect(heading(page)).toBeVisible();
    await expect(page.locator("header")).toBeVisible();
  });

  test("Content is displayed", async ({ page }) => {
    await expect(heading(page)).toBeVisible();
  });
});

test.describe("Single page cartridge (compact)", () => {
  test.beforeEach(async ({ loadByUpload }) => {
    await loadByUpload("single-page.imscc", { query: "compact" });
  });

  test("Header and Nav is hidden", async ({ page }) => {
    await expect(heading(page)).toBeVisible();
    await expect(page.locator("header")).toHaveCount(0);
    await expect(page.locator("nav")).toHaveCount(0);
  });
});
