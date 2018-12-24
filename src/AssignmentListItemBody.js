import React, { PureComponent } from "react";
import { Link as RouterLink } from "react-router-dom";
import IconAssignment from "@instructure/ui-icons/lib/Line/IconAssignment";
import Link from "@instructure/ui-elements/lib/components/Link";
import { Trans } from "@lingui/macro";
import WorkflowStateIcon from "./WorkflowStateIcon";

export default class AssignmentListItemBody extends PureComponent {
  render() {
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
                pathname: `resources/${this.props.identifier}`,
                state: { from: this.props.from }
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
