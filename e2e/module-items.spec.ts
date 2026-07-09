import { test, expect } from "./support/fixtures";
import { TIMEOUTS } from "./support/timeouts";
import type { Page } from "@playwright/test";

const item = (page: Page, n: number) => page.locator(`.ExpandCollapseList-item:nth-of-type(${n})`);

const heading = (page: Page, name: string) => page.getByRole("heading", { level: 1, name });

test.describe("Course with 1 module (has all item types)", () => {
  test.beforeEach(async ({ loadByUpload }) => {
    await loadByUpload("course-1.imscc");
  });

  test("Module Title is displayed", async ({ page }) => {
    await expect(page.locator(".Module h2", { hasText: "First Module" })).toBeVisible({
      timeout: TIMEOUTS.load,
    });
  });

  test("Assignment Items work", async ({ page }) => {
    await expect(item(page, 1).locator("svg[name='IconAssignment']")).toBeVisible({
      timeout: TIMEOUTS.load,
    });
    await item(page, 1).getByRole("link", { name: "First Module Assignment 1" }).click();
    await expect(heading(page, "First Module Assignment 1")).toBeVisible();
  });

  test("Quiz Items work", async ({ page }) => {
    const title = "First Module Quiz 1";
    await expect(item(page, 2).locator("svg[name='IconQuiz']")).toBeVisible({
      timeout: TIMEOUTS.load,
    });
    await expect(
      item(page, 2).locator("div.ExpandCollapseList-item-details", {
        hasText: "1 question",
      }),
    ).toBeVisible();
    await item(page, 2).getByRole("link", { name: title }).click();
    await expect(heading(page, title)).toBeVisible();
  });

  test("File Items work", async ({ page }) => {
    const title = "photo.jpg";
    await expect(item(page, 9).locator("svg[name='IconPaperclip']")).toBeVisible({
      timeout: TIMEOUTS.load,
    });
    await item(page, 9).getByRole("link", { name: title }).click();
    await expect(heading(page, title)).toBeVisible();
  });

  test("Wiki Page Items work", async ({ page }) => {
    const title = "First Module Wiki Page 1";
    await expect(item(page, 3).locator("svg[name='IconDocument']")).toBeVisible({
      timeout: TIMEOUTS.load,
    });
    await item(page, 3).getByRole("link", { name: title }).click();
    await expect(heading(page, title)).toBeVisible();
  });

  test("Discussion Items work", async ({ page }) => {
    const title = "First Module Discussion 1";
    await expect(item(page, 4).locator("svg[name='IconDiscussion']")).toBeVisible({
      timeout: TIMEOUTS.load,
    });
    await item(page, 4).getByRole("link", { name: title }).click();
    await expect(heading(page, title)).toBeVisible();
  });

  test("Text Headers work", async ({ page }) => {
    const title = "First Module Text Header 1";
    await expect(item(page, 5).locator("h3", { hasText: title })).toBeVisible({
      timeout: TIMEOUTS.load,
    });
  });

  test("External URL's work", async ({ page }) => {
    const title = "First Module External URL 1";
    await expect(item(page, 6).locator("svg[name='IconExternalLink']")).toBeVisible({
      timeout: TIMEOUTS.load,
    });
    await item(page, 6).getByRole("link", { name: title }).click();
    await expect(heading(page, title)).toBeVisible();
  });

  test.skip("External Tool URL's work", async ({ page }) => {
    const title = "First Module AnalyTics Beta External Tool";
    await expect(item(page, 8).locator("svg[name='IconExternalLink']")).toBeVisible({
      timeout: TIMEOUTS.load,
    });
    await item(page, 8).getByRole("link", { name: title }).click();
    await expect(heading(page, title)).toBeVisible();
  });
});
