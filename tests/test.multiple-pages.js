import { Selector } from "testcafe";

fixture`Course with multiple pages but no modules`
  .page`http://localhost:5000/?manifest=${encodeURIComponent(
  "/test-cartridges/multiple-pages/imsmanifest.xml"
)}#/`;

test("Both page titles are displayed", async t => {
  await t.expect(Selector("li").withText(`First Page`).exists).ok();
  await t.expect(Selector("li").withText(`Second Page`).exists).ok();
});
