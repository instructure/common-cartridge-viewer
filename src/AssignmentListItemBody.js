import { Link, IconAssignmentLine as IconAssignment } from "@instructure/ui";
import React, { PureComponent } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Trans } from "@lingui/react/macro";
import WorkflowStateIcon from "./WorkflowStateIcon";

export default class AssignmentListItemBody extends PureComponent {
  render() {
    const pathname = this.props.resourceNotFound
      ? `resources/unavailable`
      : this.props.isModuleItem
        ? `module-items/${this.props.identifier}`
        : `resources/${this.props.identifier}`;
    return (
      <li className="ExpandCollapseList-item">
        <div className="ExpandCollapseList-item-inner">
          <span className="resource-icon">
            <IconAssignment color={this.props.iconColor} />
          </span>
          <div style={{ flex: 1 }}>
            <Link
              as={RouterLink}
              to={{
                pathname,
              }}
            >
              {this.props.title}
            </Link>
          </div>

          {this.props.points != null && (
            <div className="ExpandCollapseList-item-pts">
              <Trans>{this.props.points} points</Trans>
            </div>
          )}

          {this.props.workflowState != null && (
            <WorkflowStateIcon
              workflowState={this.props.workflowState}
              resourceTitle={this.props.title}
            />
          )}
        </div>
      </li>
    );
  }
}
