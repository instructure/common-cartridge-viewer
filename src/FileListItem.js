import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import IconPaperclip from "@instructure/ui-icons/lib/Line/IconPaperclip";
import IconUnpublished from "@instructure/ui-icons/lib/Line/IconUnpublished";
import IconPublish from "@instructure/ui-icons/lib/Solid/IconPublish";
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
            <Link as={RouterLink} to={`resources/${this.props.identifier}`}>
              {this.props.title ||
                this.state.title.replace(/^(web_resources\/)/, "")}
            </Link>
          </div>

          {this.state.points != null && (
            <div className="ExpandCollapseList-item-pts">
              <Trans>{this.state.points} points</Trans>
            </div>
          )}

          <div className="ExpandCollapseList-item-workflow-state">
            {isPublished === false && <IconUnpublished color={iconColor} />}
            {isPublished && <IconPublish color={iconColor} />}
          </div>
        </div>
      </li>
    );
  }
}
