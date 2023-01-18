import "babel-polyfill";
import "whatwg-fetch";

import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

import theme from "@instructure/ui-themes/lib/canvas";
import highContrastTheme from "@instructure/ui-themes/lib/canvas/high-contrast";
import "./index.css";
import "./resource-type-colors.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { setupI18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { AVAILABLE_LOCALES } from "./constants";

const queryString = require("query-string"); // has issue with module import
const parsedQueryString = queryString.parse(window.location.search);

export const i18n = setupI18n({});

const rawLocale = parsedQueryString["locale"];
const locale = AVAILABLE_LOCALES[rawLocale] ? rawLocale : "en";
i18n.activate(locale);
AVAILABLE_LOCALES[locale]().then(messages => {
  const catalogs = {};
  catalogs[locale] = messages;
  i18n.load(catalogs);
});

const highContrastEnabled =
  typeof parsedQueryString["high-contrast"] !== "undefined";

if (highContrastEnabled) {
  highContrastTheme.use();
  import("./high-contrast.css");
} else {
  theme.use();
}

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 0.2
});

ReactDOM.render(
  <I18nProvider i18n={i18n}>
    <App
      compact={typeof parsedQueryString.compact !== "undefined"}
      manifest={parsedQueryString.manifest}
      cartridge={parsedQueryString.src || parsedQueryString.cartridge}
    />
  </I18nProvider>,
  document.getElementById("root")
);

registerServiceWorker();
