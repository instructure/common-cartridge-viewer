import { Selector } from "testcafe";

fixture`Course with multiple assignments`
  .page`http://localhost:5000/?cartridge=${encodeURIComponent(
  "/test-cartridges/canvas_cc_gem_course.imscc"
)}#/`;

const knownType = "Course with Known Submission Type";
const unknownType = "Course with Unknown Submission Type";
const missingType = "Course with Missing Submission Type";

test("Assignment with known submission type", async t => {
  await t
    .click(Selector("a").withText("Assignments (3)"))
    .expect(Selector("a").withText(knownType).exists)
    .ok()
    .click(Selector("a").withText(knownType))
    .expect(Selector("h1").withText(knownType).exists)
    .ok()
    .expect(Selector("div").withText("Submitting:").exists)
    .ok()
    .expect(Selector("div").withText("Points:").exists)
    .ok();
});

test("Assignment with unknown submission type", async t => {
  await t
    .click(Selector("a").withText("Assignments (3)"))
    .expect(Selector("a").withText(unknownType).exists)
    .ok()
    .click(Selector("a").withText(unknownType))
    .expect(Selector("h1").withText(unknownType).exists)
    .ok()
    .expect(Selector("div").withText("Submitting:").exists)
    .notOk()
    .expect(Selector("div").withText("Points:").exists)
    .ok();
});

test("Assignment with missing submission type", async t => {
  await t
    .click(Selector("a").withText("Assignments (3)"))
    .expect(Selector("a").withText(missingType).exists)
    .ok()
    .click(Selector("a").withText(missingType))
    .expect(Selector("h1").withText(missingType).exists)
    .ok()
    .expect(Selector("div").withText("Submitting:").exists)
    .ok()
    .expect(Selector("div").withText("Points:").exists)
    .ok();
});
