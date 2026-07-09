import { test, expect } from "./support/fixtures";
import type { Page } from "@playwright/test";

const KNOWN_TYPE = "Course with Known Submission Type";
const UNKNOWN_TYPE = "Course with Unknown Submission Type";
const MISSING_TYPE = "Course with Missing Submission Type";

const assignmentsNav = (page: Page) => page.getByRole("link", { name: "Assignments (3)" });
const assignmentLink = (page: Page, name: string) => page.getByRole("link", { name });
const assignmentHeading = (page: Page, name: string) =>
  page.getByRole("heading", { level: 1, name });
const submitting = (page: Page) => page.getByText("Submitting:");

test.describe("Course with multiple assignments", () => {
  test.beforeEach(async ({ loadByUpload }) => {
    await loadByUpload("canvas_cc_gem_course.imscc");
  });

  test("Assignment with known submission type", async ({ page }) => {
    await assignmentsNav(page).click();
    await expect(assignmentLink(page, KNOWN_TYPE)).toBeVisible();
    await assignmentLink(page, KNOWN_TYPE).click();
    await expect(assignmentHeading(page, KNOWN_TYPE)).toBeVisible();
    await expect(submitting(page)).toBeVisible();
  });

  test("Assignment with unknown submission type", async ({ page }) => {
    await assignmentsNav(page).click();
    await expect(assignmentLink(page, UNKNOWN_TYPE)).toBeVisible();
    await assignmentLink(page, UNKNOWN_TYPE).click();
    await expect(assignmentHeading(page, UNKNOWN_TYPE)).toBeVisible();
    await expect(submitting(page)).toBeVisible();
  });

  test("Assignment with missing submission type", async ({ page }) => {
    await assignmentsNav(page).click();
    await expect(assignmentLink(page, MISSING_TYPE)).toBeVisible();
    await assignmentLink(page, MISSING_TYPE).click();
    await expect(assignmentHeading(page, MISSING_TYPE)).toBeVisible();
    await expect(submitting(page)).toBeVisible();
  });
});
