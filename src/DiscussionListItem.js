import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import IconDiscussion from "@instructure/ui-icons/lib/Line/IconDiscussion";
import IconUnpublished from "@instructure/ui-icons/lib/Line/IconUnpublished";
import IconPublish from "@instructure/ui-icons/lib/Solid/IconPublish";
import Link from "@instructure/ui-elements/lib/components/Link";
import { Trans } from "@lingui/macro";

export default class DiscussionListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      title: null,
      workflowState: null
    };
  }

  async componentDidMount() {
    const path = this.props.href.substr(1);
    const xml = await this.props.getTextByPath(path);
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "text/xml");
    const title = doc.querySelector("title").textContent;
    const depPath = this.props.dependencyHrefs[0];
    const depXml = await this.props.getTextByPath(depPath);
    const depDoc = parser.parseFromString(depXml, "text/xml");
    const workflowStateNode = depDoc.querySelector(
      "topicMeta > workflow_state"
    );
    const workflowState = workflowStateNode && workflowStateNode.textContent;
    const pointsPossibleNode =
      depDoc &&
      depDoc.querySelector("topicMeta > assignment > points_possible");
    const points =
      pointsPossibleNode && parseFloat(pointsPossibleNode.textContent);

    this.setState({
      isLoading: false,
      title,
      points,
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
            <IconDiscussion color={iconColor} />
          </span>

          <div style={{ flex: 1 }}>
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

          {this.state.points != null && (
            <div className="ExpandCollapseList-item-pts">
              <Trans>{this.state.points} points</Trans>
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
