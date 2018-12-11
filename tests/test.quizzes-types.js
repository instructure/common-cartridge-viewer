import { Selector } from "testcafe";

fixture`Quizz with all question types`
  .page`http://localhost:5000/?manifest=${encodeURIComponent(
  "/test-cartridges/all-question-types/imsmanifest.xml"
)}#/`;

test("Resourde loaded as quizz", async t => {
  await t.expect(Selector(".resource-label").withText(`Quizz`).exists).ok();
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
