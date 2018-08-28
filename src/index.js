import React from "react";
import ReactDOM from "react-dom";
import "@instructure/ui-themes/lib/canvas";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
