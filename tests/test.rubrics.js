import { Selector } from "testcafe";
import { getElementsByXPath } from "./testUtils";

fixture`Assingment with rubrics`
  .page`http://localhost:5000/?manifest=/test-cartridges/assignment-rubrics/imsmanifest.xml#/`;

test("Resource loaded properly", async t => {
  await t
    .expect(Selector(".resource-label").withText("ASSIGNMENT").exists)
    .ok();
  await t.expect(Selector("h1").withText("Rubricated Assignment").exists).ok();
});

test("Assignment contains a rubric table", async t => {
  await t
    .expect(Selector("table").withAttribute("title", "Some Rubric").exists)
    .ok();

  await t
    .expect(Selector("td").withText("Description of criterion").exists)
    .ok();
});

test("Assignment contains an empty total points footer col if total points are missing", async t => {
  await t
    .expect(getElementsByXPath("//body//tfoot//th[2]").textContent)
    .eql("");
});
