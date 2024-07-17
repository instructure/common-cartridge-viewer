import { Selector } from "testcafe";

fixture`Course with LaTeX example`
  .page`http://localhost:5000/?cartridge=${encodeURIComponent(
  "/test-cartridges/canvas_cc_gem_course.imscc"
)}#/`;

test("Page displays MathJax", async t => {
  await t
    .click(Selector("a").withText("Pages ("))
    .expect(Selector("a").withText("Latex Example").exists)
    .ok()
    .click(Selector("a").withText("Latex Example"))
    .expect(Selector("h1").withText("Latex Example").exists)
    .ok()
    .expect(Selector("mjx-container").withAttribute("class", "MathJax"))
    .ok();
});
