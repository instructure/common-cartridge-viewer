import React, { Component } from "react";
import AssignmentListItemBody from "./AssignmentListItemBody";

export default class AssignmentListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      title: null,
      workflowState: null
    };
  }

  async componentDidMount() {
    const path = this.props.href.substr(1);
    const xml = await this.props.getTextByPath(path);
    if (xml === null) {
      this.setState({
        isLoading: false,
        title: "Error: Resource Not Found",
        points: "N/A",
        workflowState: "unpublished",
        resourceNotFound: true
      });
      return;
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "text/xml");
    const title =
      doc.querySelector("title") && doc.querySelector("title").textContent;
    const gradableNode = doc.querySelector("gradable");
    const points =
      gradableNode &&
      gradableNode.textContent === "true" &&
      gradableNode.getAttribute("points_possible")
        ? parseFloat(gradableNode.getAttribute("points_possible"))
        : 0;
    const workflowStateNode = doc.querySelector(
      "extensions > assignment > workflow_state"
    );
    const workflowState = workflowStateNode && workflowStateNode.textContent;

    this.setState({
      isLoading: false,
      title,
      points,
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
        points={this.state.points}
        workflowState={this.state.workflowState}
        from={this.props.from}
        resourceNotFound={this.state.resourceNotFound}
      />
    );
  }
}
