import { Selector } from "testcafe";

fixture`Quiz-group-question-count`
  .page`http://localhost:5000/?cartridge=http://localhost:5000/test-cartridges/grouptest.zip`;

test("Questions-under-groups-are-counted", async t => {
  const quiz1 = Selector(
    `li.ExpandCollapseList-item:nth-child(1) .ExpandCollapseList-item-details`
  ).withText("5 Questions");
  const quiz2 = Selector(
    `li.ExpandCollapseList-item:nth-child(2) .ExpandCollapseList-item-details`
  ).withText("3 Questions");
  const quiz3 = Selector(
    `li.ExpandCollapseList-item:nth-child(3) .ExpandCollapseList-item-details`
  ).withText("2 Questions");
  const quiz4 = Selector(
    `li.ExpandCollapseList-item:nth-child(4) .ExpandCollapseList-item-details`
  );

  await t
    .expect(quiz1.exists)
    .ok({ timeout: 20000 })
    .expect(quiz2.exists)
    .ok({ timeout: 20000 })
    .expect(quiz3.exists)
    .ok({ timeout: 20000 })
    .expect(quiz4.exists).notOk;
});
