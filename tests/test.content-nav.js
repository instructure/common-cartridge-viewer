import { Selector, ClientFunction } from "testcafe";

const browserBack = ClientFunction(() => window.history.back());
const browserForward = ClientFunction(() => window.history.forward());

fixture`Content Navigation links (Next & Previous)`;

test("Previous and Next buttons show up after navigating from Modules", async t => {
  const nextButton = Selector("span")
    .withText("Next")
    .parent("a");
  const previousButton = Selector("span")
    .withText("Previous")
    .parent("a");
  const firstModuleQuiz1 = Selector("a").withText("First Module Quiz 1");
  await t.navigateTo(
    `http://localhost:5000/?manifest=${encodeURIComponent(
      "/test-cartridges/course-1/imsmanifest.xml"
    )}#/`
  );

  await t
    .click(firstModuleQuiz1)
    .expect(nextButton.exists)
    .ok()
    .expect(previousButton.exists)
    .ok();
});

test("Previous and Next work with external tool items", async t => {
  const nextButton = Selector("span")
    .withText("Next")
    .parent("a");
  const previousButton = Selector("span")
    .withText("Previous")
    .parent("a");
  const externalToolLink = Selector("a").withText(
    "First Module AnalyTics Beta External Tool"
  );
  await t.navigateTo(
    `http://localhost:5000/?manifest=${encodeURIComponent(
      "/test-cartridges/course-1/imsmanifest.xml"
    )}#/`
  );

  await t
    .click(externalToolLink)
    .expect(nextButton.exists)
    .ok()
    .expect(previousButton.exists)
    .ok()
    .click(nextButton)
    .expect(Selector("h1").withText("photo.jpg").exists)
    .ok();

  await t.navigateTo(
    `http://localhost:5000/?manifest=${encodeURIComponent(
      "/test-cartridges/course-1/imsmanifest.xml"
    )}#/`
  );

  await t
    .click(externalToolLink)
    .expect(nextButton.exists)
    .ok()
    .expect(previousButton.exists)
    .ok()
    .click(previousButton)
    .expect(Selector("span").withText("Download sample-document.pdf").exists)
    .ok();
});

test("Previous and Next buttons don't show up after navigating from Assignments", async t => {
  const nextButton = Selector("span")
    .withText("Next")
    .parent("a");
  const previousButton = Selector("span")
    .withText("Previous")
    .parent("a");
  const firstModuleAssignment1 = Selector("a").withText(
    "First Module Assignment 1"
  );
  await t.navigateTo(
    `http://localhost:5000/?manifest=${encodeURIComponent(
      "/test-cartridges/course-1/imsmanifest.xml"
    )}#/assignments`
  );

  await t
    .click(firstModuleAssignment1)
    .expect(nextButton.exists)
    .notOk()
    .expect(previousButton.exists)
    .notOk();
});

test("Previous and Next buttons don't show up after navigating from Pages", async t => {
  const nextButton = Selector("span")
    .withText("Next")
    .parent("a");
  const previousButton = Selector("span")
    .withText("Previous")
    .parent("a");
  const firstModuleWikiPage1 = Selector("a").withText(
    "First Module Wiki Page 1"
  );
  await t.navigateTo(
    `http://localhost:5000/?manifest=${encodeURIComponent(
      "/test-cartridges/course-1/imsmanifest.xml"
    )}#/pages`
  );

  await t
    .click(firstModuleWikiPage1)
    .expect(nextButton.exists)
    .notOk()
    .expect(previousButton.exists)
    .notOk();
});

test("Previous and Next buttons don't show up after navigating from Discussions", async t => {
  const nextButton = Selector("span")
    .withText("Next")
    .parent("a");
  const previousButton = Selector("span")
    .withText("Previous")
    .parent("a");
  const firstModuleDiscussion1 = Selector("a").withText(
    "First Module Discussion 1"
  );
  await t.navigateTo(
    `http://localhost:5000/?manifest=${encodeURIComponent(
      "/test-cartridges/course-1/imsmanifest.xml"
    )}#/discussions`
  );

  await t
    .click(firstModuleDiscussion1)
    .expect(nextButton.exists)
    .notOk()
    .expect(previousButton.exists)
    .notOk();
});

test("Previous and Next buttons don't show up after navigating from Quizzes", async t => {
  const nextButton = Selector("span")
    .withText("Next")
    .parent("a");
  const previousButton = Selector("span")
    .withText("Previous")
    .parent("a");
  const firstModuleQuiz1 = Selector("a").withText("First Module Quiz 1");
  await t.navigateTo(
    `http://localhost:5000/?manifest=${encodeURIComponent(
      "/test-cartridges/course-1/imsmanifest.xml"
    )}#/quizzes`
  );

  await t
    .click(firstModuleQuiz1)
    .expect(nextButton.exists)
    .notOk()
    .expect(previousButton.exists)
    .notOk();
});

