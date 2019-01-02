import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import IconDocument from "@instructure/ui-icons/lib/Line/IconDocument";
import WorkflowStateIcon from "./WorkflowStateIcon";
import Link from "@instructure/ui-elements/lib/components/Link";
import { basename } from "path";

export default class WikiContentListItem extends Component {
  constructor(props) {
    super(props);
    this.mounted = true;
    this.state = {
      isLoading: true,
      title: null,
      workflowState: null
    };
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  async componentDidMount() {
    const path = this.props.href.substr(1);
    const xml = await this.props.getTextByPath(path);
    if (xml === null) {
      this.setState({
        isLoading: false,
        title: "Error: Resource Not Found",
        workflowState: "unpublished",
        resourceNotFound: true
      });
      return;
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "text/html");
    const itemTitle = this.props.item != null && this.props.item.title;
    const title = itemTitle
      ? itemTitle
      : doc.querySelector("title") && doc.querySelector("title").textContent;
    const workflowStateNode = doc.querySelector('meta[name="workflow_state"]');
    const workflowState =
      workflowStateNode && workflowStateNode.getAttribute("content");

    if (this.mounted) {
      this.setState({
        isLoading: false,
        title,
        workflowState
      });
    }
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
      : `resources/${this.props.identifier}`;

    return (
      <li className="ExpandCollapseList-item">
        <div className="ExpandCollapseList-item-inner">
          <span className="resource-icon">
            <IconDocument color={iconColor} />
          </span>
          <div style={{ flex: 1 }}>
            <Link
              as={RouterLink}
              to={{
                pathname,
                state: { from: this.props.from }
              }}
            >
              {this.state.title || basename(this.props.href)}
            </Link>
          </div>
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
