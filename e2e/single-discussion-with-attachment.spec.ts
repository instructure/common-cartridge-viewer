import { test, expect } from "./support/fixtures";
import type { Page } from "@playwright/test";

const discussionHeading = (page: Page) =>
  page.getByRole("heading", { level: 1, name: "Test discussion" });

test.describe("Single discussion cartridge (with attachment)", () => {
  test.beforeEach(async ({ loadByUpload }) => {
    await loadByUpload("single-discussion.imscc");
  });

  test("Header, Content, Nav, and Files are displayed", async ({ page }) => {
    await expect(discussionHeading(page)).toBeVisible();
    await expect(page.locator("nav").first()).toBeVisible();
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("a.MenuItem", { hasText: "Files (1)" })).toBeVisible();
  });

  test("Discussion attachment links are displayed", async ({ page }) => {
    await expect(discussionHeading(page)).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Attachments" })).toBeVisible();
    await expect(page.getByRole("link", { name: "preferences-color.png" })).toBeVisible();
  });
});

test.describe("Single discussion cartridge (with attachment, compact)", () => {
  test.beforeEach(async ({ loadByUpload }) => {
    await loadByUpload("single-discussion.imscc", { query: "compact" });
  });

  test("Header is hidden", async ({ page }) => {
    await expect(discussionHeading(page)).toBeVisible();
    await expect(page.locator("header")).toHaveCount(0);
  });
});
