import { test, expect } from "./support/fixtures";
import { TIMEOUTS } from "./support/timeouts";
import type { Page } from "@playwright/test";

const link = (page: Page, name: string) => page.getByRole("link", { name }).first();

const detail = (page: Page, text: string) => page.locator("div", { hasText: text }).first();

const paragraph = (page: Page, text: string) => page.locator("p", { hasText: text }).first();

const heading1 = (page: Page, name: string) => page.getByRole("heading", { level: 1, name });

test.describe("Associated-content assignments (loaded w/ manifest)", () => {
  test.beforeEach(async ({ loadByUrl }) => {
    await loadByUrl(
      "/?manifest=https://s3.amazonaws.com/public-imscc/UNZIPPED+STUFF/caleblorcruxcourse-export-big/imsmanifest.xml#/",
    );
  });

  test("Associated-content assignment items display correctly", async ({ page }) => {
    await expect(link(page, "Starter: About Me")).toBeVisible({
      timeout: TIMEOUTS.load,
    });
    await expect(link(page, "Robot System Components Lab 1: Overview")).toBeVisible();
    await expect(link(page, "Robot Basic Lesson 1")).toBeVisible();
    await expect(link(page, "Robotics Project: Final Submission")).toBeVisible();
  });

  test("Associated-content assignment items can be clicked", async ({ page }) => {
    await expect(link(page, "Starter: About Me")).toBeVisible({
      timeout: TIMEOUTS.load,
    });
    await link(page, "Starter: About Me").click();
    await expect(heading1(page, "Starter: About Me")).toBeVisible({
      timeout: TIMEOUTS.load,
    });
    await expect(detail(page, "Submitting: a text entry box")).toBeVisible();
    await expect(detail(page, "Points: 10")).toBeVisible();
    await expect(
      paragraph(
        page,
        "Write a up to one page biography about yourself. Where your from, activities, ect. Also if there is any accommodation I need to know please write them in your biography so I can best help you this year.",
      ),
    ).toBeVisible();
  });

  test("Associated-content assignment list displays correctly", async ({ page }) => {
    await expect(link(page, "Assignments (77)")).toBeVisible({
      timeout: TIMEOUTS.load,
    });
    await link(page, "Assignments (77)").click();
    await expect(link(page, "Alice: Lab 1")).toBeVisible({ timeout: TIMEOUTS.load });
    await expect(link(page, "Assignment submission: Lab Resources")).toBeVisible();
    await expect(link(page, "Assignment Submission: Robot Electronic Devices")).toBeVisible();
    await expect(link(page, "Career Technical Student Organizations (CTSO)")).toBeVisible();
  });

  test("Associated-content assignment items can be clicked from assignment list view", async ({
    page,
  }) => {
    await expect(link(page, "Assignments (77)")).toBeVisible({
      timeout: TIMEOUTS.load,
    });
    await link(page, "Assignments (77)").click();
    await expect(link(page, "Alice: Lab 1")).toBeVisible({ timeout: TIMEOUTS.load });
    await link(page, "Alice: Lab 1").click();
    await expect(heading1(page, "Alice: Lab 1")).toBeVisible({
      timeout: TIMEOUTS.load,
    });
    await expect(detail(page, "Submitting: a file upload")).toBeVisible();
    await expect(detail(page, "Points: 25")).toBeVisible();
    await expect(paragraph(page, "To complete this assignment:")).toBeVisible();
  });
});

