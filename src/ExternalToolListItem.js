import React, { Component } from "react";
import Link from "@instructure/ui-elements/lib/components/Link";
import IconExternalLink from "@instructure/ui-icons/lib/Line/IconExternalLink";
import NavLink from "./NavLink";
import { Trans } from "@lingui/macro";

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
            <Link as={NavLink} to={`external/tool`}>
              <span>{this.props.item.title || <Trans>Untitled</Trans>}</span>
            </Link>
          </div>
        </div>
      </li>
    );
  }
}
