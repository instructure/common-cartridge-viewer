import { test, expect } from "./support/fixtures";

test.describe("Assingment with rubrics", () => {
  test.beforeEach(async ({ loadByUpload }) => {
    await loadByUpload("assignment-rubrics.imscc");
  });

  test("Resource loaded properly", async ({ page }) => {
    const resourceLabel = page.locator(".resource-label", {
      hasText: "ASSIGNMENT",
    });
    const heading = page.getByRole("heading", {
      level: 1,
      name: "Rubricated Assignment",
    });

    await expect(resourceLabel).toBeVisible();
    await expect(heading).toBeVisible();
  });

  test("Assignment contains a rubric table", async ({ page }) => {
    const rubricTable = page.locator('table[title="Some Rubric"]');
    const criterionCell = page.locator("td", {
      hasText: "Description of criterion",
    });

    await expect(rubricTable).toBeVisible();
    await expect(criterionCell).toBeVisible();
  });

  test("Assignment contains an empty total points footer col if total points are missing", async ({
    page,
  }) => {
    const emptyTotalPointsHeader = page.locator("xpath=//body//tfoot//th[2]");

    await expect(emptyTotalPointsHeader).toHaveText("");
  });
});
