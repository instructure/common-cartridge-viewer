import { test, expect } from "./support/fixtures";

const EXTERNAL_TOOL_LINKS = [
  "Copy of xmenusers",
  "Monthly budget",
  "Project proposal",
  "slash/filename",
  "Slides template orange",
];

test.describe("No showable resources", () => {
  test.beforeEach(async ({ loadByUpload }) => {
    await loadByUpload("course-with-no-showable-resources.imscc");
  });

  test("Cartridge with no showable resources displays correctly", async ({ page }) => {
    const schoolName = page.locator("span", { hasText: "XavierSchool" }).first();
    const modulesNav = page.getByRole("link", { name: "Modules (1)" });
    const moduleHeading = page.locator("h2", { hasText: "testing" });

    await expect(schoolName).toBeVisible();
    await expect(modulesNav).toBeVisible();
    await expect(moduleHeading).toBeVisible();
    for (const name of EXTERNAL_TOOL_LINKS) {
      await expect(page.getByRole("link", { name })).toBeVisible();
    }
  });

  test("Cartridge with only external tool resources displays external tool warnings", async ({
    page,
    loadByUpload,
  }) => {
    const externalToolWarning = page.getByText("External Tool Content Can't be Previewed");

    for (const name of EXTERNAL_TOOL_LINKS) {
      await loadByUpload("course-with-no-showable-resources.imscc");
      await page.getByRole("link", { name }).click();
      await expect(externalToolWarning).toBeVisible();
    }
  });
});
