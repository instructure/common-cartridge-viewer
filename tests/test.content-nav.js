import { Selector } from "testcafe"
import { __await } from "tslib";

fixture `Content Navigation links (Next, Previous, Etc.)`

test("Next link on first page works", async t => {
  const nextButton = Selector('span').withText('Next').parent('a')
  const previousButton = Selector('span').withText('Previous').parent('a')
  const titleH1 = Selector('h1')
  
  await t.navigateTo('http://localhost:5000/?src=https%3A%2F%2Fs3.amazonaws.com%2Fpublic-imscc%2FCOURSE-for-modules-testing.imscc#/resources/i7aff7e807cbf2c3be5ca6fc0733ff0a8')
  await t.expect(previousButton.exists).notOk() 
  await t.click(nextButton)
  await t.expect(titleH1.textContent).contains('First Module Quiz 1')
})

test("Previous link on last page works", async t => {
  const nextButton = Selector('span').withText('Next').parent('a')
  const previousButton = Selector('span').withText('Previous').parent('a')
  const titleH1 = Selector('h1')

  await t.navigateTo('http://localhost:5000/?src=https%3A%2F%2Fs3.amazonaws.com%2Fpublic-imscc%2FCOURSE-for-modules-testing.imscc#/resources/i694d024f7e7bb0de4335817c9d4649f1')
  await t.expect(nextButton.exists).notOk() 
  await t.click(previousButton)
  await t.expect(titleH1.textContent).contains('First Module Discussion 1')
})

test.only("All Items link works", async t => {
  // because of CM-606 we have to start from the imscc index page
  // please update this test when CM-606 is fixed
  await t.navigateTo('http://localhost:5000/?src=https%3A%2F%2Fs3.amazonaws.com%2Fpublic-imscc%2FCOURSE-for-modules-testing.imscc#/')
  await t.click(Selector('a').withText('First Module Quiz 1'))
  await t.click(Selector("a").withText("All Items"))
  await t.expect(Selector("div").withText('First Module').exists).ok()
})