import {
  ScreenReaderContent,
  IconUnpublishedLine as IconUnpublished,
  IconPublishSolid as IconPublish
} from "@instructure/ui";
import React, { PureComponent } from "react";
import { Trans } from "@lingui/react/macro";
import PropTypes from "prop-types";

export default class WorkflowStateIcon extends PureComponent {
  static propTypes = {
    workflowState: PropTypes.oneOf(["unpublished", "published", "active"]),
    resourceTitle: PropTypes.string
  };

  renderWorkflowStateIcon = () => {
    const workflowState = this.props.workflowState;

    if (workflowState === "unpublished") {
      return (
        <React.Fragment>
          <ScreenReaderContent>
            <Trans>{this.props.resourceTitle} is unpublished </Trans>
          </ScreenReaderContent>
          <IconUnpublished color="secondary" />
        </React.Fragment>
      );
    } else if (["published", "active"].includes(workflowState)) {
      return (
        <React.Fragment>
          <ScreenReaderContent>
            <Trans>{this.props.resourceTitle} is published </Trans>
          </ScreenReaderContent>
          <IconPublish color="success" />
        </React.Fragment>
      );
    }
    return <React.Fragment />;
  };

  render() {
    return (
      <div className="ExpandCollapseList-item-workflow-state">
        {this.renderWorkflowStateIcon()}
      </div>
    );
  }
}
