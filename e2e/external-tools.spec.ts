import { test, expect } from "./support/fixtures";
import type { Page } from "@playwright/test";

const externalToolLink = (page: Page) =>
  page.getByRole("link", { name: "First Module AnalyTics Beta External Tool" });

test.describe("External Tool Items", () => {
  test.beforeEach(async ({ loadByUpload }) => {
    await loadByUpload("course-1.imscc");
  });

  test("External tools show up correctly in Module list", async ({ page }) => {
    await expect(externalToolLink(page)).toBeVisible();
  });

  test("External tools links respond correctly when clicked", async ({ page }) => {
    await expect(externalToolLink(page)).toBeVisible();
    await externalToolLink(page).click();
    await expect(page.getByText("External Tool Content Can't be Previewed")).toBeVisible();
  });
});
