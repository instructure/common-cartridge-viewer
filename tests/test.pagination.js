import { Selector } from "testcafe";

fixture`Pagination`;

const baseUrl = `http://localhost:5000/?manifest=${encodeURIComponent(
  "https://s3.amazonaws.com/public-imscc/UNZIPPED+STUFF/caleblorcruxcourse-export-big/imsmanifest.xml"
)}#/`;
const paginationButtonSelector = Selector("a").withAttribute(
  "data-uid",
  "Button PaginationButton"
);
const activePaginationButtonSelector = paginationButtonSelector.withAttribute(
  "aria-current",
  "page"
);

test("Pagination works on the assignments list page", async t => {
  await t
    .navigateTo(`${baseUrl}assignments`)
    .expect(activePaginationButtonSelector.withText("1").exists)
    .ok()
    .expect(
      Selector("a").withText("Career Technical Student Organizations (CTSO)")
        .exists
    )
    .ok()
    .expect(Selector("a").withText("Choregraphe (NAO Robot) 1").exists)
    .notOk();

  await t
    .click(paginationButtonSelector.withText("2"))
    .expect(activePaginationButtonSelector.withText("2").exists)
    .ok()
    .expect(Selector("a").withText("Choregraphe (NAO Robot) 1").exists)
    .ok();

  await t
    .click(paginationButtonSelector.withText("6"))
    .expect(activePaginationButtonSelector.withText("6").exists)
    .ok()
    .expect(Selector("a").withText("Technology Tasks 1: Flowcharting").exists)
    .ok();
});

test("Pagination works on the wiki pages list page", async t => {
  await t
    .navigateTo(`${baseUrl}pages`)
    .expect(activePaginationButtonSelector.withText("1").exists)
    .ok()
    .expect(Selector("a").withText("Term 2: Day 9 Robot Project 1").exists)
    .ok()
    .expect(Selector("a").withText("Term 1: Day 4 Robotics History").exists)
    .notOk();

  await t
    .click(paginationButtonSelector.withText("2"))
    .expect(activePaginationButtonSelector.withText("2").exists)
    .ok()
    .expect(Selector("a").withText("Term 1: Day 4 Robotics History").exists)
    .ok();

  await t
    .click(paginationButtonSelector.withText("5"))
    .expect(activePaginationButtonSelector.withText("5").exists)
    .ok()
    .expect(Selector("a").withText("Term 2: Day 16 CTE Testing Prep 3").exists)
    .ok();
});

test("Pagination works on the discussion list page", async t => {
  await t
    .navigateTo(`${baseUrl}discussions`)
    .expect(activePaginationButtonSelector.withText("1").exists)
    .ok()
    .expect(
      Selector("a").withText("Objective 3: Mechanical Advantage Discussion")
        .exists
    )
    .ok()
    .expect(Selector("a").withText("Industrial Application of Robotics").exists)
    .notOk();

  await t
    .click(paginationButtonSelector.withText("2"))
    .expect(activePaginationButtonSelector.withText("2").exists)
    .ok()
    .expect(Selector("a").withText("Industrial Application of Robotics").exists)
    .ok();
});

test("Pagination works on the quizzes list page", async t => {
  await t
    .navigateTo(`${baseUrl}quizzes`)
    .expect(activePaginationButtonSelector.withText("1").exists)
    .ok()
    .expect(Selector("a").withText("Course Canvas Layout Quiz").exists)
    .ok()
    .expect(Selector("a").withText("Course Daily Process Quiz").exists)
    .notOk();

  await t
    .click(paginationButtonSelector.withText("2"))
    .expect(activePaginationButtonSelector.withText("2").exists)
    .ok()
    .expect(Selector("a").withText("Course Daily Process Quiz").exists)
    .ok();

  await t
    .click(paginationButtonSelector.withText("5"))
    .expect(activePaginationButtonSelector.withText("5").exists)
    .ok()
    .expect(Selector("a").withText("Series Circuits Quiz").exists)
    .ok({ timeout: 20000 });
});

test("Pagination works on the files list page", async t => {
  await t
    .navigateTo(`${baseUrl}files`)
    .expect(activePaginationButtonSelector.withText("1").exists)
    .ok()
    .expect(Selector("a").withText("Battery Testing-help.pptx").exists)
    .ok()
    .expect(Selector("a").withText("Battery Testing.doc").exists)
    .notOk();

  await t
    .click(paginationButtonSelector.withText("2"))
    .expect(activePaginationButtonSelector.withText("2").exists)
    .ok()
    .expect(Selector("a").withText("Battery Testing.doc").exists)
    .ok();

  await t
    .click(paginationButtonSelector.withText("12"))
    .expect(activePaginationButtonSelector.withText("12").exists)
    .ok()
    .expect(Selector("a").withText("standard1rubric.JPG").exists)
    .ok({ timeout: 20000 });
});
