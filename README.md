[![Build Status](https://travis-ci.org/instructure/common-cartridge-viewer.svg?branch=master)](https://travis-ci.org/instructure/common-cartridge-viewer)

View Common Cartridges in the browser.

## Development

```bash
yarn
yarn run build # populates locale data
yarn start
```

## Run tests

The tests try to visit the app in localhost:5000.
Before running the tests, set `PORT=5000` as an
environment variable to make them pass

```bash
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

## Internationalization

All user-facing strings (except things printed to the console) should be wrapped
such that our i18n package (linguijs) can detect and translate them.

For strings that are a child in a react component, use the `<Trans>` tag.

Example:

```javascript
import { Trans } from @lingui/macro
...
<div>
  <p><Trans>This is a translated string</Trans></p>
</div>
```

For strings that are html attributes or passed into a component as props, the
component must be wrapped in an `<I18n>` tag, and render props used to make i18n()
available. Then strings should be wrapped as: `` i18n._(t`This is a translated string`) ``.

Example:

```javascript
import { I18n } from "@lingui/react";
import { t } from "@lingui/macro";
...
return(
  <I18n>
    {({ i18n }) => (
      <Billboard
        heading={i18n._(t`This is a translated string`)}
      />
    )}
  </I18n>
)
```

For strings that exist outside of a react component (ex: utils functions) import
the i18n configuration from index.js and then proceed as described above.

Example:

```javascript
import { i18n } from "./index";
import { t } from "@lingui/macro";
...
return(
  <I18n>
    {({ i18n }) => (
      <Billboard
        heading={i18n._(t`This is a translated string`)}
      />
    )}
  </I18n>
)
```

To extract all strings from the app and prepare for translation, run
`yarn run extract`.

To take the translation source files and compile for use by the app, run
`yarn run compile`.
