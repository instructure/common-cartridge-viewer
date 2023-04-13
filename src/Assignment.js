import React, { Component } from "react";
import {
  CC_FILE_PREFIX,
  CC_FILE_PREFIX_OLD,
  CC_FILE_PREFIX_DECODED
} from "./constants";
import {
  generateFriendlyStringFromSubmissionFormats,
  getOptionalTextContent
} from "./utils";
import AssignmentBody from "./AssignmentBody";
import PreviewUnavailable from "./PreviewUnavailable";

export default class Assignment extends Component {
  render() {
    const doc = this.props.doc;
    const assignmentNode = doc.querySelector("assignment");
    if (assignmentNode == null) {
      // Not yet loaded
      return null;
    }
    const title = getOptionalTextContent(assignmentNode, "title");
    const descriptionHtml = getOptionalTextContent(assignmentNode, "text");
    const attachments = Array.from(
      doc.querySelectorAll("assignment > attachments > attachment")
    ).map(node =>
      decodeURIComponent(
        encodeURIComponent(node.getAttribute("href"))
          .replace(CC_FILE_PREFIX_OLD, "web_resources")
          .replace(CC_FILE_PREFIX, "web_resources")
          .replace(CC_FILE_PREFIX_DECODED, "web_resources")
      )
    );

    // Check for rubrics
    const rubricIdent = assignmentNode.querySelector("rubric_identifierref");
    let rubric = null;

    if (
      rubricIdent &&
      this.props.rubrics &&
      this.props.rubrics.has(rubricIdent.textContent)
    ) {
      rubric = this.props.rubrics.get(rubricIdent.textContent);
    }

    const submissionFormats = assignmentNode.querySelector("submission_types")
      .textContent;
    const externalToolNode = doc.querySelector(
      "external_tool_external_identifier"
    );
    const gradableNode = assignmentNode.querySelector("gradable");
    const points =
      gradableNode &&
      gradableNode.textContent === "true" &&
      gradableNode.getAttribute("points_possible")
        ? parseFloat(gradableNode.getAttribute("points_possible"))
        : 0;

    return (
      <AssignmentBody
        title={title}
        descriptionHtml={descriptionHtml}
        pointsPossible={points}
        submissionFormats={generateFriendlyStringFromSubmissionFormats(
          submissionFormats
        )}
        getUrlForPath={this.props.getUrlForPath}
        resourceIdsByHrefMap={this.props.resourceIdsByHrefMap}
        attachments={attachments}
        rubric={rubric}
        contextTitle={this.props.contextTitle}
      />
    );
  }
}
