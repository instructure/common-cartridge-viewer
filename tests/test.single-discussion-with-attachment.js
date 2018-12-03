import { Selector } from "testcafe";

fixture`Single discussion cartridge (with attachment)`
  .page`http://localhost:5000/?src=https%3A%2F%2Fs3.amazonaws.com%2Fpublic-imscc%2Fsingle-discussion.imscc#/`;

test("Header, Content, Nav, and Files are displayed", async t => {
  await t
    .expect(Selector("h1").withText(`Test discussion`).exists)
    .ok()
    .expect(Selector("nav").exists)
    .ok()
    .expect(Selector("header").exists)
    .ok()
    .expect(Selector("a.MenuItem").withText('Files (1)').exists)
});

test("Discussion attachment links are displayed", async t => {
  await t
    .expect(Selector("h1").withText(`Test discussion`).exists)
    .ok()
    .expect(Selector("h2").withText(`Attachments`).exists)
    .ok()
    .expect(Selector("a").withText(`preferences-color.png`).exists)
    .ok();
});

fixture`Single discussion cartridge (with attachment, compact)`
  .page`http://localhost:5000/?compact&src=https%3A%2F%2Fs3.amazonaws.com%2Fpublic-imscc%2Fsingle-discussion.imscc#/`;

test("Header and Nav is hidden", async t => {
  await t
    .expect(Selector("h1").withText(`Test discussion`).exists)
    .ok()
    .expect(Selector("nav").exists)
    .notOk()
    .expect(Selector("header").exists)
    .notOk();
});
