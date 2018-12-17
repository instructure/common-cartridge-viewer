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
