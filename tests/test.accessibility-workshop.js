import { Selector } from "testcafe";

fixture`Accessibility Workshop cartridge`.page`http://localhost:5000/`;

test("Pages", async t => {
  await t
    .click(Selector("a").withText("Ally: Accessibility Workshop"))
    .expect(Selector("a").withText("Pages").exists)
    .ok({ timeout: 20000 })
    .click(Selector("a").withText("Pages"))
    .expect(Selector("a").withText("The Time is Now").exists)
    .ok()
    .expect(Selector("a").withText("Accessibility Resources").exists)
    .ok()
    .expect(Selector("a").withText("Alt Text: Writing Alternative Text").exists)
    .ok()
    .expect(Selector("a").withText("Caption Hub").exists)
    .ok();
});

test("Substition token (IMS-CC-FILEBASE)", async t => {
  await t
    .click(Selector("a").withText("Ally: Accessibility Workshop"))
    .expect(Selector("a").withText("Pages").exists)
    .ok({ timeout: 20000 })
    .click(Selector("a").withText("Pages"))
    .expect(Selector("a").withText("The Time is Now").exists)
    .ok()
    .click(Selector("a").withText("The Time is Now"))
    .expect(Selector("h2").withText("Accessibility is the Law"))
    .ok()
    .expect(Selector("img").withAttribute("alt", "Ally logo"))
    .ok();

  const img = Selector('img[src*="data"]').withAttribute("alt", "Ally logo");
  const src = await img.getAttribute("src");
  await t
    .expect(src)
    .notContains("IMS-CC-FILEBASE", "CC file prefix not replaced");
});

test("Substition token (WIKI_REFERENCE)", async t => {
  await t
    .click(Selector("a").withText("Ally: Accessibility Workshop"))
    .expect(Selector("a").withText("Pages"))
    .ok({ timeout: 20000 })
    .click(Selector("a").withText("Pages"))
    .expect(Selector("a").withText("The Time is Now"))
    .ok()
    .click(Selector("a").withText("The Time is Now"))
    .expect(Selector("a").withText("on this page"))
    .ok()
    .click(Selector("a").withText("on this page"))
    .expect(
      Selector("h1").withText(`RTC Accessibilty Advisory Committee`).exists
    )
    .ok();
});

test("Discussions", async t => {
  await t
    .click(Selector("a").withText("Ally: Accessibility Workshop"))
    .click(Selector("a").withText("Discussions"))
    .expect(Selector("a").withText("Accessibility in your life").exists)
    .ok({ timeout: 20000 })
    .expect(Selector("a").withText("Your courses, Accessible").exists)
    .ok()
    .expect(Selector("a").withText(`Share your "Before" Courses`).exists)
    .ok()
    .expect(Selector("a").withText("Ally Questions and Answers").exists)
    .ok();
});

test("Files", async t => {
  await t
    .click(Selector("a").withText("Ally: Accessibility Workshop"))
    .expect(Selector("a").withText("Files").exists)
    .ok({ timeout: 20000 })
    .click(Selector("a").withText("Files"))
    .expect(
      Selector("div").withText("web_resources/Ally Accessibility Checklist.pdf")
        .exists
    )
    .notOk()
    .expect(Selector("a").withText("Ally Accessibility Checklist.pdf").exists)
    .ok()
    .expect(Selector("a").withText("files_page_falconer.png").exists)
    .ok()
    .expect(Selector("a").withText("Ally - Student Documentation.docx").exists)
    .ok()
    .expect(Selector("a").withText("wiki_content").exists)
    .notOk()
    .expect(Selector("a").withText("the-time-is-now").exists)
    .notOk();
});
