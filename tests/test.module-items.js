import { Selector } from "testcafe";

fixture`Course with 1 module (has all item types)`
  .page`http://localhost:3000/?src=https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fcartridges-for-commons-preview%2FCOURSE-for-modules-testing.imscc#/`;

test("Module Title is displayed", async t => {
  await t
    .expect(Selector(".Module h3").withText(`First Module`).exists)
    .ok()
});

test("Assignment Items work", async t => {
  await t
    .expect(Selector(".ExpandCollapseList-item:nth-of-type(1) svg[name='IconAssignment']").exists)
    .ok()
    .click(Selector('.ExpandCollapseList-item:nth-of-type(1) a').withText('First Module Assignment 1'))
    .expect(Selector('h1').withText('First Module Assignment 1').exists)
    .ok()
});
