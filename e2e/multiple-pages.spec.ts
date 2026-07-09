import { test, expect } from "./support/fixtures";
import type { Page } from "@playwright/test";

const pageListItem = (page: Page, title: string) => page.locator("li", { hasText: title }).first();

test.describe("Course with multiple pages but no modules", () => {
  test.beforeEach(async ({ loadByUpload }) => {
    await loadByUpload("multiple-pages.imscc");
  });

  test("Both page titles are displayed", async ({ page }) => {
    await expect(pageListItem(page, "First Page")).toBeVisible();
    await expect(pageListItem(page, "Second Page")).toBeVisible();
    await expect(pageListItem(page, "Third Page")).toBeVisible();
  });

  test("Link to page with standard wiki_reference", async ({ page }) => {
    await page.getByRole("link", { name: "Pages (3)" }).click();
    await expect(page.getByRole("link", { name: "Second Page" })).toBeVisible();
    await page.getByRole("link", { name: "Second Page" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Second Page" })).toBeVisible();
    await page.getByRole("link", { name: "Third Page" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Third Page" })).toBeVisible();
  });

  test("Link to page with decoded wiki_reference", async ({ page }) => {
    await page.getByRole("link", { name: "Pages (3)" }).click();
    await expect(page.getByRole("link", { name: "Second Page" })).toBeVisible();
    await page.getByRole("link", { name: "Second Page" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Second Page" })).toBeVisible();
    await page.getByRole("link", { name: "First Page" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "First Page" })).toBeVisible();
  });
});
