import { Selector } from "testcafe";

fixture`Quiz with all question types`
  .page`http://localhost:5000/?manifest=${encodeURIComponent(
  "/test-cartridges/all-question-types/imsmanifest.xml"
)}#/`;

test("Resourde loaded as quiz", async t => {
  await t.expect(Selector(".resource-label").withText(`Quiz`).exists).ok();
});

test("Quizzes types are shown", async t => {
  await t
    .expect(Selector('*[data-uid="Pill"]').withText("Multiple choice").exists)
    .ok()
    .expect(Selector('*[data-uid="Pill"]').withText("True / false").exists)
    .ok()
    .expect(Selector('*[data-uid="Pill"]').withText("Multiple response").exists)
    .ok()
    .expect(Selector('*[data-uid="Pill"]').withText("Essay").exists)
    .ok();
});

test("Quiz correct answer is shown", async t => {
  const questions = await Selector(".assessment-questions li");
  const multipleChoiceQuestion = await questions.withText("Multiple choice");

  // check that the answer to the multiple choice question is the one with the number 3:
  await t
    .expect(
      multipleChoiceQuestion
        .find("svg")
        .parent()
        .sibling()
        .withText("3")
    )
    .ok();
});

test("when hide-responses flag is set in the url, quizzes responses are hidden", async t => {
  const assesstmentQuestions = Selector(".question-answers");
  await t.navigateTo(
    `http://localhost:5000/?manifest=${encodeURIComponent(
      "/test-cartridges/all-question-types/imsmanifest.xml"
    )}#/`
  );
  await t.expect(assesstmentQuestions.exists);
  await t.navigateTo(
    `http://localhost:5000/?hide-responses&manifest=${encodeURIComponent(
      "/test-cartridges/all-question-types/imsmanifest.xml"
    )}#/`
  );
  await t.expect(assesstmentQuestions.exists).notOk();
});
