import { Selector } from "testcafe";

fixture`File Items`.page`http://localhost:5000/?manifest=${encodeURIComponent(
  "/test-cartridges/course-1/imsmanifest.xml"
)}#/files`;

test("Assignment items don't show up as files", async t => {
  const assignmentFileItem = Selector("a").withText(
    "i7aff7e807cbf2c3be5ca6fc0733ff0a8/first-module-assignment-1.html"
  );
  await t.expect(assignmentFileItem.exists).notOk();
});

test("Published files show up as published (no metadata case)", async t => {
  await t
    .expect(
      Selector(".ExpandCollapseList-item-workflow-state").withExactText(
        "published-document.pdf is published"
      ).exists
    )
    .ok();
});

test("Published files show up as published (intended user role includes Learner case)", async t => {
  await t
    .expect(
      Selector(".ExpandCollapseList-item-workflow-state").withExactText(
        "published-document-2.pdf is published"
      ).exists
    )
    .ok();
});

test("Unpublished files show up as unpublished", async t => {
  await t
    .expect(
      Selector(".ExpandCollapseList-item-workflow-state").withExactText(
        "unpublished-document.pdf is unpublished"
      ).exists
    )
    .ok();
});
