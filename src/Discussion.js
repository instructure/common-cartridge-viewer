import React, { Component } from "react";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import RichContent from "./RichContent";

export default class Discussion extends Component {
  render() {
    const doc = this.props.doc;

    const assignmentNode = doc.querySelector("topic");

    const title = assignmentNode.querySelector("title").textContent;

    const descriptionHtml = assignmentNode.querySelector("text").textContent;

    return (
      <React.Fragment>
        <Heading level="h1" margin="0 0 small">
          {title}
        </Heading>

        <RichContent html={descriptionHtml} entryMap={this.props.entryMap} />
      </React.Fragment>
    );
  }
}
