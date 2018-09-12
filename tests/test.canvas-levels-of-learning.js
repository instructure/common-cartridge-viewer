import { Selector } from "testcafe";

fixture`Canvas Levels of Learning XP`.page`http://localhost:5000/`;

test("Substition token (CANVAS_COURSE_REFERENCE)", async t => {
  await t
    .click(Selector("a").withText("Canvas Levels of Learning XP"))
    .expect(Selector("h3").withText("Getting Started").exists)
    .ok("Header shows", { timeout: 35000 })
    .click(Selector("a").withText("Pages Study Material - Videos"))
    .click(Selector("a").withText("Skip"))
    .expect(Selector("h1").withText(`Pages Quiz`).exists)
    .ok();
});

test("Substition token (CANVAS_OBJECT_REFERENCE)", async t => {
  await t
    .click(Selector("a").withText("Canvas Levels of Learning XP"))
    .expect(Selector("h3").withText("Getting Started").exists)
    .ok("Header shows", { timeout: 35000 })
    .click(Selector("a").withText("Arc Study Material - Guides"))
    .click(Selector("a").withText("Skip"))
    .expect(Selector("h1").withText(`Arc`).exists)
    .ok();
});
