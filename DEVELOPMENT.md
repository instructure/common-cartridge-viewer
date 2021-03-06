## Tests

[![Build Status](https://travis-ci.org/instructure/common-cartridge-viewer.svg?branch=master)](https://travis-ci.org/instructure/common-cartridge-viewer)

The tests try to visit the app in localhost:5000.
Before running the tests, set `PORT=5000` as an
environment variable to make them pass

```bash
yarn run build
yarn test
```
If you modify a test cartridge, you have to run the 
```bash
yarn run build
```
again.

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
