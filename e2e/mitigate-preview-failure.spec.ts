import { test, expect } from "./support/fixtures";
import { TIMEOUTS } from "./support/timeouts";
import type { Page } from "@playwright/test";

const manifest = (path: string) => `manifest=${encodeURIComponent(path)}`;
const cartridge = (path: string) => `cartridge=${encodeURIComponent(path)}`;

const goodManifestUrlAndGoodImsccUrl = `/?${manifest(
  "/test-cartridges/course-1/imsmanifest.xml",
)}&${cartridge("/test-cartridges/single-page.imscc")}`;

const badManifestUrlAndGoodImsccUrl = `/?${manifest(
  "/test-cartridges/course-1/imsmanifestDOESNOTEXIST.xml",
)}&${cartridge("/test-cartridges/single-page.imscc")}`;

const badManifestUrlAndBadImsccUrl = `/?${manifest(
  "/test-cartridges/course-1/imsmanifestDOESNOTEXIST.xml",
)}&${cartridge("/test-cartridges/single-pageDOESNOTEXIST.imscc")}`;

const courseHeader = (page: Page) =>
  page.locator("header", { hasText: "COURSE-for-modules-testing" });
const lifeOfPaulHeader = (page: Page) => page.locator("header", { hasText: "The Life of Paul" });

test.describe("Mitigate Preview Failure", () => {
  test("Manifest is preferred preview type", async ({ page }) => {
    await page.goto(goodManifestUrlAndGoodImsccUrl);

    const assignmentsNav = page.getByRole("link", { name: "Assignments (2)" });
    const discussionLink = page.getByRole("link", {
      name: "First Module Discussion 1",
    });

    await expect(courseHeader(page)).toBeVisible({ timeout: TIMEOUTS.load });
    await expect(assignmentsNav).toBeVisible();
    await expect(discussionLink).toBeVisible();
    await expect(lifeOfPaulHeader(page)).toHaveCount(0);
  });

  test("Bad manifest url falls back to previewing by imscc if present in url", async ({ page }) => {
    await page.goto(badManifestUrlAndGoodImsccUrl);

    const heading = page.getByRole("heading", {
      level: 1,
      name: "Our Purpose",
    });

    await expect(lifeOfPaulHeader(page)).toBeVisible({ timeout: TIMEOUTS.load });
    await expect(heading).toBeVisible();
    await expect(courseHeader(page)).toHaveCount(0);
  });

  test("Bad manifest url & bad imscc url shows error page", async ({ page }) => {
    await page.goto(badManifestUrlAndBadImsccUrl);

    const failedToLoad = page.locator("span", { hasText: "Failed to load resource" }).first();

    await expect(failedToLoad).toBeVisible({ timeout: TIMEOUTS.load });
  });
});
