import { Selector } from "testcafe";

const assignmentUrl = `http://localhost:5000/?manifest=https://s3.amazonaws.com/public-imscc/UNZIPPED+STUFF/Hyperlinks-Test-Course/imsmanifest.xml#/resources/ic0ab5c031b3cc8071f1023ae0bf34d2c`;
fixture`Single assignment with hyperlinks`.page`${assignmentUrl}`;

test("Files", async t => {
  const fileLink = Selector("a").withText(
    "annotated-bold-font-test.pptx (1).pdf"
  );
  await fileLink;
  await t
    .expect(fileLink.exists)
    .ok()
    .click(fileLink)
    .expect(
      Selector("span").withText(
        "Download annotated-bold-font-test.pptx (1).pdf"
      ).exists
    )
    .ok();
});

test("Pages", async t => {
  const pageLink = Selector("a").withText("Learning");
  await pageLink;
  await t
    .expect(pageLink.exists)
    .ok()
    .click(pageLink)
    .expect(Selector("h1").withText("Learning").exists)
    .ok()
    .expect(Selector("p").withText("is great.").exists)
    .ok();
});

test("Assignments", async t => {
  const assignmentUrl = Selector("a").withText("Published Assignment");
  await assignmentUrl;
  await t
    .expect(assignmentUrl.exists)
    .ok()
    .click(assignmentUrl)
    .expect(Selector("h1").withText("Published Assignment").exists)
    .ok()
    .expect(Selector("p").withText("This assignment is published").exists)
    .ok();
});

test("Quizzes", async t => {
  const quizLink = Selector("a").withText("New Quiz");
  await quizLink;
  await t
    .expect(quizLink.exists)
    .ok()
    .click(quizLink)
    .expect(Selector("h1").withText("New Quiz").exists)
    .ok()
    .expect(Selector("p").withText("What is up?").exists)
    .ok();
});

test("Announcements", async t => {
  const announcementLink = Selector("a").withText("Announcement");
  await announcementLink;
  await t
    .expect(announcementLink.exists)
    .ok()
    .click(announcementLink)
    .expect(Selector("h1").withText("Announcement").exists)
    .ok()
    .expect(Selector("p").withText("Hello").exists)
    .ok();
});

test("Discussions", async t => {
  const discussionLink = Selector("a").withText("Discuss This");
  await discussionLink;
  await t
    .expect(discussionLink.exists)
    .ok()
    .click(discussionLink)
    .expect(Selector("h1").withText("Discuss This").exists)
    .ok()
    .expect(Selector("p").withText("Yep").exists)
    .ok();
});

test("Modules", async t => {
  const moduleLink = Selector("a").withText("Some Assignments");
  await moduleLink;
  await t
    .expect(moduleLink.exists)
    .ok()
    .click(moduleLink)
    .expect(Selector("div").withText("Some Assignments").exists)
    .ok()
    .expect(Selector("a").withText("Unpublished Assignment").exists)
    .ok();
});

test("Course Navigation", async t => {
  const assignments = Selector("a").withExactText("Assignments");
  const pages = Selector("a").withExactText("Pages");
  const discussions = Selector("a").withExactText("Discussions");
  const syllabus = Selector("a").withExactText("Syllabus");
  const announcements = Selector("a").withExactText("Announcements");
  const quizzes = Selector("a").withExactText("Quizzes");
  const files = Selector("a").withExactText("Files");
  const collaborations = Selector("a").withExactText("Collaborations");
  const grades = Selector("a").withExactText("Grades");
  const people = Selector("a").withExactText("People");
  const modules = Selector("a").withExactText("Modules");

  const courseNavigationWarning = Selector("span").withText(
    "Course Navigation Cannot Be Previewed"
  );
  const courseNavigationSubWarning = Selector("span").withText(
    "Course navigation links are only available within a Canvas course."
  );

  await t
    // assignments
    .navigateTo(assignmentUrl)
    .expect(assignments.exists)
    .ok()
    .click(assignments)
    .expect(Selector("a").withText("Published Assignment").exists)
    .ok()
    // pages
    .navigateTo(assignmentUrl)
    .expect(pages.exists)
    .ok()
    .click(pages)
    .expect(Selector("a").withText("Learning").exists)
    .ok()
    // discussions
    .navigateTo(assignmentUrl)
    .expect(discussions.exists)
    .ok()
    .click(discussions)
    .expect(Selector("a").withText("Discuss This").exists)
    .ok()
    // syllabus
    .navigateTo(assignmentUrl)
    .expect(syllabus.exists)
    .ok()
    .click(syllabus)
    .expect(courseNavigationWarning.exists)
    .ok()
    .expect(courseNavigationSubWarning.exists)
    .ok()
    // announcements
    .navigateTo(assignmentUrl)
    .expect(announcements.exists)
    .ok()
    .click(announcements)
    .expect(courseNavigationWarning.exists)
    .ok()
    .expect(courseNavigationSubWarning.exists)
    .ok()
    // quizzes
    .navigateTo(assignmentUrl)
    .expect(quizzes.exists)
    .ok()
    .click(quizzes)
    .expect(Selector("a").withText("New Quiz").exists)
    .ok()
    // files
    .navigateTo(assignmentUrl)
    .expect(files.exists)
    .ok()
    .click(files)
    .expect(
      Selector("a").withText("annotated-bold-font-test.pptx (1).pdf").exists
    )
    .ok()
    // collaborations
    .navigateTo(assignmentUrl)
    .expect(collaborations.exists)
    .ok()
    .click(collaborations)
    .expect(courseNavigationWarning.exists)
    .ok()
    .expect(courseNavigationSubWarning.exists)
    .ok()
    // grades
    .navigateTo(assignmentUrl)
    .expect(grades.exists)
    .ok()
    .click(grades)
    .expect(courseNavigationWarning.exists)
    .ok()
    .expect(courseNavigationSubWarning.exists)
    .ok()
    // people
    .navigateTo(assignmentUrl)
    .expect(people.exists)
    .ok()
    .click(people)
    .expect(courseNavigationWarning.exists)
    .ok()
    .expect(courseNavigationSubWarning.exists)
    .ok()
    // modules
    .navigateTo(assignmentUrl)
    .expect(modules.exists)
    .ok()
    .click(modules)
    .expect(Selector("div").withText("Some Assignments").exists)
    .ok();
});
