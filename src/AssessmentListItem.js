import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import IconQuiz from "@instructure/ui-icons/lib/Line/IconQuiz";
import WorkflowStateIcon from "./WorkflowStateIcon";
import Link from "@instructure/ui-elements/lib/components/Link";
import { Trans } from "@lingui/macro";

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
    const xml = await this.props.getTextByPath(path);
    const doc = parser.parseFromString(xml, "text/xml");
    const depPath = this.props.dependencyHrefs[0];
    const depXml = await this.props.getTextByPath(depPath);
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
              <Link
                as={RouterLink}
                to={{
                  pathname: `resources/${this.props.identifier}`,
                  state: { from: this.props.from }
                }}
              >
                {this.state.title}
              </Link>
            </div>
            {this.state.questionCount > 0 && (
              <div className="ExpandCollapseList-item-details">
                <Trans>{this.state.questionCount} Questions</Trans>
              </div>
            )}
          </div>

          {this.state.points != null && (
            <div className="ExpandCollapseList-item-pts">
              <Trans>{this.state.points} points</Trans>
            </div>
          )}

          {this.state.workflowState != null && (
            <WorkflowStateIcon workflowState={this.state.workflowState} />
          )}
        </div>
      </li>
    );
  }
}
