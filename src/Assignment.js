import React, { Component } from "react";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import RichContent from "./RichContent";
import Icon from "@instructure/ui-icons/lib/Line/IconAssignment";
import { basename } from "path";
import { CC_FILE_PREFIX, CC_FILE_PREFIX_OLD } from "./constants";

export default class Assignment extends Component {
  render() {
    const doc = this.props.doc;
    const assignmentNode = doc.querySelector("assignment");
    if (assignmentNode == null) {
      // Not yet loaded
      return null;
    }
    const title = assignmentNode.querySelector("title").textContent;
    const descriptionHtml = assignmentNode.querySelector("text").textContent;
    const attachments = Array.from(
      doc.querySelectorAll("assignment > attachments > attachment")
    ).map(node =>
      decodeURIComponent(
        encodeURIComponent(node.getAttribute("href"))
          .replace(CC_FILE_PREFIX_OLD, "web_resources")
          .replace(CC_FILE_PREFIX, "web_resources")
      )
    );
    const submissionFormats = Array.from(
      assignmentNode.querySelectorAll("submission_formats > format")
    ).map(node => node.getAttribute("type"));
    const gradableNode = assignmentNode.querySelector("gradable");
    const points =
      gradableNode &&
      gradableNode.textContent === "true" &&
      gradableNode.getAttribute("points_possible")
        ? parseFloat(gradableNode.getAttribute("points_possible"))
        : 0;
    const labelColor = "#AD4AA0";

    return (
      <React.Fragment>
        <div className="resource-label" style={{ color: labelColor }}>
          <div
            className="resource-label-icon"
            style={{ backgroundColor: labelColor }}
          >
            <Icon color="primary-inverse" />
          </div>
          <span>Assignment</span>
        </div>

        <Heading level="h1" margin="0 0 small">
          {title}
        </Heading>
        {submissionFormats.length > 0 && (
          <React.Fragment>
            <div style={{ marginTop: "12px", marginBottom: "12px" }}>
              <span style={{ fontWeight: "bold" }}>Submission formats</span>:{" "}
              {submissionFormats.map(format => (
                <span className="submission-format" key={format}>
                  {format}
                </span>
              ))}
            </div>
          </React.Fragment>
        )}

        {gradableNode != null && (
          <div>
            <span style={{ fontWeight: "bold" }}>Points</span>: {points}
          </div>
        )}

        {descriptionHtml &&
          descriptionHtml.length > 0 && (
            <RichContent
              html={descriptionHtml}
              entryMap={this.props.entryMap}
            />
          )}

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
