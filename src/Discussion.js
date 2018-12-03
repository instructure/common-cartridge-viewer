import React, { Component } from "react";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import Icon from "@instructure/ui-icons/lib/Line/IconDiscussion";
import RichContent from "./RichContent";
import { basename } from "path";
import { CC_FILE_PREFIX, CC_FILE_PREFIX_OLD } from "./constants";

export default class Discussion extends Component {
  render() {
    const doc = this.props.doc;
    const topicNode = doc.querySelector("topic");
    if (topicNode == null) {
      // Not yet loaded
      return null;
    }
    const title = topicNode.querySelector("title").textContent;
    const descriptionHtml = topicNode.querySelector("text").textContent;
    const attachments = Array.from(
      doc.querySelectorAll("topic > attachments > attachment")
    ).map(node =>
      decodeURIComponent(
        encodeURIComponent(node.getAttribute("href"))
          .replace(CC_FILE_PREFIX_OLD, "web_resources")
          .replace(CC_FILE_PREFIX, "web_resources")
      )
    );
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

        <RichContent
          html={descriptionHtml}
          getUrlForPath={this.props.getUrlForPath}
          resourceIdsByHrefMap={this.props.resourceIdsByHrefMap}
        />

        {attachments.length > 0 && (
          <React.Fragment>
            <Heading level="h2">Attachments</Heading>
            <ul>
              {attachments.map(attachment => {
                return (
                  <li key={attachment}>
                    {this.props.resourceIdsByHrefMap.has(attachment) ? (
                      <a
                        href={`#/resources/${this.props.resourceIdsByHrefMap.get(
                          attachment
                        )}`}
                      >
                        {basename(attachment)}
                      </a>
                    ) : (
                      basename(attachment)
                    )}
                  </li>
                );
              })}
            </ul>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}
