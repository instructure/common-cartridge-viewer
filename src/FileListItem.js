import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import IconPaperclip from "@instructure/ui-icons/lib/Line/IconPaperclip";
import WorkflowStateIcon from "./WorkflowStateIcon";
import Link from "@instructure/ui-elements/lib/components/Link";
import { Trans } from "@lingui/macro";

export default class FileListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      title: null,
      workflowState: null
    };
  }

  async componentDidMount() {
    const title = this.props.href.substr(1);

    const intendedEndUserRoles = new Set(
      Array.from(
        this.props.metadata
          ? this.props.metadata.querySelectorAll(
              "lom > educational > intendedEndUserRole"
            )
          : []
      ).map(node => {
        return node.querySelector("value").textContent;
      })
    );

    this.setState({
      isLoading: false,
      title,
      intendedEndUserRoles
    });
  }

  render() {
    if (this.state.isLoading) {
      return null;
    }

    const title = this.state.title.replace(/^(web_resources\/)/, "");

    const isPublished =
      this.state.intendedEndUserRoles.size === 0 ||
      this.state.intendedEndUserRoles.has("Learner");

    const iconColor = isPublished ? "success" : "secondary";

    return (
      <li className="ExpandCollapseList-item">
        <div className="ExpandCollapseList-item-inner">
          <span className="resource-icon">
            <IconPaperclip color={iconColor} />
          </span>
          <div style={{ flex: 1 }}>
            <Link
              as={RouterLink}
              to={{
                pathname: this.props.isModuleItem
                  ? `module-items/${this.props.identifier}`
                  : `resources/${this.props.identifier}`
              }}
            >
              {this.props.title || title}
            </Link>
          </div>

          {this.state.points != null && (
            <div className="ExpandCollapseList-item-pts">
              <Trans>{this.state.points} points</Trans>
            </div>
          )}

          <WorkflowStateIcon
            workflowState={isPublished ? "published" : "unpublished"}
            resourceTitle={title}
          />
        </div>
      </li>
    );
  }
}
