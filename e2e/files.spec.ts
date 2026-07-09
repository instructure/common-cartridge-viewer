import { test, expect } from "./support/fixtures";
import type { Page } from "@playwright/test";

const WORKFLOW_STATE = ".ExpandCollapseList-item-workflow-state";
const workflowState = (page: Page, text: string) =>
  page.locator(WORKFLOW_STATE).getByText(text, { exact: true });

test.describe("File Items", () => {
  test.beforeEach(async ({ loadByUpload }) => {
    await loadByUpload("course-1.imscc", { hash: "#/files" });
  });

  test("Assignment items don't show up as files", async ({ page }) => {
    await expect(
      page.locator("a", {
        hasText: "i7aff7e807cbf2c3be5ca6fc0733ff0a8/first-module-assignment-1.html",
      }),
    ).toHaveCount(0);
  });

  test("Published files show up as published (no metadata case)", async ({ page }) => {
    await expect(workflowState(page, "published-document.pdf is published")).toBeVisible();
  });

  test("Published files show up as published (intended user role includes Learner case)", async ({
    page,
  }) => {
    await expect(workflowState(page, "published-document-2.pdf is published")).toBeVisible();
  });

  test("Unpublished files show up as unpublished", async ({ page }) => {
    await expect(workflowState(page, "unpublished-document.pdf is unpublished")).toBeVisible();
  });
});
