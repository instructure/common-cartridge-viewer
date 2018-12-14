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
      "http://localhost:5000/test-cartridges/course-1/imsmanifest.xml"
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
  const button = Selector("button");

  await t.navigateTo(
    `http://localhost:5000/?manifest=${encodeURIComponent(
      "http://localhost:5000/test-cartridges/course-1/imsmanifest.xml"
    )}#/resources/i20d994c705d4f2bf05a753e922547b06`
  );
  await t.expect(nextButton.exists).notOk();
  await t.click(previousButton);
  await t.expect(button.textContent).contains("Download sample-document.pdf");
});

test("All Items link works", async t => {
  await t.navigateTo(
    `http://localhost:5000/?manifest=${encodeURIComponent(
      "http://localhost:5000/test-cartridges/course-1/imsmanifest.xml"
    )}#/resources/i694d024f7e7bb0de4335817c9d4649f1`
  );

  await t.click(Selector("a").withText("All Items"));
  await t.expect(Selector("div").withText("First Module").exists).ok();
});