test("Previous and Next buttons don't show up after navigating from Files", async t => {
  const nextButton = Selector("span")
    .withText("Next")
    .parent("a");
  const previousButton = Selector("span")
    .withText("Previous")
    .parent("a");
  const photoJpg = Selector("a").withText("photo.jpg");
  await t.navigateTo(
    `http://localhost:5000/?manifest=${encodeURIComponent(
      "/test-cartridges/course-1/imsmanifest.xml"
    )}#/files`
  );

  await t
    .click(photoJpg)
    .expect(nextButton.exists)
    .notOk()
    .expect(previousButton.exists)
    .notOk();
});

test("Next link on first page works", async t => {
  const nextButton = Selector("span")
    .withText("Next")
    .parent("a");
  const previousButton = Selector("span")
    .withText("Previous")
    .parent("a");
  const titleH1 = Selector("h1");
  const firstPageLink = Selector("a").withText("First Module Assignment 1");

  await t.navigateTo(
    `http://localhost:5000/?manifest=${encodeURIComponent(
      "/test-cartridges/course-1/imsmanifest.xml"
    )}#/`
  );
  await t.click(firstPageLink);
  await t.expect(previousButton.exists).notOk();
  await t.click(nextButton);
  await t.expect(titleH1.textContent).contains("First Module Quiz 1");
});

test("Previous link on last page works", async t => {
  const nextButton = Selector("span")
    .withText("Next")
    .parent("a");
  const previousButton = Selector("span")
    .withText("Previous")
    .parent("a");
  const lastPageLink = Selector("a").withText(
    "The First Measured Century: 1930-1960 (60:00)"
  );

  await t.navigateTo(
    `http://localhost:5000/?manifest=${encodeURIComponent(
      "/test-cartridges/course-1/imsmanifest.xml"
    )}#/`
  );
  await t.click(lastPageLink);
  await t.expect(nextButton.exists).notOk();
  await t.click(previousButton);
  await t
    .expect(
      Selector("h1").withText("Assignment with Internal and External Links")
        .exists
    )
    .ok();
});

test("Previous and Next buttons show up after using the 'back' browser button", async t => {
  const nextButton = Selector("span")
    .withText("Next")
    .parent("a");
  const previousButton = Selector("span")
    .withText("Previous")
    .parent("a");
  const firstModuleQuiz1 = Selector("a").withText("First Module Quiz 1");
  const firstModuleQuiz1Header = Selector("h1").withText("First Module Quiz 1");
  const firstModuleWikiPage1Header = Selector("h1").withText(
    "First Module Wiki Page 1"
  );
  await t.navigateTo(
    `http://localhost:5000/?manifest=${encodeURIComponent(
      "/test-cartridges/course-1/imsmanifest.xml"
    )}#/`
  );

  await t
    .click(firstModuleQuiz1)
    .click(nextButton)
    .expect(firstModuleWikiPage1Header.exists)
    .ok();

  await browserBack();

  await t
    .expect(firstModuleQuiz1Header.exists)
    .ok()
    .expect(nextButton.exists)
    .ok()
    .expect(previousButton.exists)
    .ok();
});

test("Previous and Next buttons show up after using the 'forward' browser button", async t => {
  const nextButton = Selector("span")
    .withText("Next")
    .parent("a");
  const previousButton = Selector("span")
    .withText("Previous")
    .parent("a");
  const firstModuleQuiz1 = Selector("a").withText("First Module Quiz 1");
  const firstModuleQuiz1Header = Selector("h1").withText("First Module Quiz 1");
  await t.navigateTo(
    `http://localhost:5000/?manifest=${encodeURIComponent(
      "/test-cartridges/course-1/imsmanifest.xml"
    )}#/`
  );

  await t
    .click(firstModuleQuiz1)
    .expect(firstModuleQuiz1Header.exists)
    .ok();

  await browserBack();
  await browserForward();

  await t
    .expect(firstModuleQuiz1Header.exists)
    .ok()
    .expect(nextButton.exists)
    .ok()
    .expect(previousButton.exists)
    .ok();
});

fixture`Content Navigation sidebar links`;

test("Sidebar link for Pages displays correct number of wiki pages", async t => {
  const pagesSidebarLink = Selector("a").withExactText("Pages (1)");
  await t.navigateTo(
    `http://localhost:5000/?manifest=${encodeURIComponent(
      "http://localhost:5000/test-cartridges/course-1/imsmanifest.xml"
    )}#/`
  );
  await t.expect(pagesSidebarLink.exists).ok();
});
