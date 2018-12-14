import { Selector } from "testcafe";

fixture`External Tool Items`
  .page`http://localhost:5000/?manifest=${encodeURIComponent(
  "/test-cartridges/course-1/imsmanifest.xml"
)}#/`;

test("External tools show up correctly in Module list", async t => {
  const externalToolLink = Selector("a").withText(
    "First Module AnalyTics Beta External Tool"
  );
  await t.expect(externalToolLink.exists).ok();
});

test("External tools links respond correctly when clicked", async t => {
  const externalToolLink = Selector("a").withText(
    "First Module AnalyTics Beta External Tool"
  );
  const externalToolMessage = Selector("span").withText(
    "External Tool Content Can't be Previewed"
  );
  await t
    .expect(externalToolLink.exists)
    .ok()
    .click(externalToolLink)
    .expect(externalToolMessage.exists)
    .ok();
});
