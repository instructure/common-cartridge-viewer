import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import IconQuiz from "@instructure/ui-icons/lib/Line/IconQuiz";
import IconUnpublished from "@instructure/ui-icons/lib/Line/IconUnpublished";
import IconPublish from "@instructure/ui-icons/lib/Solid/IconPublish";
import Link from "@instructure/ui-elements/lib/components/Link";
import { getTextFromEntry } from "./utils.js";

export default class AssessmentListItem extends Component {
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
    const depPath = this.props.dependencyHrefs[0];
    const depEntry = this.props.entryMap.get(depPath);
    const depXml = await getTextFromEntry(depEntry);
    const depDoc = parser.parseFromString(depXml, "text/xml");
    const title =
      doc.querySelector("assessment") &&
      doc.querySelector("assessment").getAttribute("title");
    const pointsPossibleNode =
      depDoc && depDoc.querySelector("quiz > assignment > points_possible");
    const points =
      pointsPossibleNode && parseFloat(pointsPossibleNode.textContent);
    const questionCount = doc.querySelectorAll("assessment > section > item")
      .length;
    const workflowStateNode =
      depDoc && depDoc.querySelector("quiz > assignment > workflow_state");
    const workflowState = workflowStateNode && workflowStateNode.textContent;

    this.setState({
      isLoading: false,
      title,
      points,
      questionCount,
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
            <IconQuiz color={iconColor} />
          </span>
          <div style={{ flex: 1 }}>
            <div>
              <Link as={RouterLink} to={`resources/${this.props.identifier}`}>
                {this.state.title}
              </Link>
            </div>
            {this.state.questionCount > 0 && (
              <div className="ExpandCollapseList-item-details">
                {this.state.questionCount} Questions
              </div>
            )}
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
