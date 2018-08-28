import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import IconAssignment from "@instructure/ui-icons/lib/Line/IconAssignment";
import IconUnpublished from "@instructure/ui-icons/lib/Line/IconUnpublished";
import IconPublish from "@instructure/ui-icons/lib/Solid/IconPublish";
import Link from "@instructure/ui-elements/lib/components/Link";
import { getTextFromEntry } from "./utils.js";

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
    const parser = new DOMParser();

    const path = this.props.href.substr(1);

    const entry = this.props.entryMap.get(path);

    const xml = await getTextFromEntry(entry);

    const doc = parser.parseFromString(xml, "text/xml");

    const title =
      doc.querySelector("title") && doc.querySelector("title").textContent;

    const description = doc.querySelector("text").textContent;

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
      description,
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
      <li className="ExpandCollapseList-item">
        <div className="ExpandCollapseList-item-inner">
          <span className="resource-icon">
            <IconAssignment color={iconColor} />
          </span>
          <div style={{ flex: 1 }}>
            <Link as={RouterLink} to={`${this.props.href}`}>
              {this.state.title}
            </Link>
          </div>

          {this.state.points != null && (
            <div className="ExpandCollapseList-item-pts">
              {this.state.points} points
            </div>
          )}

          {this.state.workflowState != null && (
            <div className="ExpandCollapseList-item-workflow-state">
              {this.state.workflowState === "unpublished" && (
                <IconUnpublished color={iconColor} />
              )}
              {["published", "active"].includes(this.state.workflowState) && (
                <IconPublish color={iconColor} />
              )}
            </div>
          )}
        </div>
      </li>
    );
  }
}
