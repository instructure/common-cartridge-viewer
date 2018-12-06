import { Selector } from "testcafe";

fixture`Single assignment cartridge (with attachment)`
  .page`http://localhost:5000/?src=https%3A%2F%2Fs3.amazonaws.com%2Fpublic-imscc%2FAssignment%2Bwith%2BInternal%2Band%2BExternal%2BLinks.imscc#/`;

// links here will not work because of CM-620
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
