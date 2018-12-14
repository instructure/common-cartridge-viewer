import { Selector } from "testcafe";

fixture`Course with 1 module (has all item types)`
  .page`http://localhost:5000/?manifest=${encodeURIComponent(
  "http://localhost:5000/test-cartridges/course-1/imsmanifest.xml"
)}#/`;

test("Module Title is displayed", async t => {
  await t.expect(Selector(".Module h3").withText(`First Module`).exists).ok();
});

test("Assignment Items work", async t => {
  await t
    .expect(
      Selector(
        ".ExpandCollapseList-item:nth-of-type(1) svg[name='IconAssignment']"
      ).exists
    )
    .ok()
    .click(
      Selector(".ExpandCollapseList-item:nth-of-type(1) a").withText(
        "First Module Assignment 1"
      )
    )
    .expect(Selector("h1").withText("First Module Assignment 1").exists)
    .ok();
});

test("Quiz Items work", async t => {
  const itemCss = ".ExpandCollapseList-item:nth-of-type(2)";
  const title = `First Module Quiz 1`;
  await t
    .expect(Selector(`${itemCss} svg[name='IconQuiz']`).exists)
    .ok()
    .expect(
      Selector(`${itemCss} div.ExpandCollapseList-item-details`).withText(
        `1 Questions`
      ).exists
    )
    .ok()
    .click(Selector(`${itemCss} a`).withText(title))
    .expect(Selector("h1").withText(title).exists)
    .ok();
});

test("File Items work", async t => {
  const itemCss = ".ExpandCollapseList-item:nth-of-type(9)";
  const title = `photo.jpg`;
  await t
    .expect(Selector(`${itemCss} svg[name='IconPaperclip']`).exists)
    .ok()
    .click(Selector(`${itemCss} a`).withText(title))
    .expect(Selector("h1").withText(title).exists)
    .ok();
});

test("Wiki Page Items work", async t => {
  const itemCss = ".ExpandCollapseList-item:nth-of-type(3)";
  const title = "First Module Wiki Page 1";
  await t
    .expect(Selector(`${itemCss} svg[name='IconDocument']`).exists)
    .ok()
    .click(Selector(`${itemCss} a`).withText(title))
    .expect(Selector("h1").withText(title).exists)
    .ok();
});

test("Discussion Items work", async t => {
  const itemCss = ".ExpandCollapseList-item:nth-of-type(4)";
  const title = "First Module Discussion 1";
  await t
    .expect(Selector(`${itemCss} svg[name='IconDiscussion']`).exists)
    .ok()
    .click(Selector(`${itemCss} a`).withText(title))
    .expect(Selector("h1").withText(title).exists)
    .ok();
});

test("Text Headers work", async t => {
  const itemCss = ".ExpandCollapseList-item:nth-of-type(5)";
  const title = "First Module Text Header 1";
  await t.expect(Selector(`${itemCss} h3`).withText(title).exists).ok();
});

test("External URL's work", async t => {
  const itemCss = ".ExpandCollapseList-item:nth-of-type(6)";
  const title = "First Module External URL 1";
  await t
    .expect(Selector(`${itemCss} svg[name='IconExternalLink']`).exists)
    .ok()
    .click(Selector(`${itemCss} a`).withText(title))
    .expect(Selector("h1").withText(title).exists)
    .ok();
});

// fixing CM-599 will make this test pass. Skipping for now
test.skip("External Tool URL's work", async t => {
  const itemCss = ".ExpandCollapseList-item:nth-of-type(8)";
  const title = "First Module AnalyTics Beta External Tool";
  await t
    .expect(Selector(`${itemCss} svg[name='IconExternalLink']`).exists)
    .ok()
    .click(Selector(`${itemCss} a`).withText(title))
    .expect(Selector("h1").withText(title).exists)
    .ok();
});
