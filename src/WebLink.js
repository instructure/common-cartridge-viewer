import React, { Component } from "react";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import Icon from "@instructure/ui-icons/lib/Line/IconExternalLink";

export default class WebLink extends Component {
  render() {
    const doc = this.props.doc;

    const title = doc.querySelector("title")
      ? doc.querySelector("title").textContent
      : "Untitled";

    const href = doc.querySelector("url").getAttribute("href");

    const labelColor = "#AD4AA0";

    return (
      <div>
        <div className="resource-label" style={{ color: labelColor }}>
          <div
            className="resource-label-icon"
            style={{ backgroundColor: labelColor }}
          >
            <Icon color="primary-inverse" />
          </div>
          <span>External link</span>
        </div>

        <Heading level="h1" margin="0 0 small">
          {title}
        </Heading>

        <a href={href} target="_blank">
          Click here to open link in new window
        </a>
      </div>
    );
  }
}
