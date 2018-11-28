import React, { Component } from "react";
import { CC_FILE_PREFIX, CC_FILE_PREFIX_OLD } from "./constants";
import { generateFriendlyStringFromSubmissionFormats } from "./utils";
import AssignmentBody from "./AssignmentBody";

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
    const submissionFormats = assignmentNode.querySelector("submission_types")
      .textContent;

    const gradableNode = assignmentNode.querySelector("gradable");
    const points =
      gradableNode &&
      gradableNode.textContent === "true" &&
      gradableNode.getAttribute("points_possible")
        ? parseFloat(gradableNode.getAttribute("points_possible"))
        : 0;
    const labelColor = "#AD4AA0";

    return (
      <AssignmentBody
        title={title}
        descriptionHtml={descriptionHtml}
        labelColor={labelColor}
        pointsPossible={points}
        submissionFormats={generateFriendlyStringFromSubmissionFormats(
          submissionFormats
        )}
        getUrlForPath={this.props.getUrlForPath}
        resourceIdsByHrefMap={this.props.resourceIdsByHrefMap}
        attachments={attachments}
      />
    );
  }
}
