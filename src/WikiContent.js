import React, { Component } from "react";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import RichContent from "./RichContent";

export default class WikiContent extends Component {
  render() {
    const doc = this.props.doc;

    const title = doc.querySelector("title")
      ? doc.querySelector("title").textContent
      : "Untitled";

    const html = doc.body ? doc.body.innerHTML : ""; // doc.body.innerHTML;

    return (
      <React.Fragment>
        <Heading level="h1" margin="0 0 small">
          {title}
        </Heading>

        <RichContent html={html} entryMap={this.props.entryMap} />
      </React.Fragment>
    );
  }
}
