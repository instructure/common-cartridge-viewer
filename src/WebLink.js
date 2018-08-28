import React, { Component } from "react";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import IconExternalLink from "@instructure/ui-icons/lib/Line/IconExternalLink";

export default class WebLink extends Component {
  render() {
    const doc = this.props.doc;

    const title = doc.querySelector("title")
      ? doc.querySelector("title").textContent
      : "Untitled";

    const href = doc.querySelector("url").getAttribute("href");

    return (
      <div>
        <Heading level="h1" margin="0 0 small">
          {title}
        </Heading>

        <span style={{ marginRight: "8px" }}>
          <IconExternalLink />
        </span>
        <a href={href} target="_blank">
          Click here to open link in new window
        </a>
      </div>
    );
  }
}
