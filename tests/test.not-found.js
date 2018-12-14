import { Selector } from "testcafe";

fixture`Accessibility Workshop cartridge`
  .page`http://localhost:5000/?manifest=${encodeURIComponent(
  "/test-cartridges/course-1/imsmanifest.xml"
)}`;

test("Resource not found", async t => {
  await t
    .navigateTo("#/resources/notfound")
    .expect(Selector("span").withText("Resource Unavailable").exists)
    .ok();
});
