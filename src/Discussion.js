import React, { Component } from "react";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import Icon from "@instructure/ui-icons/lib/Line/IconDiscussion";
import RichContent from "./RichContent";

export default class Discussion extends Component {
  render() {
    const doc = this.props.doc;
    const topicNode = doc.querySelector("topic");
    const title = topicNode.querySelector("title").textContent;
    const descriptionHtml = topicNode.querySelector("text").textContent;
    const labelColor = "#6f2562";

    return (
      <React.Fragment>
        <div className="resource-label" style={{ color: labelColor }}>
          <div
            className="resource-label-icon"
            style={{ backgroundColor: labelColor }}
          >
            <Icon color="primary-inverse" />
          </div>
          <span>Discussion</span>
        </div>

        <Heading level="h1" margin="0 0 small">
          {title}
        </Heading>

        <RichContent html={descriptionHtml} entryMap={this.props.entryMap} />
      </React.Fragment>
    );
  }
}
