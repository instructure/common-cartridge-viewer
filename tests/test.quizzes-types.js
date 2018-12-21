import { Selector } from "testcafe";

fixture`Quiz with all question types`
  .page`http://localhost:5000/?manifest=/test-cartridges/all-question-types/imsmanifest.xml#/`;

test("Resource loads as quiz", async t => {
  await t.expect(Selector(".resource-label").withText("QUIZ").exists).ok();
  await t.expect(Selector(".MenuItem").withText("Quizzes (1)").exists).ok();
});

test("Quizzes types are shown", async t => {
  const questions = Selector(".assessment-questions li");
  await t
    .expect(questions.withText("MULTIPLE CHOICE").exists)
    .ok()
    .expect(questions.withText("TRUE / FALSE").exists)
    .ok()
    .expect(questions.withText("MULTIPLE RESPONSE").exists)
    .ok()
    .expect(questions.withText("ESSAY").exists)
    .ok()
    expect(questions.withText("MULTIPLE DROPDOWNS").exists)
    .ok()
    expect(questions.withText("MATCH QUESTIONS").exists)
    .ok()
    expect(questions.withText("NUMUERICAL").exists)
    .ok()
    expect(questions.withText("CALCULATED").exists)
    .ok()
    expect(questions.withText("TEXT ONLY").exists)
    .ok()
    expect(questions.withText("FILE UPLOAD").exists)
    .ok();
});

test("Quiz correct answer is shown", async t => {
  const questions = await Selector(".assessment-questions li");
  const multipleChoiceQuestion = await questions.withText("MULTIPLE CHOICE");

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
  const assessmentQuestions = Selector(".question-answers");
  await t.navigateTo(
    `http://localhost:5000/?manifest=${encodeURIComponent(
      "/test-cartridges/all-question-types/imsmanifest.xml"
    )}#/`
  );
  await t.expect(assessmentQuestions.exists);
  await t.navigateTo(
    `http://localhost:5000/?hide-responses&manifest=${encodeURIComponent(
      "/test-cartridges/all-question-types/imsmanifest.xml"
    )}#/`
  );
  await t.expect(assessmentQuestions.exists).notOk();
});
