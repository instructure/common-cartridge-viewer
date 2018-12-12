import { Selector } from "testcafe";
const courseUrl = `http://localhost:5000/?manifest=https://s3.amazonaws.com/public-imscc/UNZIPPED+STUFF/single-assignment-with-internal-and-external-links/imsmanifest.xml`;
fixture`Single assignment cartridge (with attachment)`.page`${courseUrl}`;

test("Description is displayed with links", async t => {
  const richContentLink = Selector(".RichContent a");
  await t.expect(Selector(richContentLink).withText(`wiki sample`).exists);
  await t.expect(
    Selector(richContentLink).withText(`Docviewer Assignment`).exists
  );
  await t.expect(Selector(richContentLink).withText(`Basic Quiz`).exists);
  await t.expect(
    Selector(richContentLink).withText(`Google RCE Announcement`).exists
  );
  await t.expect(
    Selector(richContentLink).withText(`Simple Discussion`).exists
  );
  await t.expect(Selector(richContentLink).withText(`api mod 1`).exists);
});

test("Unavailable resource links show proper message", async t => {
  const unavailableResourceHeading = Selector("span").withText(
    "Resource Unavailable"
  );
  const richContentLink = Selector(".RichContent a");
  const wikiSampleLink = Selector(richContentLink).withText(`wiki sample`);
  const assignmentLink = Selector(richContentLink).withText(
    `Docviewer Assignment`
  );
  const quizLink = Selector(richContentLink).withText(`Basic Quiz`);
  const announcementLink = Selector(richContentLink).withText(
    `Google RCE Announcement`
  );
  const discussionLink = Selector(richContentLink).withText(
    `Simple Discussion`
  );
  await t
    // page
    .expect(wikiSampleLink.exists)
    .ok()
    .click(wikiSampleLink)
    .expect(unavailableResourceHeading.exists)
    .ok()
    // assignment
    .navigateTo(courseUrl)
    .expect(assignmentLink.exists)
    .ok()
    .click(assignmentLink)
    .expect(unavailableResourceHeading.exists)
    .ok()
    // quiz
    .navigateTo(courseUrl)
    .expect(quizLink.exists)
    .ok()
    .click(quizLink)
    .expect(unavailableResourceHeading.exists)
    .ok()
    // announcement
    .navigateTo(courseUrl)
    .expect(announcementLink.exists)
    .ok()
    .click(announcementLink)
    .expect(unavailableResourceHeading.exists)
    .ok()
    // discussion
    .navigateTo(courseUrl)
    .expect(discussionLink.exists)
    .ok()
    .click(discussionLink)
    .expect(unavailableResourceHeading.exists)
    .ok();
});
