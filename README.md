# Common Cartridge Viewer

View Common Cartridges in the browser. Methods:

- Load a CORS-enabled remote `.imscc` or `.zip` cartridge
- Load a CORS-enabled exracted cartridge by pointing to its `imsmanifest.xml`
- Drop and drop a cartridge into the viewer

## Demo

[https://common-cartridge-viewer.netlify.com](https://common-cartridge-viewer.netlify.com/)

## Quick start

```bash
git clone https://github.com/instructure/common-cartridge-viewer.git
cd common-cartridge-viewer
yarn
yarn run build # populates locale data
yarn start
```

## Usage examples

### Load an extracted cartridge

```html
<iframe
  sandbox="allow-scripts allow-same-origin"
  src="https://common-cartridge-viewer.netlify.com/?manifest=https://common-cartridge-viewer.netlify.com/test-cartridges/course-1/imsmanifest.xml"
></iframe>
```

### Load a compressed cartridge

```html
<iframe
  sandbox="allow-scripts allow-same-origin"
  src="https://common-cartridge-viewer.netlify.com/?cartridge=https://s3.amazonaws.com/public-imscc/facc0607309246638c298c6a1b01abcf.imscc"
></iframe>
```
