import { Selector } from "testcafe"
import { __await } from "tslib"

fixture`Assesstments`

test("when hide-responses flag is set in the url, quizzes responses are hidden", async t => {
  const assesstmentQuestions = Selector(".assessment-questions")

  await t.navigateTo(
    "http://localhost:5000/?src=https%3A//s3.amazonaws.com/public-imscc/292b3b44b9b34309b7c6e1f92019007f.imscc%23/resources/ie2b10297e865025977a509593d42a326%3F"
  )
  await t.expect(assesstmentQuestions.exists)
  await t.navigateTo(
    "http://localhost:5000/?src=https%3A//s3.amazonaws.com/public-imscc/292b3b44b9b34309b7c6e1f92019007f.imscc%23/resources/ie2b10297e865025977a509593d42a326%3Fhide-responses"
  )
  await t.expect(assesstmentQuestions.exists).notOk()
})
