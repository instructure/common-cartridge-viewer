## Tests

[![Build Status](https://travis-ci.org/instructure/common-cartridge-viewer.svg?branch=master)](https://travis-ci.org/instructure/common-cartridge-viewer)

The tests try to visit the app in localhost:5000.
Before running the tests, set `PORT=5000` as an environment variable to make them pass.

**Recommended test command (headless Chrome only):**
```bash
PORT=5000 npm run build
PORT=5000 npm run test-chrome-headless
```

**Note:** Firefox headless tests are not working reliably. Use `test-chrome-headless` for stable results.

If you modify a test cartridge, you have to run the build command again.

## Internationalization

All user-facing strings (except things printed to the console) should be wrapped
such that our i18n package (Lingui 5) can detect and translate them.

For strings that are a child in a react component, use the `<Trans>` tag.

Example:

```javascript
import { Trans } from "@lingui/react/macro";
...
<div>
  <p><Trans>This is a translated string</Trans></p>
</div>
```

For strings that are html attributes, props, or live outside a react component
(ex: utils functions), use the `t` macro. It uses the global `i18n` instance that
`index.js` activates, so no wrapper is needed.

Example:

```javascript
import { t } from "@lingui/core/macro";
...
return <Billboard heading={t`This is a translated string`} />;
```

Write each message on one line. The message id is a hash of the exact text, so
extra whitespace or line breaks change the id and break the translation lookup.

Catalogs live in `src/locales/<locale>/messages.po`, and `lingui.config.js` lists
the locales. To extract all strings from the app and prepare for translation, run
`npm run extract`.

To take the translation source files and compile for use by the app, run
`npm run compile`. The compiled `messages.js` files are not committed, and
`npm start` does not compile them. Run `npm run compile` once (or `npm run build`)
before testing a locale with `?locale=<code>`. Locales missing a translation fall
back to English.

## Environment variables

- `REACT_APP_SENTRY_DSN`: Sentry project address, read at build time. Sentry is
  off when it is not set.
- `PORT`: dev server port (react-scripts). The Dockerfile sets 3300.
- `PUBLIC_URL`: base path for the app and its service worker (react-scripts).

The viewer also takes options in the URL: `?cartridge=` or `?src=`, `?manifest=`,
`?locale=`, `?compact` and `?high-contrast`.
