import { Selector } from "testcafe";

fixture`Single assignment cartridge`
  .page`http://localhost:5000/?manifest=${encodeURIComponent(
  "/test-cartridges/single-assignment/imsmanifest.xml"
)}`;

test("Header and assignment is displayed", async t => {
  await t
    .expect(Selector("h1").withText(`Assignment`).exists)
    .ok()
    .expect(Selector("header").exists)
    .ok();
});

test("Nav is hidden", async t => {
  await t.expect(Selector("nav").exists).notOk();
});

fixture`Single assignment cartridge (with attachment, compact)`
  .page`http://localhost:5000/?compact&manifest=${encodeURIComponent(
  "/test-cartridges/single-assignment/imsmanifest.xml"
)}`;

test("Only the assignment shows", async t => {
  await t
    .expect(Selector("h1").withText(`Assignment`).exists)
    .ok()
    .expect(Selector("nav").exists)
    .notOk()
    .expect(Selector("header").exists)
    .notOk();

  const allItemsButonsButton = Selector("span")
    .withText("All Items")
    .parent("a");

  await t.expect(allItemsButonsButton.exists).notOk();
});
