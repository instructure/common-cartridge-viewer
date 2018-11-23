import { Selector } from "testcafe";

fixture`Accessibility Workshop cartridge`.page`http://localhost:5000/`;

test("Resource not found", async t => {
  await t
    .click(Selector("a").withText("Ally: Accessibility Workshop"))
    .expect(
      Selector("h3").withText("Part 1: Overview: Accessibility and ALLY").exists
    )
    .ok("Header shows", { timeout: 20000 });

  await t
    .navigateTo("#/resources/notfound")
    .expect(Selector("span").withText("Not found").exists)
    .ok();
});

test("Basic elements exist", async t => {
  await t
    .click(Selector("a").withText("Ally: Accessibility Workshop"))
    .expect(
      Selector("h3").withText("Part 1: Overview: Accessibility and ALLY").exists
    )
    .ok()
    .expect(Selector("h3").withText(`Part 2: "Before" courses`).exists)
    .ok()
    .expect(Selector("a").withText(`Accessibility FAQ`).exists)
    .ok()
    .expect(Selector("a").withText(`Accessibility in your life`).exists)
    .ok();
});

test("Next and previous links", async t => {
  await t.click(Selector("a").withText("Ally: Accessibility Workshop"));

  await t
    .click(Selector("a").withText("Accessibility FAQ"))
    .expect(Selector("h1").withText(`Accessibility FAQ`).exists)
    .ok()
    .click(Selector("a").withText("Next"))
    .expect(Selector("h1").withText(`What is ALLY?`).exists)
    .ok()
    .click(Selector("a").withText("Next"))
    .expect(
      Selector("h1").withText(`Alt Text: Writing Alternative Text`).exists
    )
    .ok()
    .click(Selector("a").withText("Next"))
    .expect(Selector("h1").withText(`Caption Hub`).exists)
    .ok()
    .click(Selector("a").withText("Next"))
    .expect(Selector("h1").withText(`Accessibility in your life`).exists)
    .ok()
    .click(Selector("a").withText("Next"))
    .expect(Selector("h1").withText(`Share your "Before" Courses`).exists)
    .ok()
    .click(Selector("a").withText("Next"))
    .expect(Selector("h1").withText(`Your courses, Accessible`).exists)
    .ok()
    .click(Selector("a").withText("Next"))
    .expect(Selector("h1").withText(`Call it out to your Students`).exists)
    .ok()
    .click(Selector("a").withText("Next"))
    .expect(Selector("h1").withText(`Accessibility Resources`).exists)
    .ok()
    .click(Selector("a").withText("Previous"))
    .expect(Selector("h1").withText(`Call it out to your Students`).exists)
    .ok()
    .click(Selector("a").withText("Previous"))
    .expect(Selector("h1").withText(`Your courses, Accessible`).exists)
    .ok()
    .click(Selector("a").withText("Previous"))
    .expect(Selector("h1").withText(`Share your "Before" Courses`).exists)
    .ok()
    .click(Selector("a").withText("Previous"))
    .expect(Selector("h1").withText(`Accessibility in your life`).exists)
    .ok()
    .click(Selector("a").withText("Previous"))
    .expect(Selector("h1").withText(`Caption Hub`).exists)
    .ok()
    .click(Selector("a").withText("Previous"))
    .expect(
      Selector("h1").withText(`Alt Text: Writing Alternative Text`).exists
    )
    .ok()
    .click(Selector("a").withText("Previous"))
    .expect(Selector("h1").withText(`What is ALLY?`).exists)
    .ok()
    .click(Selector("a").withText("Previous"))
    .expect(Selector("h1").withText(`Accessibility FAQ`).exists)
    .ok();
});

test("Back to all items link", async t => {
  await t.click(Selector("a").withText("Ally: Accessibility Workshop"));

  await t
    .click(Selector("a").withText("Accessibility FAQ"))
    .expect(Selector("h1").withText(`Accessibility FAQ`).exists)
    .ok()
    .click(Selector("a").withText("All Items"))
    .expect(Selector("header").withText("Ally: Accessibility Workshop").exists)
    .ok()
    .click(Selector("a").withText("Pages"))
    .click(Selector("a").withText("The Time is Now"))
    .expect(Selector("h2").withText("Accessibility is the Law"))
    .ok()
    .click(Selector("a").withText("All Items"))
    .expect(Selector("header").withText("Ally: Accessibility Workshop").exists)
    .ok();
});

test("Pages", async t => {
  await t
    .click(Selector("a").withText("Ally: Accessibility Workshop"))
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
    .click(Selector("a").withText("Pages"))
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
    .click(Selector("a").withText("Pages"))
    .click(Selector("a").withText("The Time is Now"))
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
    .ok()
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
