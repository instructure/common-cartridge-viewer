import { Selector } from "testcafe";

fixture`US History Since 1877`.page`http://localhost:5000/`;

test("Organization item titles show for pages", async t => {
  await t
    .expect(Selector("a").withText("US History Since 1877").exists)
    .ok()
    .click(Selector("a").withText("US History Since 1877"))
    .expect(Selector("h2").withText("Main Repository").exists)
    .ok("Header shows", { timeout: 20000 })
    .expect(Selector("a").withText(`The First Measured Century`).exists, "bar")
    .ok()
    .expect(
      Selector("a").withText(
        `The Women of Hull House: Harnessing Statistics for Progressive Reform`
      ).exists
    )
    .ok();
});

test("Web link", async t => {
  await t
    .expect(Selector("a").withText("US History Since 1877").exists)
    .ok()
    .click(Selector("a").withText("US History Since 1877"))
    .click(Selector("a").withText("Gumbo"))
    .expect(Selector("span").withText("EXTERNAL LINK").exists)
    .ok()
    .expect(Selector("h1").withText("Gumbo").exists)
    .ok()
    .expect(
      Selector("a").withText("Click here to open link in new window").exists
    )
    .ok();
});

test("Web link", async t => {
  await t
    .expect(Selector("a").withText("US History Since 1877").exists)
    .ok()
    .click(Selector("a").withText("US History Since 1877"))
    .expect(Selector("h2").withText("Main Repository").exists)
    .ok("Header shows", { timeout: 20000 })
    .expect(Selector("a").withText(`The First Measured Century`).exists, "bar")
    .ok()
    .expect(
      Selector("a").withText(
        `The Women of Hull House: Harnessing Statistics for Progressive Reform`
      ).exists
    )
    .ok();
});
