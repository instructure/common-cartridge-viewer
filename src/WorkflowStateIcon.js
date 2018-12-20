import React, { PureComponent } from "react";
import IconUnpublished from "@instructure/ui-icons/lib/Line/IconUnpublished";
import IconPublish from "@instructure/ui-icons/lib/Solid/IconPublish";
import { Trans } from "@lingui/macro";
import ScreenReaderContent from "@instructure/ui-a11y/lib/components/ScreenReaderContent";
import PropTypes from "prop-types";

export default class WorkflowStateIcon extends PureComponent {
  static propTypes = {
    workflowState: PropTypes.oneOf(["unpublished", "published", "active"])
  };

  renderWorkflowStateIcon = () => {
    const workflowState = this.props.workflowState;

    if (workflowState === "unpublished") {
      return (
        <React.Fragment>
          <ScreenReaderContent>
            <Trans>Unpublished</Trans>
          </ScreenReaderContent>
          <IconUnpublished color="secondary" />
        </React.Fragment>
      );
    } else if (["published", "active"].includes(workflowState)) {
      return (
        <React.Fragment>
          <ScreenReaderContent>
            <Trans>Published</Trans>
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
