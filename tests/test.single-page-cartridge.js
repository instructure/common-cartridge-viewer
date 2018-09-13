import { Selector } from "testcafe";

fixture`Single page cartridge`
  .page`http://localhost:5000/?src=https%3A%2F%2Fs3.amazonaws.com%2Fpublic-imscc%2Fsingle-page-cartridge.imscc#/`;

test("Nav and title is hidden", async t => {
  await t
    .expect(Selector("h1").withText(`Our Purpose`).exists)
    .ok()
    .expect(Selector("nav").exists)
    .notOk()
    .expect(Selector("header").exists)
    .notOk();
});
