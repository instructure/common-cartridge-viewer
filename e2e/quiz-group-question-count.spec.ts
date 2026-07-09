import { test, expect } from "./support/fixtures";
import { TIMEOUTS } from "./support/timeouts";
import type { Page } from "@playwright/test";

const quizDetails = (page: Page, nth: number) =>
  page.locator(`li.ExpandCollapseList-item:nth-child(${nth}) .ExpandCollapseList-item-details`);

test.describe("Quiz-group-question-count", () => {
  test.beforeEach(async ({ loadByUpload }) => {
    await loadByUpload("grouptest.zip");
  });

  test("Questions-under-groups-are-counted", async ({ page }) => {
    await expect(quizDetails(page, 1)).toContainText("5 question(s) / 3 assigned", {
      timeout: TIMEOUTS.load,
    });
    await expect(quizDetails(page, 2)).toContainText("3 question");
    await expect(quizDetails(page, 3)).toContainText("2 question");
    await expect(quizDetails(page, 4)).toHaveCount(0);
  });
});
