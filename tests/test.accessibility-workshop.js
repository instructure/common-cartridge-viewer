import { Selector } from "testcafe";

fixture`Dashboard`.page`http://localhost:5000/`;

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
  await t.click(Selector("a").withText("Accessibility FAQ"));
  await t.expect(Selector("h1").withText(`Accessibility FAQ`).exists).ok();
  await t.click(Selector("a").withText("Next"));
  await t.expect(Selector("h1").withText(`What is ALLY?`).exists).ok();
  await t.click(Selector("a").withText("Next"));
  await t
    .expect(
      Selector("h1").withText(`Alt Text: Writing Alternative Text`).exists
    )
    .ok();
  await t.click(Selector("a").withText("Previous"));
  await t.expect(Selector("h1").withText(`What is ALLY?`).exists).ok();
});

test("Pages", async t => {
  await t
    .click(Selector("a").withText("Ally: Accessibility Workshop"))
    .click(Selector("button").withText("Pages"))
    .expect(Selector("a").withText("The Time is Now").exists)
    .ok()
    .expect(Selector("a").withText("Accessibility Resources").exists)
    .ok()
    .expect(Selector("a").withText("Alt Text: Writing Alternative Text").exists)
    .ok()
    .expect(Selector("a").withText("Caption Hub").exists)
    .ok();

  await t
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

test("Discussions", async t => {
  await t
    .click(Selector("a").withText("Ally: Accessibility Workshop"))
    .click(Selector("button").withText("Discussions"))
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
    .click(Selector("button").withText("Files"))
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
    .ok();
});
