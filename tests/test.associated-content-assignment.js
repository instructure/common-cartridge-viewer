import { Selector } from "testcafe";

fixture`Associated-content assignments (loaded w/ manifest)`
  .page`http://localhost:5000/?manifest=https://s3.amazonaws.com/public-imscc/UNZIPPED+STUFF/caleblorcruxcourse-export-big/imsmanifest.xml#/`;

test("Associated-content assignment items display correctly", async t => {
  await t
    .expect(Selector("a").withText("Starter: About Me").exists)
    .ok({ timeout: 20000 })
    .expect(
      Selector("a").withText("Robot System Components Lab 1: Overview").exists
    )
    .ok()
    .expect(Selector("a").withText("Robot Basic Lesson 1").exists)
    .ok()
    .expect(Selector("a").withText("Robotics Project: Final Submission").exists)
    .ok();
});

test("Associated-content assignment items can be clicked", async t => {
  const aboutMeAssignment = Selector("a").withText("Starter: About Me");
  await t
    .expect(aboutMeAssignment.exists)
    .ok({ timeout: 20000 })
    .click(aboutMeAssignment);

  await t
    .expect(Selector("h1").withText("Starter: About Me").exists)
    .ok({ timeout: 20000 })
    .expect(Selector("div").withText("Submitting: a text entry box").exists)
    .ok()
    .expect(Selector("div").withText("Points: 10").exists)
    .ok()
    .expect(
      Selector("p").withText(
        "Write a up to one page biography about yourself. Where your from, activities, ect. Also if there is any accommodation I need to know please write them in your biography so I can best help you this year."
      ).exists
    )
    .ok();
});

test("Associated-content assignment list displays correctly", async t => {
  const assignmentsNav = Selector("a").withText("Assignments (77)");
  await t
    .expect(assignmentsNav.exists)
    .ok({ timeout: 20000 })
    .click(assignmentsNav);

  await t
    .expect(Selector("a").withText("Alice: Lab 1").exists)
    .ok({ timeout: 20000 })
    .expect(Selector("a").withText("Little Bits Lab 2: Projects").exists)
    .ok()
    .expect(Selector("a").withText("Scratch Lab 3: Motion").exists)
    .ok()
    .expect(Selector("a").withText("Starter: About Me").exists)
    .ok();
});

test("Associated-content assignment items can be clicked from assignment list view", async t => {
  const assignmentsNav = Selector("a").withText("Assignments (77)");
  await t
    .expect(assignmentsNav.exists)
    .ok({ timeout: 20000 })
    .click(assignmentsNav);

  const aliceLab1Assignment = Selector("a").withText("Alice: Lab 1");
  await t
    .expect(aliceLab1Assignment.exists)
    .ok({ timeout: 20000 })
    .click(aliceLab1Assignment);

  await t
    .expect(Selector("h1").withText("Alice: Lab 1").exists)
    .ok({ timeout: 20000 })
    .expect(Selector("div").withText("Submitting: a file upload").exists)
    .ok()
    .expect(Selector("div").withText("Points: 25").exists)
    .ok()
    .expect(Selector("p").withText("To complete this assignment:").exists)
    .ok();
});
