import { Selector } from "testcafe";

fixture`Course with multiple pages but no modules`
  .page`http://localhost:5000/?manifest=${encodeURIComponent(
  "/test-cartridges/rich-content-cc-file/imsmanifest.xml"
)}#/`;

test("Image with $IMS-CC-FILEBASE$ is visible", async t => {
  await t
    .expect(
      Selector("img").withAttribute(
        "src",
        "/test-cartridges/rich-content-cc-file/web_resources/Uploaded%20Media/border%20copy.png"
      ).exists
    )
    .ok();
});

test("Image with %24IMS_CC_FILEBASE%24/files is visible", async t => {
  await t
    .expect(
      Selector("img").withAttribute(
        "src",
        "/test-cartridges/rich-content-cc-file/web_resources/shapes.jpg"
      ).exists
    )
    .ok();
});
