import React, { Component } from "react";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import Icon from "@instructure/ui-icons/lib/Line/IconDiscussion";
import RichContent from "./RichContent";
import { basename } from "path";
import { Trans } from "@lingui/macro";
import { getFileResourcePath, getOptionalTextContent } from "./utils";

export default class Discussion extends Component {
  render() {
    const doc = this.props.doc;
    const topicNode = doc.querySelector("topic");
    if (topicNode == null) {
      // Not yet loaded
      return null;
    }
    const title = getOptionalTextContent(topicNode, "title");
    const descriptionHtml = getOptionalTextContent(topicNode, "text");
    const attachments = Array.from(
      doc.querySelectorAll("topic > attachments > attachment")
    ).map(node => getFileResourcePath(node.getAttribute("href"), true));

    return (
      <React.Fragment>
        <div className="resource-label font-color type-discussion_topic">
          <div className="resource-label-icon background-color type-discussion_topic">
            <Icon color="primary-inverse" />
          </div>
          <span>
            <Trans>Discussion</Trans>
          </span>
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
            <Heading level="h2">
              <Trans>Attachments</Trans>
            </Heading>
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
