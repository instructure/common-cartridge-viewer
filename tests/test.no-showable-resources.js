import { Selector } from "testcafe";

fixture`No showable resources`;

const url = `http://localhost:5000/?manifest=${encodeURIComponent(
  "/test-cartridges/course-with-no-showable-resources/imsmanifest.xml"
)}`;

test("Cartridge with no showable resources displays correctly", async t => {
  await t
    .navigateTo(url)
    .expect(Selector("span").withText("XavierSchool").exists)
    .ok()
    .expect(Selector("a").withText("Modules (1)").exists)
    .ok()
    .expect(Selector("h2").withText("testing").exists)
    .ok()
    .expect(Selector("a").withText("Copy of xmenusers").exists)
    .ok()
    .expect(Selector("a").withText("Monthly budget").exists)
    .ok()
    .expect(Selector("a").withText("Project proposal").exists)
    .ok()
    .expect(Selector("a").withText("slash/filename").exists)
    .ok()
    .expect(Selector("a").withText("Slides template orange").exists)
    .ok();
});

test("Cartridge with only external tool resources displays external tool warnings", async t => {
  const linkSelector = Selector("a");
  const externalToolWarningSelector = Selector("span").withText(
    "External Tool Content Can't be Previewed"
  );
  await t
    .navigateTo(url)
    .click(linkSelector.withText("Copy of xmenusers"))
    .expect(externalToolWarningSelector.exists)
    .ok()
    .navigateTo(url)
    .click(linkSelector.withText("Monthly budget"))
    .expect(externalToolWarningSelector.exists)
    .ok()
    .navigateTo(url)
    .click(linkSelector.withText("Project proposal"))
    .expect(externalToolWarningSelector.exists)
    .ok()
    .navigateTo(url)
    .click(linkSelector.withText("slash/filename"))
    .expect(externalToolWarningSelector.exists)
    .ok()
    .navigateTo(url)
    .click(linkSelector.withText("Slides template orange"))
    .expect(externalToolWarningSelector.exists)
    .ok();
});
