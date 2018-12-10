import { Selector } from "testcafe";

fixture`Accessibility Workshop cartridge`.page`http://localhost:5000/`;

test("Resource not found", async t => {
  // first, wait for cartridge to load
  await t
    .click(Selector("a").withText("Ally: Accessibility Workshop"))
    .expect(
      Selector("h3").withText("Part 1: Overview: Accessibility and ALLY").exists
    )
    .ok("Header shows", { timeout: 20000 });

  await t
    .navigateTo("#/resources/notfound")
    .expect(Selector("span").withText("Resource Unavailable").exists)
    .ok();
});
