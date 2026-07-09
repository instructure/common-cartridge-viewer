import { test, expect } from "./support/fixtures";
import { TIMEOUTS } from "./support/timeouts";
import type { Page } from "@playwright/test";

const ASSIGNMENT_HASH = "#/resources/ic0ab5c031b3cc8071f1023ae0bf34d2c";
const assignmentUrl = `/?manifest=https://s3.amazonaws.com/public-imscc/UNZIPPED+STUFF/Hyperlinks-Test-Course/imsmanifest.xml${ASSIGNMENT_HASH}`;

const gotoAssignment = (page: Page) =>
  page.evaluate((hash) => {
    window.location.hash = hash;
  }, ASSIGNMENT_HASH);

const contentLink = (page: Page, name: string) =>
  page.locator(".RichContent a", { hasText: name }).first();

const clickNav = async (page: Page, name: string) => {
  await gotoAssignment(page);
  await page.getByRole("link", { name, exact: true }).first().click();
};

test.describe("Single assignment with hyperlinks", () => {
  test.beforeEach(async ({ loadByUrl }) => {
    await loadByUrl(assignmentUrl);
  });

  test("Files", async ({ page }) => {
    const fileLink = contentLink(page, "annotated-bold-font-test.pptx (1).pdf");
    await expect(fileLink).toBeVisible({ timeout: TIMEOUTS.load });
    await fileLink.click();
    await expect(
      page
        .locator("span", {
          hasText: "Download annotated-bold-font-test.pptx (1).pdf",
        })
        .first(),
    ).toBeVisible();
  });

  test("Pages", async ({ page }) => {
    const pageLink = contentLink(page, "Learning");
    await expect(pageLink).toBeVisible({ timeout: TIMEOUTS.load });
    await pageLink.click();
    await expect(page.getByRole("heading", { level: 1, name: "Learning" })).toBeVisible();
    await expect(page.locator("p", { hasText: "is great." }).first()).toBeVisible();
  });

  test("Assignments", async ({ page }) => {
    const link = contentLink(page, "Published Assignment");
    await expect(link).toBeVisible({ timeout: TIMEOUTS.load });
    await link.click();
    await expect(
      page.getByRole("heading", { level: 1, name: "Published Assignment" }),
    ).toBeVisible();
    await expect(
      page.locator("p", { hasText: "This assignment is published" }).first(),
    ).toBeVisible();
  });

  test("Quizzes", async ({ page }) => {
    const quizLink = contentLink(page, "New Quiz");
    await expect(quizLink).toBeVisible({ timeout: TIMEOUTS.load });
    await quizLink.click();
    await expect(page.getByRole("heading", { level: 1, name: "New Quiz" })).toBeVisible();
    await expect(page.locator("p", { hasText: "What is up?" }).first()).toBeVisible();
  });

  test("Announcements", async ({ page }) => {
    const announcementLink = contentLink(page, "Announcement");
    await expect(announcementLink).toBeVisible({ timeout: TIMEOUTS.load });
    await announcementLink.click();
    await expect(page.getByRole("heading", { level: 1, name: "Announcement" })).toBeVisible();
    await expect(page.locator("p", { hasText: "Hello" }).first()).toBeVisible();
  });

  test("Discussions", async ({ page }) => {
    const discussionLink = contentLink(page, "Discuss This");
    await expect(discussionLink).toBeVisible({ timeout: TIMEOUTS.load });
    await discussionLink.click();
    await expect(page.getByRole("heading", { level: 1, name: "Discuss This" })).toBeVisible();
    await expect(page.locator("p", { hasText: "Yep" }).first()).toBeVisible();
  });

  test("Modules", async ({ page }) => {
    const moduleLink = contentLink(page, "Some Assignments");
    await expect(moduleLink).toBeVisible({ timeout: TIMEOUTS.load });
    await moduleLink.click();
    await expect(page.locator("div", { hasText: "Some Assignments" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Unpublished Assignment" })).toBeVisible();
  });

  test("Course Navigation", async ({ page }) => {
    const courseNavigationWarning = page
      .locator("span", { hasText: "Course Navigation Cannot Be Previewed" })
      .first();
    const courseNavigationSubWarning = page
      .locator("span", {
        hasText: "Course navigation links are only available within a Canvas course.",
      })
      .first();

    await clickNav(page, "Assignments");
    await expect(page.getByRole("link", { name: "Published Assignment", exact: true })).toBeVisible(
      { timeout: TIMEOUTS.load },
    );

    await clickNav(page, "Pages");
    await expect(page.getByRole("link", { name: "Learning" })).toBeVisible();

    await clickNav(page, "Discussions");
    await expect(page.getByRole("link", { name: "Discuss This" })).toBeVisible();

    await clickNav(page, "Syllabus");
    await expect(courseNavigationWarning).toBeVisible();
    await expect(courseNavigationSubWarning).toBeVisible();

    await clickNav(page, "Announcements");
    await expect(courseNavigationWarning).toBeVisible();
    await expect(courseNavigationSubWarning).toBeVisible();

    await clickNav(page, "Quizzes");
    await expect(page.getByRole("link", { name: "New Quiz" })).toBeVisible();

    await clickNav(page, "Files");
    await expect(
      page.getByRole("link", { name: "annotated-bold-font-test.pptx (1).pdf" }),
    ).toBeVisible();

    await clickNav(page, "Collaborations");
    await expect(courseNavigationWarning).toBeVisible();
    await expect(courseNavigationSubWarning).toBeVisible();

    await clickNav(page, "Grades");
    await expect(courseNavigationWarning).toBeVisible();
    await expect(courseNavigationSubWarning).toBeVisible();

    await clickNav(page, "People");
    await expect(courseNavigationWarning).toBeVisible();
    await expect(courseNavigationSubWarning).toBeVisible();

    await clickNav(page, "Modules");
    await expect(page.locator("div", { hasText: "Some Assignments" }).first()).toBeVisible();
  });
});
