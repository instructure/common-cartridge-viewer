import { Link, IconExternalLinkLine as IconExternalLink } from "@instructure/ui";
import React, { Component } from "react";
import NavLink from "./NavLink";
import { Trans } from "@lingui/react/macro";

export default class ExternalToolListItem extends Component {
  render() {
    return (
      <li className="ExpandCollapseList-item">
        <div className="ExpandCollapseList-item-inner">
          <div>
            <span className="resource-icon">
              <IconExternalLink />
            </span>
          </div>

          <div style={{ flex: 1 }}>
            <Link
              as={NavLink}
              to={{
                pathname: this.props.isModuleItem
                  ? `/module-items/${this.props.identifier}`
                  : `/resources/${this.props.identifier}`,
              }}
            >
              <span>{this.props.item.title || <Trans>Untitled</Trans>}</span>
            </Link>
          </div>
        </div>
      </li>
    );
  }
}
