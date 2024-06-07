import React, { Component } from "react";
import {
  generateFriendlyStringFromSubmissionFormats,
  getFileResourcePath,
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
    ).map(node => getFileResourcePath(node.getAttribute("href"), true));

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

    return !!externalToolNode ? (
      PreviewUnavailable()
    ) : (
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
      />
    );
  }
}
