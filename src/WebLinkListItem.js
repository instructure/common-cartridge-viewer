import React, { Component } from "react";
import Link from "@instructure/ui-elements/lib/components/Link";
import IconExternalLink from "@instructure/ui-icons/lib/Line/IconExternalLink";
import NavLink from "./NavLink";
import { resourceTypes } from "./constants";
import { Trans } from "@lingui/macro";

export default class WebLinkListItem extends Component {
  render() {
    return (
      <li className="ExpandCollapseList-item">
        <div className="ExpandCollapseList-item-inner">
          <div>
            {this.props.item.type === resourceTypes.WEB_LINK && (
              <span className="resource-icon">
                <IconExternalLink />
              </span>
            )}
          </div>

          <div style={{ flex: 1 }}>
            {this.props.item.href && (
              <Link
                as={NavLink}
                to={{
                  pathname: `resources/${this.props.identifier}`,
                  state: { from: this.props.from }
                }}
              >
                <span>{this.props.item.title || <Trans>Untitled</Trans>}</span>
              </Link>
            )}
          </div>
        </div>
      </li>
    );
  }
}
