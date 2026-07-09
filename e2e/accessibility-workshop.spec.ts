import { test, expect } from "./support/fixtures";
import { TIMEOUTS } from "./support/timeouts";

test.describe("Accessibility Workshop cartridge", () => {
  test.beforeEach(async ({ loadByUpload }) => {
    await loadByUpload("allyworkshop.imscc");
  });

  test("Pages", async ({ page }) => {
    const pagesLink = page.getByRole("link", { name: "Pages" });
    await expect(pagesLink).toBeVisible({ timeout: TIMEOUTS.load });
    await pagesLink.click();
    await expect(page.getByRole("link", { name: "The Time is Now" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Accessibility Resources" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Alt Text: Writing Alternative Text" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Caption Hub" })).toBeVisible();
  });

  test("Substition token (IMS-CC-FILEBASE)", async ({ page }) => {
    const pagesLink = page.getByRole("link", { name: "Pages" });
    await expect(pagesLink).toBeVisible({ timeout: TIMEOUTS.load });
    await pagesLink.click();
    const theTimeIsNow = page.getByRole("link", { name: "The Time is Now" });
    await expect(theTimeIsNow).toBeVisible();
    await theTimeIsNow.click();
    await expect(
      page.getByRole("heading", { level: 2, name: "Accessibility is the Law" }),
    ).toBeVisible();
    await expect(page.locator('img[alt="Ally logo"]').first()).toBeVisible();

    const src = await page.locator('img[src*="data"][alt="Ally logo"]').first().getAttribute("src");
    expect(src).not.toContain("IMS-CC-FILEBASE");
  });

  test("Substition token (WIKI_REFERENCE)", async ({ page }) => {
    const pagesLink = page.getByRole("link", { name: "Pages" });
    await expect(pagesLink).toBeVisible({ timeout: TIMEOUTS.load });
    await pagesLink.click();
    const theTimeIsNow = page.getByRole("link", { name: "The Time is Now" });
    await expect(theTimeIsNow).toBeVisible();
    await theTimeIsNow.click();
    const onThisPage = page.getByRole("link", { name: "on this page" }).first();
    await expect(onThisPage).toBeVisible();
    await onThisPage.click();
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "RTC Accessibilty Advisory Committee",
      }),
    ).toBeVisible();
  });

  test("Discussions", async ({ page }) => {
    await page.getByRole("link", { name: "Discussions" }).click();
    await expect(page.getByRole("link", { name: "Accessibility in your life" })).toBeVisible({
      timeout: TIMEOUTS.load,
    });
    await expect(page.getByRole("link", { name: "Your courses, Accessible" })).toBeVisible();
    await expect(page.getByRole("link", { name: 'Share your "Before" Courses' })).toBeVisible();
    await expect(page.getByRole("link", { name: "Ally Questions and Answers" })).toBeVisible();
  });

  test("Files", async ({ page }) => {
    const filesLink = page.getByRole("link", { name: "Files" });
    await expect(filesLink).toBeVisible({ timeout: TIMEOUTS.load });
    await filesLink.click();
    await expect(
      page.locator("div", {
        hasText: "web_resources/Ally Accessibility Checklist.pdf",
      }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: "Ally Accessibility Checklist.pdf" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "files_page_falconer.png" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Ally - Student Documentation.docx" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "wiki_content" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "the-time-is-now" })).toHaveCount(0);
  });
});
