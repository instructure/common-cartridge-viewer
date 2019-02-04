import { Selector } from "testcafe";

fixture`Mitigate Preview Failure`;

const goodManifestUrlAndGoodImsccUrl = `http://localhost:5000/?manifest=${encodeURIComponent(
  "/test-cartridges/course-1/imsmanifest.xml"
)}&cartridge=${encodeURIComponent(
  "http://s3.amazonaws.com/public-imscc/single-page.imscc"
)}`;

const badManifestUrlAndGoodImsccUrl = `http://localhost:5000/?manifest=${encodeURIComponent(
  "/test-cartridges/course-1/imsmanifestDOESNOTEXIST.xml"
)}&cartridge=${encodeURIComponent(
  "http://s3.amazonaws.com/public-imscc/single-page.imscc"
)}`;

const badManifestUrlAndBadImsccUrl = `http://localhost:5000/?manifest=${encodeURIComponent(
  "/test-cartridges/course-1/imsmanifestDOESNOTEXIST.xml"
)}&cartridge=${encodeURIComponent(
  "http://s3.amazonaws.com/public-imscc/single-pageDOESNOTEXIST.imscc"
)}`;

test("Manifest is preferred preview type", async t => {
  await t.navigateTo(goodManifestUrlAndGoodImsccUrl);

  await t
    .expect(Selector("header").withText("COURSE-for-modules-testing").exists)
    .ok()
    .expect(Selector("a").withText("Assignments (2)").exists)
    .ok()
    .expect(Selector("a").withText("First Module Discussion 1").exists)
    .ok()
    .expect(Selector("header").withText("The Life of Paul").exists)
    .notOk();
});

test("Bad manifest url falls back to previewing by imscc if present in url", async t => {
  await t.navigateTo(badManifestUrlAndGoodImsccUrl);

  await t
    .expect(Selector("header").withText("The Life of Paul").exists)
    .ok()
    .expect(Selector("h1").withText("Our Purpose").exists)
    .ok()
    .expect(Selector("header").withText("COURSE-for-modules-testing").exists)
    .notOk();
});

test("Bad manifest url & bad imscc url shows error page", async t => {
  await t.navigateTo(badManifestUrlAndBadImsccUrl);

  await t
    .expect(Selector("span").withText("Failed to load resource").exists)
    .ok();
});
