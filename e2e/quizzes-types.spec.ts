import { test, expect } from "./support/fixtures";

const QUESTION_TYPES = [
  "MULTIPLE CHOICE",
  "TRUE / FALSE",
  "MULTIPLE RESPONSE",
  "ESSAY",
  "MULTIPLE DROPDOWNS",
  "MATCH QUESTIONS",
  "NUMERICAL",
  "CALCULATED",
  "TEXT ONLY",
  "FILE UPLOAD",
];

test.describe("Quiz with all question types", () => {
  test.beforeEach(async ({ loadByUpload }) => {
    await loadByUpload("all-question-types.imscc");
  });

  test("Resource loads as quiz", async ({ page }) => {
    await expect(page.locator(".resource-label", { hasText: "QUIZ" })).toBeVisible();
  });

  test("Quizzes types are shown", async ({ page }) => {
    for (const type of QUESTION_TYPES) {
      await expect(page.locator(".assessment-questions li", { hasText: type })).toBeVisible();
    }
  });

  test("Quiz correct answer is shown", async ({ page }) => {
    const multipleChoiceQuestion = page.locator(".assessment-questions li", {
      hasText: "MULTIPLE CHOICE",
    });
    await expect(
      multipleChoiceQuestion
        .locator("svg")
        .locator("xpath=..")
        .locator("xpath=following-sibling::*")
        .filter({ hasText: "3" })
        .first(),
    ).toBeVisible();
  });

  test("when hide-responses flag is set in the url, quizzes responses are hidden", async ({
    page,
    loadByUpload,
  }) => {
    await expect(page.locator(".question-answers").first()).toBeVisible();
    await loadByUpload("all-question-types.imscc", { query: "hide-responses" });
    await expect(page.locator(".question-answers")).toHaveCount(0);
  });
});