test.describe("Associated-content assignments (loaded w/ src)", () => {
  test.beforeEach(async ({ loadByUpload }) => {
    await loadByUpload("course-with-associated-content-assignments.imscc");
  });

  test("Associated-content quiz with assessment_qti.xml display correctly", async ({ page }) => {
    await link(page, "Quizzes").click();
    await expect(link(page, "New Quiz")).toBeVisible();
    await link(page, "New Quiz").click();
    await expect(page.getByRole("heading", { level: 3, name: "Questions" }).first()).toBeVisible();
  });

  test("Associated-content quiz missing assessment_qti.xml display correctly", async ({ page }) => {
    await link(page, "Quizzes").click();
    await expect(link(page, "Other Quiz")).toBeVisible();
    await link(page, "Other Quiz").click();
    await expect(page.getByRole("heading", { level: 3, name: "Questions" }).first()).toBeVisible();
  });

  test("Associated-content assignment items display correctly", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Published Assignment", exact: true })).toBeVisible(
      { timeout: TIMEOUTS.load },
    );
    await expect(link(page, "Unpublished Assignment")).toBeVisible();
  });

  test("Associated-content assignment items can be clicked", async ({ page }) => {
    const published = page.getByRole("link", {
      name: "Published Assignment",
      exact: true,
    });
    await expect(published).toBeVisible({ timeout: TIMEOUTS.load });
    await published.click();
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Published Assignment",
        exact: true,
      }),
    ).toBeVisible({ timeout: TIMEOUTS.load });
    await expect(detail(page, "Submitting: Nothing")).toBeVisible();
    await expect(detail(page, "Points: 0")).toBeVisible();
    await expect(paragraph(page, "This assignment is published")).toBeVisible();
  });

  test("Associated-content assignment list displays correctly", async ({ page }) => {
    await expect(link(page, "Assignments (2)")).toBeVisible({ timeout: TIMEOUTS.load });
    await link(page, "Assignments (2)").click();
    await expect(page.getByRole("link", { name: "Published Assignment", exact: true })).toBeVisible(
      { timeout: TIMEOUTS.load },
    );
    await expect(link(page, "Unpublished Assignment")).toBeVisible();
  });

  test("Associated-content assignment items can be clicked from assignment list view", async ({
    page,
  }) => {
    await expect(link(page, "Assignments (2)")).toBeVisible({ timeout: TIMEOUTS.load });
    await link(page, "Assignments (2)").click();
    await expect(link(page, "Unpublished Assignment")).toBeVisible({
      timeout: TIMEOUTS.load,
    });
    await link(page, "Unpublished Assignment").click();
    await expect(heading1(page, "Unpublished Assignment")).toBeVisible({
      timeout: TIMEOUTS.load,
    });
    await expect(detail(page, "Submitting: on paper")).toBeVisible();
    await expect(detail(page, "Points: 1")).toBeVisible();
  });
});

test.describe("Associated-content external tools", () => {
  test.beforeEach(async ({ loadByUpload, page }) => {
    await loadByUpload("course-with-associated-content-assignments.imscc");
    await page.evaluate(() => {
      window.location.hash = "#/resources/i691472bc7e9d470687402f5d7745875e";
    });
  });

  test("iframe is not disallowed from rich content", async ({ page }) => {
    await expect(page.locator(".RichContent iframe").first()).toBeVisible({
      timeout: TIMEOUTS.load,
    });
  });
});

test.describe("Associated-content external tools", () => {
  test.beforeEach(async ({ loadByUpload }) => {
    await loadByUpload("lti-and-google-cloud-assignment.imscc");
  });

  test("Displays 'Preview not available' for external tool content", async ({ page }) => {
    await expect(page.locator("header").first()).toBeVisible({
      timeout: TIMEOUTS.load,
    });
    await link(page, "Assignments (2)").click();
    await expect(link(page, "Google Drive LTI Assignment")).toBeVisible({
      timeout: TIMEOUTS.load,
    });
    await link(page, "Google Drive LTI Assignment").click();
    await expect(
      page.locator("span", { hasText: "External Tool Content Can't be Previewed" }).first(),
    ).toBeVisible({ timeout: TIMEOUTS.load });
  });
});

test.describe("Web content with a external tool", () => {
  test.beforeEach(async ({ loadByUpload }) => {
    await loadByUpload("web-content-google-drive-lti.imscc");
  });

  test("Displays 'Preview not available' when web content is an external tool", async ({
    page,
  }) => {
    await expect(page.locator("header").first()).toBeVisible({
      timeout: TIMEOUTS.load,
    });
    await link(page, "Assignments (2)").click();
    await expect(link(page, "Google Drive LTI Assignment")).toBeVisible({
      timeout: TIMEOUTS.load,
    });
    await link(page, "Google Drive LTI Assignment").click();
    await expect(
      page.locator("span", { hasText: "External Tool Content Can't be Previewed" }).first(),
    ).toBeVisible({ timeout: TIMEOUTS.load });
  });
});
