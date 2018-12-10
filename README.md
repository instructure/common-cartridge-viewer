View Common Cartridges in the browser.

## Development

```
yarn
yarn start
```

## Run tests

The tests try to visit the app in localhost:5000.
Before running the tests, set `PORT=5000` as an
environment variable to make them pass

```
yarn run build
yarn test
```

## Usage example

### Load an extracted cartridge

```html
<iframe
  sandbox="allow-scripts allow-same-origin"
  src="/?manifest=[COMMON-CARTRIDGE-VIEWER-DOMAIN]/facc06073092466
38c298c6a1b01abcf/imsmanifest.xml"
></iframe>
```

### Load a compressed cartridge

```html
<iframe
  sandbox="allow-scripts allow-same-origin"
  src="/?cartridge=[COMMON-CARTRIDGE-VIEWER-DOMAIN]/facc06073092466
38c298c6a1b01abcf.imscc"
></iframe>
```
