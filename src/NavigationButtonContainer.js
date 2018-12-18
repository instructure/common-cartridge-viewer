import React, { PureComponent } from "react";
import Flex, { FlexItem } from "@instructure/ui-layout/lib/components/Flex";
import NavigationButton from "./NavigationButton";
import { I18n } from "@lingui/react";
import { t } from "@lingui/macro";

export default class NavigationButtonContainer extends PureComponent {
  render() {
    return (
      <Flex margin="0 0 medium">
        <FlexItem padding="small" width="14rem">
          {this.props.buttonNavigationEnabled && this.props.previousItem && (
            <I18n>
              {({ i18n }) => (
                <NavigationButton
                  toItem={this.props.previousItem}
                  location={this.props.location}
                  navButtonText={i18n._(t`Previous`)}
                />
              )}
            </I18n>
          )}
        </FlexItem>
        <FlexItem padding="small" width="14rem" grow={true}>
          <Flex justifyItems="end">
            <FlexItem>
              {this.props.buttonNavigationEnabled && this.props.nextItem && (
                <I18n>
                  {({ i18n }) => (
                    <NavigationButton
                      toItem={this.props.nextItem}
                      location={this.props.location}
                      navButtonText={i18n._(t`Next`)}
                    />
                  )}
                </I18n>
              )}
            </FlexItem>
          </Flex>
        </FlexItem>
      </Flex>
    );
  }
}
