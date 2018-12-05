import React, { PureComponent } from "react";
import { Link as RouterLink } from "react-router-dom";
import IconAssignment from "@instructure/ui-icons/lib/Line/IconAssignment";
import IconUnpublished from "@instructure/ui-icons/lib/Line/IconUnpublished";
import IconPublish from "@instructure/ui-icons/lib/Solid/IconPublish";
import Link from "@instructure/ui-elements/lib/components/Link";

export default class AssignmentListItemBody extends PureComponent {
  render() {
    return (
      <li className="ExpandCollapseList-item">
        <div className="ExpandCollapseList-item-inner">
          <span className="resource-icon">
            <IconAssignment color={this.props.iconColor} />
          </span>
          <div style={{ flex: 1 }}>
            <Link as={RouterLink} to={`resources/${this.props.identifier}`}>
              {this.props.title}
            </Link>
          </div>

          {this.props.points != null && (
            <div className="ExpandCollapseList-item-pts">
              {this.props.points} points
            </div>
          )}

          {this.props.workflowState != null && (
            <div className="ExpandCollapseList-item-workflow-state">
              {this.props.workflowState === "unpublished" && (
                <IconUnpublished color={this.props.iconColor} />
              )}
              {["published", "active"].includes(this.props.workflowState) && (
                <IconPublish color={this.props.iconColor} />
              )}
            </div>
          )}
        </div>
      </li>
    );
  }
}
