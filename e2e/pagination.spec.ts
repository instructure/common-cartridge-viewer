import { test, expect } from "./support/fixtures";
import { TIMEOUTS } from "./support/timeouts";
import type { Page } from "@playwright/test";

const S3_MANIFEST =
  "https://s3.amazonaws.com/public-imscc/UNZIPPED+STUFF/caleblorcruxcourse-export-big/imsmanifest.xml";

const pageButton = (page: Page, n: string) =>
  page.locator('a[data-cid="BaseButton PaginationButton"]', { hasText: n });
const activePageButton = (page: Page, n: string) =>
  page.locator('a[data-cid="BaseButton PaginationButton"][aria-current="page"]', {
    hasText: n,
  });
const fileLink = (page: Page, name: string) => page.locator("a", { hasText: name });

test.describe("Pagination", () => {
  test("Pagination works on lists with > 100 items", async ({ page, loadByUrl }) => {
    await loadByUrl(`/?manifest=${S3_MANIFEST}#/files`);

    await expect(activePageButton(page, "1")).toBeVisible({ timeout: TIMEOUTS.load });
    await expect(fileLink(page, "Robot Components 4 Best Solutions-help.pptx")).toBeVisible({
      timeout: TIMEOUTS.load,
    });
    await expect(fileLink(page, "Robot Components 5 Prototyping-help.pptx")).toHaveCount(0);

    await pageButton(page, "2").click();
    await expect(activePageButton(page, "2")).toBeVisible();
    await expect(fileLink(page, "Robot Components 5 Prototyping-help.pptx")).toBeVisible({
      timeout: TIMEOUTS.load,
    });
  });
});
