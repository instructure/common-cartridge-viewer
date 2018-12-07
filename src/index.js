import React from "react";
import ReactDOM from "react-dom";
import "@instructure/ui-themes/lib/canvas";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { setupI18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import catalogEn from "./locales/en/messages.js";

const catalogs = {
  en: catalogEn
};

const queryString = require("query-string-es5"); // has issue with module import
const parsedQueryString = queryString.parse(window.location.search);

export const i18n = setupI18n({ language: "en", catalogs: catalogs });

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
