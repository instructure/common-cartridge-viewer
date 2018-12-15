import { Selector } from "testcafe";

fixture`Accessibility Workshop cartridge`
  .page`http://localhost:5000/?manifest=${encodeURIComponent(
  "/test-cartridges/doesnot/exist.xml"
)}`;

test("Resources not found in imsmanifest.xml", async t => {
  await t
    .expect(Selector("span").withText("Failed to load resource").exists)
    .ok();
});

fixture`Accessibility Workshop cartridge`
  .page`http://localhost:5000/?manifest=${encodeURIComponent(
  "/test-cartridges/doesnotexist.imscc"
)}`;

test("Failed to load cartridge", async t => {
  await t
    .expect(Selector("span").withText("Failed to load resource").exists)
    .ok();
});

fixture`Accessibility Workshop cartridge`
  .page`http://localhost:5000/?manifest=${encodeURIComponent(
  "/test-cartridges/course-1/imsmanifest.xml"
)}`;

test("Cartridge loaded, but resource not found", async t => {
  await t
    .navigateTo("#/resources/notfound")
    .expect(Selector("span").withText("Resource Unavailable").exists)
    .ok();
});
