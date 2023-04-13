import React, { Component } from "react";
import AssignmentBody from "./AssignmentBody";
import { ASSOCIATED_CONTENT_ASSIGNMENT_TITLE_PREFIX_REGEX } from "./constants";
import {
  generateFriendlyStringFromSubmissionFormats,
  getAssignmentSettingsHref
} from "./utils";
import PreviewUnavailable from "./PreviewUnavailable";

export default class AssociatedContentAssignment extends Component {
  async componentDidMount() {
    const parser = new DOMParser();
    const settingsXml = await this.props.getTextByPath(
      getAssignmentSettingsHref(this.props.identifier)
    );
    const settings = parser.parseFromString(settingsXml, "text/xml");
    const pointsPossibleNode = settings.querySelector("points_possible");
    const pointsPossible =
      pointsPossibleNode && parseFloat(pointsPossibleNode.textContent);

    const submissionNode = settings.querySelector("submission_types");
    const submissionFormats = submissionNode && submissionNode.textContent;

    const externalToolNode = settings.querySelector(
      "external_tool_external_identifier"
    );

    this.setState({
      pointsPossible,
      submissionFormats: generateFriendlyStringFromSubmissionFormats(
        submissionFormats
      ),
      externalToolNode
    });
  }

  render() {
    const doc = this.props.doc;
    if (this.state == null || doc.querySelector("body") == null) {
      // Not yet loaded
      return null;
    }
    const title = doc
      .querySelector("title")
      .textContent.replace(
        ASSOCIATED_CONTENT_ASSIGNMENT_TITLE_PREFIX_REGEX,
        ""
      );
    const descriptionHtml = doc.querySelector("body").innerHTML;

    return (
      <AssignmentBody
        title={title}
        descriptionHtml={descriptionHtml}
        pointsPossible={this.state.pointsPossible}
        submissionFormats={this.state.submissionFormats}
        getTextByPath={this.props.getTextByPath}
        getUrlForPath={this.props.getUrlForPath}
        resourceIdsByHrefMap={this.props.resourceIdsByHrefMap}
        contextTitle={this.props.contextTitle}
      />
    );
  }
}
