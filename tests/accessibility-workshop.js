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
    .expect(Selector("div").withText(`Accessibility FAQ`).exists)
    .ok()
    .expect(Selector("div").withText(`Accessibility in your life`).exists)
    .ok();
});

test.skip("Pages", async t => {
  await t
    .click(Selector("a").withText("Ally: Accessibility Workshop"))
    .click(Selector("button").withText("Pages"))
    .expect(Selector("div").withText("The Time is Now").exists)
    .ok()
    .expect(Selector("div").withText("Accessibility Resources").exists)
    .ok()
    .expect(
      Selector("div").withText("Alt Text: Writing Alternative Text").exists
    )
    .ok()
    .expect(Selector("div").withText("Caption Hub").exists)
    .ok();
});

test.skip("Discussions", async t => {
  await t
    .click(Selector("a").withText("Ally: Accessibility Workshop"))
    .click(Selector("button").withText("Discussions"))
    .expect(Selector("div").withText("Accessibility in your life").exists)
    .ok()
    .expect(Selector("div").withText("Your courses, Accessible").exists)
    .ok()
    .expect(Selector("div").withText(`Share your "Before" Courses`).exists)
    .ok()
    .expect(Selector("div").withText("Ally Questions and Answers").exists)
    .ok();
});

test.skip("Files", async t => {
  await t
    .click(Selector("a").withText("Ally: Accessibility Workshop"))
    .click(Selector("button").withText("Files"))
    .expect(Selector("div").withText("Ally Accessibility Checklist.pdf").exists)
    .ok()
    .expect(Selector("div").withText("files_page_falconer.png").exists)
    .ok()
    .expect(
      Selector("div").withText("Ally - Student Documentation.docx").exists
    )
    .ok();
});
