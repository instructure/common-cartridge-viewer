import { Selector } from "testcafe";

fixture`Dashboard`.page`http://localhost:5000/`;

test("Organization item titles show for pages", async t => {
  await t
    .click(Selector("a").withText("US History Since 1877"))
    .expect(Selector("h3").withText("Main Repository").exists, "foo", {
      timeout: 5000
    })
    .ok()
    .expect(Selector("a").withText(`The First Measured Century`).exists, "bar")
    .ok()
    .expect(
      Selector("a").withText(
        `The Women of Hull House: Harnessing Statistics for Progressive Reform`
      ).exists
    )
    .ok();
});
