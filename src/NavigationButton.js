import React, { PureComponent } from "react";
import Tooltip from "@instructure/ui-overlays/lib/components/Tooltip";
import Button from "@instructure/ui-buttons/lib/components/Button";
import { Link as RouterLink } from "react-router-dom";
import { resourceTypes } from "./constants";

export default class NavigationButton extends PureComponent {
  makeNavigationButtonHrefFromModule = module =>
    module.type === resourceTypes.EXTERNAL_TOOL
      ? `/external/tool/${module.identifierref || module.identifier}`
      : `/resources/${module.identifierref || module.identifier}`;

  render() {
    return (
      <div className="navigation-link">
        <Tooltip
          variant="inverse"
          tip={this.props.toItem.title}
          placement="end"
        >
          <Button
            to={{
              pathname: this.makeNavigationButtonHrefFromModule(
                this.props.toItem
              ),
              state: this.props.location.state
            }}
            variant="ghost"
            as={RouterLink}
            innerRef={this.setToItemButton}
            onClick={this.handleToItemButtonPressed}
          >
            {this.props.navButtonText}
          </Button>
        </Tooltip>
      </div>
    );
  }
}
