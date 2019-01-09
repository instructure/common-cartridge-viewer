import { Selector } from "testcafe";

fixture`Single page cartridge`
  .page`http://localhost:5000/?manifest=${encodeURIComponent(
  "/test-cartridges/single-page/imsmanifest.xml"
)}`;

test("Header and assignment is displayed", async t => {
  await t
    .expect(Selector("h1").withText(`Our Purpose`).exists)
    .ok()
    .expect(Selector("header").exists)
    .ok();
});

test("Content is displayed", async t => {
  await t.expect(Selector("h1").withText(`Our Purpose`).exists).ok();
});

fixture`Single page cartridge (compact)`
  .page`http://localhost:5000/?compact&manifest=${encodeURIComponent(
  "/test-cartridges/single-page/imsmanifest.xml"
)}`;

test("Header and Nav is hidden", async t => {
  await t
    .expect(Selector("h1").withText(`Our Purpose`).exists)
    .ok()
    .expect(Selector("header").exists)
    .notOk()
    .expect(Selector("nav").exists)
    .notOk();
});
