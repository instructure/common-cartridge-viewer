import React, { Component } from "react";
import AssignmentBody from "./AssignmentBody";
import { ASSOCIATED_CONTENT_ASSIGNMENT_TITLE_PREFIX_REGEX } from "./constants";
import {
  generateFriendlyStringFromSubmissionFormats,
  getAssignmentSettingsHref
} from "./utils";

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

    this.setState({
      pointsPossible,
      submissionFormats: generateFriendlyStringFromSubmissionFormats(
        submissionFormats
      )
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

    const labelColor = "#AD4AA0";

    return (
      <AssignmentBody
        title={title}
        descriptionHtml={descriptionHtml}
        labelColor={labelColor}
        pointsPossible={this.state.pointsPossible}
        submissionFormats={this.state.submissionFormats}
        getTextByPath={this.props.getTextByPath}
        getUrlForPath={this.props.getUrlForPath}
      />
    );
  }
}
