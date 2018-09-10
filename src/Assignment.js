import React, { Component } from "react";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import RichContent from "./RichContent";
import Icon from "@instructure/ui-icons/lib/Line/IconAssignment";

export default class Assignment extends Component {
  render() {
    const doc = this.props.doc;

    const assignmentNode = doc.querySelector("assignment");

    const title = assignmentNode.querySelector("title").textContent;

    const descriptionHtml = assignmentNode.querySelector("text").textContent;

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
        <React.Fragment>
          {submissionFormats.length > 0 && (
            <React.Fragment>
              <div style={{ marginTop: "12px", marginBottom: "12px" }}>
                <span style={{ fontWeight: "bold" }}>Submission formats</span>:{" "}
                {submissionFormats.map(format => (
                  <span key={format}>{format}</span>
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
        </React.Fragment>
      </React.Fragment>
    );
  }
}
