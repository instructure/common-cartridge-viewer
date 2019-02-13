import React, { Component } from "react";
import { getAssignmentSettingsHref } from "./utils.js";
import { ASSOCIATED_CONTENT_ASSIGNMENT_TITLE_PREFIX_REGEX } from "./constants";
import AssignmentListItemBody from "./AssignmentListItemBody";

export default class AssociatedContentAssignmentListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      title: null,
      workflowState: null
    };
  }

  async componentDidMount() {
    const parser = new DOMParser();
    const path = this.props.href.substr(1);
    const assignmentXml = await this.props.getTextByPath(path);
    if (assignmentXml === null) {
      this.setState({
        isLoading: false,
        title: "Error: Resource Not Found",
        pointsPossible: "N/A",
        workflowState: "unpublished",
        resourceNotFound: true
      });
      return;
    }
    const doc = parser.parseFromString(assignmentXml, "text/xml");
    const title =
      doc.querySelector("title") &&
      doc
        .querySelector("title")
        .textContent.replace(
          ASSOCIATED_CONTENT_ASSIGNMENT_TITLE_PREFIX_REGEX,
          ""
        );

    const settingsXml = this.props.getTextByPath(
      getAssignmentSettingsHref(this.props.identifier)
    );
    const settings = parser.parseFromString(settingsXml, "text/xml");
    const pointsPossibleNode = settings.querySelector("points_possible");
    const pointsPossible =
      pointsPossibleNode && parseFloat(pointsPossibleNode.textContent);
    const workflowStateNode = settings.querySelector("workflow_state");
    const workflowState = workflowStateNode && workflowStateNode.textContent;

    this.setState({
      isLoading: false,
      title,
      pointsPossible,
      workflowState
    });
  }

  render() {
    if (this.state.isLoading) {
      return null;
    }

    const iconColor = ["published", "active"].includes(this.state.workflowState)
      ? "success"
      : "secondary";

    return (
      <AssignmentListItemBody
        iconColor={iconColor}
        identifier={this.props.identifier}
        title={this.state.title}
        description={this.state.workflowState}
        points={this.state.pointsPossible}
        workflowState={this.state.workflowState}
        resourceNotFound={this.state.resourceNotFound}
        isModuleItem={this.props.isModuleItem}
      />
    );
  }
}
