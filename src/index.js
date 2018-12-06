import React from "react";
import ReactDOM from "react-dom";
import "@instructure/ui-themes/lib/canvas";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { I18nProvider } from "@lingui/react";

const queryString = require("query-string-es5"); // has issue with module import
const parsedQueryString = queryString.parse(window.location.search);

ReactDOM.render(
  <I18nProvider language="en">
    <App
      compact={typeof parsedQueryString.compact !== "undefined"}
      manifest={parsedQueryString.manifest}
      cartridge={parsedQueryString.cartridge || parsedQueryString.src}
    />
  </I18nProvider>,
  document.getElementById("root")
);

registerServiceWorker();
