import { Selector } from "testcafe";

fixture`LaTeX Equations`
  .page`http://localhost:5000/?cartridge=${encodeURIComponent(
  "/test-cartridges/latex.imscc"
)}#/`;

test("Page 1 displays MathJax", async t => {
  const modulePage1 = Selector("a").withText("Page 1");
  await t
    .click(modulePage1)
    .expect(Selector("mjx-container").withAttribute("class", "MathJax"))
    .ok();
});

test("Page 2 displays MathJax", async t => {
  const modulePage2 = Selector("a").withText("Page 2");
  await t
    .click(modulePage2)
    .expect(Selector("mjx-container").withAttribute("class", "MathJax"))
    .ok();
});
