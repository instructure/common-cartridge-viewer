import { test, expect } from "./support/fixtures";
import { TIMEOUTS } from "./support/timeouts";

test.describe("US History Since 1877", () => {
  test.beforeEach(async ({ loadByUpload }) => {
    await loadByUpload("ushistory.imscc");
  });

  test("Organization item titles show for pages", async ({ page }) => {
    const mainRepository = page.getByRole("heading", {
      level: 2,
      name: "Main Repository",
    });
    const firstMeasuredCentury = page
      .getByRole("link", { name: "The First Measured Century" })
      .first();
    const womenOfHullHouse = page.getByRole("link", {
      name: "The Women of Hull House: Harnessing Statistics for Progressive Reform",
    });

    await expect(mainRepository).toBeVisible({ timeout: TIMEOUTS.load });
    await expect(firstMeasuredCentury).toBeVisible();
    await expect(womenOfHullHouse).toBeVisible();
  });

  test("Web link", async ({ page }) => {
    const gumboLink = page.getByRole("link", { name: "Gumbo" });
    const externalLinkText = page.getByText("EXTERNAL LINK");
    const gumboHeading = page.getByRole("heading", { level: 1, name: "Gumbo" });
    const openInNewWindow = page.getByRole("link", {
      name: "Click here to open link in new window",
    });

    await expect(async () => {
      await gumboLink.click();
      await expect(externalLinkText).toBeVisible({ timeout: TIMEOUTS.action });
    }).toPass({ timeout: TIMEOUTS.retry });
    await expect(gumboHeading).toBeVisible();
    await expect(openInNewWindow).toBeVisible();
  });
});
