import "whatwg-fetch";

import React from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";

import {
  canvas,
  canvasHighContrast,
  InstUISettingsProvider
} from "@instructure/ui";
import "./index.css";
import "./resource-type-colors.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { AVAILABLE_LOCALES } from "./constants";

const queryString = require("query-string"); // has issue with module import
const parsedQueryString = queryString.parse(window.location.search);

const rawLocale = parsedQueryString["locale"];
const locale = AVAILABLE_LOCALES[rawLocale] ? rawLocale : "en";

const highContrastEnabled =
  typeof parsedQueryString["high-contrast"] !== "undefined";

if (highContrastEnabled) {
  // eslint-disable-next-line no-unused-expressions
  import("./high-contrast.css");
}

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 0.2
});

AVAILABLE_LOCALES[locale]()
  .then(catalog => catalog.messages || catalog.default.messages)
  .catch(() => ({}))
  .then(messages => {
    i18n.loadAndActivate({ locale, messages });

    createRoot(document.getElementById("root")).render(
      <InstUISettingsProvider
        theme={highContrastEnabled ? canvasHighContrast : canvas}
      >
        <I18nProvider i18n={i18n}>
          <App
            compact={typeof parsedQueryString.compact !== "undefined"}
            manifest={parsedQueryString.manifest}
            cartridge={parsedQueryString.src || parsedQueryString.cartridge}
          />
        </I18nProvider>
      </InstUISettingsProvider>
    );
  });

registerServiceWorker();
