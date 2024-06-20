import { Selector } from "testcafe";

fixture`Course with multiple pages but no modules`
  .page`http://localhost:5000/?manifest=${encodeURIComponent(
  "/test-cartridges/multiple-pages/imsmanifest.xml"
)}#/`;

test("Both page titles are displayed", async t => {
  await t.expect(Selector("li").withText(`First Page`).exists).ok();
  await t.expect(Selector("li").withText(`Second Page`).exists).ok();
  await t.expect(Selector("li").withText(`Third Page`).exists).ok();
});

test("Link to page with standard wiki_reference", async t => {
  await t
    .click(Selector("a").withText("Pages (3)"))
    .expect(Selector("a").withText("Second Page").exists)
    .ok()
    .click(Selector("a").withText("Second Page"))
    .expect(Selector("h1").withText("Second Page").exists)
    .ok()
    .click(Selector("a").withText("Third Page"))
    .expect(Selector("h1").withText("Third Page").exists)
    .ok();
});

test("Link to page with decoded wiki_reference", async t => {
  await t
    .click(Selector("a").withText("Pages (3)"))
    .expect(Selector("a").withText("Second Page").exists)
    .ok()
    .click(Selector("a").withText("Second Page"))
    .expect(Selector("h1").withText("Second Page").exists)
    .ok()
    .click(Selector("a").withText("First Page"))
    .expect(Selector("h1").withText("First Page").exists)
    .ok();
});
