import { Selector } from "testcafe";

fixture`Pagination`;

const baseUrl =
  "http://localhost:5000/?manifest=https://s3.amazonaws.com/public-imscc/UNZIPPED+STUFF/caleblorcruxcourse-export-big/imsmanifest.xml#/";
const paginationButtonSelector = Selector("a").withAttribute(
  "data-uid",
  "Button PaginationButton"
);
const activePaginationButtonSelector = paginationButtonSelector.withAttribute(
  "aria-current",
  "page"
);

test("Pagination works on lists with > 100 items", async t => {
  await t
    .navigateTo(`${baseUrl}files`)
    .expect(activePaginationButtonSelector.withText("1").exists)
    .ok({ timeout: 20000 })
    .expect(
      Selector("a").withText("Robot Components 4 Best Solutions-help.pptx")
        .exists
    )
    .ok()
    .expect(
      Selector("a").withText("Robot Components 5 Prototyping-help.pptx").exists
    )
    .notOk();

  await t
    .click(paginationButtonSelector.withText("2"))
    .expect(activePaginationButtonSelector.withText("2").exists)
    .ok()
    .expect(
      Selector("a").withText("Robot Components 5 Prototyping-help.pptx").exists
    )
    .ok({ timeout: 20000 });
});
