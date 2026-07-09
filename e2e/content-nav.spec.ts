import { test, expect } from "./support/fixtures";
import { TIMEOUTS } from "./support/timeouts";
import type { Page } from "@playwright/test";

const nextButton = (page: Page) =>
  page.locator("a", { has: page.locator("span", { hasText: "Next" }) }).first();

const previousButton = (page: Page) =>
  page.locator("a", { has: page.locator("span", { hasText: "Previous" }) }).first();

const gotoRoute = (page: Page, hash: string) =>
  page.evaluate((h) => {
    window.location.hash = h;
  }, hash);

const heading = (page: Page, name: string) => page.getByRole("heading", { level: 1, name });

test.describe("Content Navigation links (Next & Previous)", () => {
  test.beforeEach(async ({ loadByUpload }) => {
    await loadByUpload("course-1.imscc");
  });

  test("Previous and Next buttons show up after navigating from Modules", async ({ page }) => {
    await page.getByRole("link", { name: "First Module Quiz 1" }).click();
    await expect(nextButton(page)).toBeVisible({ timeout: TIMEOUTS.load });
    await expect(previousButton(page)).toBeVisible();
  });

  test("Previous and Next work with external tool items", async ({ page }) => {
    await page.getByRole("link", { name: "First Module AnalyTics Beta External Tool" }).click();
    await expect(nextButton(page)).toBeVisible({ timeout: TIMEOUTS.load });
    await expect(previousButton(page)).toBeVisible();
    await nextButton(page).click();
    await expect(heading(page, "photo.jpg")).toBeVisible();

    await gotoRoute(page, "#/");
    await page.getByRole("link", { name: "First Module AnalyTics Beta External Tool" }).click();
    await expect(nextButton(page)).toBeVisible();
    await expect(previousButton(page)).toBeVisible();
    await previousButton(page).click();
    await expect(
      page.locator("span", { hasText: "Download sample-document.pdf" }).first(),
    ).toBeVisible();
  });

  test("Previous and Next buttons don't show up after navigating from Assignments", async ({
    page,
  }) => {
    await gotoRoute(page, "#/assignments");
    await page.getByRole("link", { name: "First Module Assignment 1" }).click();
    await expect(nextButton(page)).toHaveCount(0);
    await expect(previousButton(page)).toHaveCount(0);
  });

  test("Previous and Next buttons don't show up after navigating from Pages", async ({ page }) => {
    await gotoRoute(page, "#/pages");
    await page.getByRole("link", { name: "First Module Wiki Page 1" }).click();
    await expect(nextButton(page)).toHaveCount(0);
    await expect(previousButton(page)).toHaveCount(0);
  });

  test("Previous and Next buttons don't show up after navigating from Discussions", async ({
    page,
  }) => {
    await gotoRoute(page, "#/discussions");
    await page.getByRole("link", { name: "First Module Discussion 1" }).click();
    await expect(nextButton(page)).toHaveCount(0);
    await expect(previousButton(page)).toHaveCount(0);
  });

  test("Previous and Next buttons don't show up after navigating from Quizzes", async ({
    page,
  }) => {
    await gotoRoute(page, "#/quizzes");
    await page.getByRole("link", { name: "First Module Quiz 1" }).click();
    await expect(nextButton(page)).toHaveCount(0);
    await expect(previousButton(page)).toHaveCount(0);
  });

  test("Previous and Next buttons don't show up after navigating from Files", async ({ page }) => {
    await gotoRoute(page, "#/files");
    await page.getByRole("link", { name: "photo.jpg" }).first().click();
    await expect(nextButton(page)).toHaveCount(0);
    await expect(previousButton(page)).toHaveCount(0);
  });

  test("Next link on first page works", async ({ page }) => {
    await page.getByRole("link", { name: "First Module Assignment 1" }).click();
    await expect(previousButton(page)).toHaveCount(0);
    await nextButton(page).click();
    await expect(page.locator("h1").first()).toContainText("First Module Quiz 1");
  });

  test("Previous link on last page works", async ({ page }) => {
    await page
      .getByRole("link", {
        name: "The First Measured Century: 1930-1960 (60:00)",
      })
      .click();
    await expect(nextButton(page)).toHaveCount(0);
    await previousButton(page).click();
    await expect(heading(page, "Assignment with Internal and External Links")).toBeVisible();
  });

  test("Previous and Next buttons show up after using the 'back' browser button", async ({
    page,
  }) => {
    await page.getByRole("link", { name: "First Module Quiz 1" }).click();
    await nextButton(page).click();
    await expect(heading(page, "First Module Wiki Page 1")).toBeVisible();

    await page.goBack();

    await expect(heading(page, "First Module Quiz 1")).toBeVisible();
    await expect(nextButton(page)).toBeVisible();
    await expect(previousButton(page)).toBeVisible();
  });

  test("Previous and Next buttons show up after using the 'forward' browser button", async ({
    page,
  }) => {
    await page.getByRole("link", { name: "First Module Quiz 1" }).click();
    await expect(heading(page, "First Module Quiz 1")).toBeVisible();

    await page.goBack();
    await page.goForward();

    await expect(heading(page, "First Module Quiz 1")).toBeVisible();
    await expect(nextButton(page)).toBeVisible();
    await expect(previousButton(page)).toBeVisible();
  });
});

test.describe("Content Navigation sidebar links", () => {
  test.beforeEach(async ({ loadByUpload }) => {
    await loadByUpload("course-1.imscc");
  });

  test("Sidebar link for Pages displays correct number of wiki pages", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Pages (1)", exact: true })).toBeVisible({
      timeout: TIMEOUTS.load,
    });
  });
});
