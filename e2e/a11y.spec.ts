import { test, expect } from "./support/fixtures";
import type { Locator, Page } from "@playwright/test";

const NORMAL_THEME_MODULE_LINK_RGB = "rgb(0, 142, 226)";
const NORMAL_THEME_NAV_LINK_RGB = "rgb(37, 120, 203)";
const HIGH_CONTRAST_THEME_LINK_RGB = "rgb(7, 112, 163)";

const computedColor = (locator: Locator) =>
  locator.evaluate((el) => window.getComputedStyle(el).color);
const moduleLink = (page: Page) => page.getByRole("link", { name: "First Module Assignment 1" });
const navLink = (page: Page) => page.getByRole("link", { name: "Modules (1)" });

test.describe("A11y requirements", () => {
  test("High-contrast style support", async ({ page, loadByUpload }) => {
    await loadByUpload("course-1.imscc");
    await expect(moduleLink(page)).toBeVisible();
    await expect(navLink(page)).toBeVisible();
    expect(await computedColor(moduleLink(page))).toBe(NORMAL_THEME_MODULE_LINK_RGB);
    expect(await computedColor(navLink(page))).toBe(NORMAL_THEME_NAV_LINK_RGB);

    await loadByUpload("course-1.imscc", { query: "high-contrast" });
    await expect(moduleLink(page)).toBeVisible();
    await expect(navLink(page)).toBeVisible();
    expect(await computedColor(moduleLink(page))).toBe(HIGH_CONTRAST_THEME_LINK_RGB);
    expect(await computedColor(navLink(page))).toBe(HIGH_CONTRAST_THEME_LINK_RGB);
  });
});
