import { Selector } from "testcafe";

fixture`Content Navigation links (Next, Previous, Etc.)`;

test("Next link on first page works", async t => {
  const nextButton = Selector("span")
    .withText("Next")
    .parent("a");
  const previousButton = Selector("span")
    .withText("Previous")
    .parent("a");
  const titleH1 = Selector("h1");

  await t.navigateTo(
    `http://localhost:5000/?manifest=${encodeURIComponent(
      "/test-cartridges/course-1/imsmanifest.xml"
    )}#/resources/i7aff7e807cbf2c3be5ca6fc0733ff0a8`
  );
  await t.expect(previousButton.exists).notOk();
  await t.click(nextButton);
  await t.expect(titleH1.textContent).contains("First Module Quiz 1");
});

test("Previous link on last page works", async t => {
  const nextButton = Selector("span")
    .withText("Next")
    .parent("a");
  const previousButton = Selector("span")
    .withText("Previous")
    .parent("a");

  await t.navigateTo(
    `http://localhost:5000/?manifest=${encodeURIComponent(
      "/test-cartridges/course-1/imsmanifest.xml"
    )}#/resources/ie51764b374b71d85aef92a2fa25368ef`
  );
  await t.expect(nextButton.exists).notOk();
  await t.click(previousButton);
  await t
    .expect(
      Selector("h1").withText("Assignment with Internal and External Links")
        .exists
    )
    .ok();
});

test("All Items link works", async t => {
  await t.navigateTo(
    `http://localhost:5000/?manifest=${encodeURIComponent(
      "/test-cartridges/course-1/imsmanifest.xml"
    )}#/resources/i694d024f7e7bb0de4335817c9d4649f1`
  );

  await t.click(Selector("a").withText("All Items"));
  await t.expect(Selector("div").withText("First Module").exists).ok();
});

fixture`Content Navigation sidebar links`;

test("Sidebar link for Pages displays correct number of wiki pages", async t => {
  const pagesSidebarLink = Selector("a").withExactText("Pages (1)");
  await t.navigateTo(
    `http://localhost:5000/?manifest=${encodeURIComponent(
      "http://localhost:5000/test-cartridges/course-1/imsmanifest.xml"
    )}#/`
  );
  await t.expect(pagesSidebarLink.exists).ok();
});
