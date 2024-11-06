import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import ClassicQuizIcon from "@instructure/ui-icons/lib/Line/IconQuiz";
import QuizzesNextIcon from "@instructure/ui-icons/lib/Solid/IconQuiz";
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
    if (xml === null) {
      this.setState({
        isLoading: false,
        title: "Error: Resource Not Found",
        points: "N/A",
        questionCount: 0,
        workflowState: "unpublished",
        resourceNotFound: true,
        isFromQuizzesNext: false
      });
      return;
    }
    const doc = parser.parseFromString(xml, "text/xml");
    const depPath = this.props.dependencyHrefs[0];
    const depXml = await this.props.getTextByPath(depPath);
    const depDoc = parser.parseFromString(depXml, "text/xml");
    const assessmentNode = doc.querySelector("assessment");
    const title = assessmentNode && assessmentNode.getAttribute("title");
    const isFromQuizzesNext = !!(
      assessmentNode && assessmentNode.getAttribute("external_assignment_id")
    );
    const pointsPossibleNode =
      depDoc && depDoc.querySelector("quiz > assignment > points_possible");
    const points =
      pointsPossibleNode && parseFloat(pointsPossibleNode.textContent);
    const questionCount = doc.querySelectorAll("assessment section > item")
      .length;
    let assignedQuestionCount = 0;
    const selectionNumbers = doc.querySelectorAll(
      "assessment section section selection_number"
    );
    if (selectionNumbers.length === 0) {
      assignedQuestionCount = questionCount;
    } else {
      assignedQuestionCount = Array.from(selectionNumbers).reduce(
        (prev, curr) => prev + Number(curr.textContent),
        0
      );
      if (isNaN(assignedQuestionCount)) {
        assignedQuestionCount = questionCount;
      }
    }
    const workflowStateNode =
      depDoc && depDoc.querySelector("quiz > assignment > workflow_state");
    const workflowState = workflowStateNode && workflowStateNode.textContent;

    this.setState({
      isLoading: false,
      title,
      points,
      questionCount,
      assignedQuestionCount,
      workflowState,
      isFromQuizzesNext
    });
  }

  render() {
    if (this.state.isLoading) {
      return null;
    }

    const iconColor = ["published", "active"].includes(this.state.workflowState)
      ? "success"
      : "secondary";

    const pathname = this.state.resourceNotFound
      ? `resources/unavailable`
      : this.props.isModuleItem
      ? `module-items/${this.props.identifier}`
      : `resources/${this.props.identifier}`;

    return (
      <li className="ExpandCollapseList-item">
        <div className="ExpandCollapseList-item-inner">
          <span className="resource-icon">
            {this.state.isFromQuizzesNext ? (
              <QuizzesNextIcon color={iconColor} />
            ) : (
              <ClassicQuizIcon color={iconColor} />
            )}
          </span>
          <div style={{ flex: 1 }}>
            <div>
              <Link
                as={RouterLink}
                to={{
                  pathname
                }}
              >
                {this.state.title}
              </Link>
            </div>
            {this.state.questionCount > 0 && (
              <div className="ExpandCollapseList-item-details">
                <Trans>
                  {this.state.questionCount} question(s) /{" "}
                  {this.state.assignedQuestionCount} assigned
                </Trans>
              </div>
            )}
          </div>

          {this.state.points != null && (
            <div className="ExpandCollapseList-item-pts">
              <Trans>{this.state.points} points</Trans>
            </div>
          )}

          {this.state.workflowState != null && (
            <WorkflowStateIcon
              workflowState={this.state.workflowState}
              resourceTitle={this.state.title}
            />
          )}
        </div>
      </li>
    );
  }
}
