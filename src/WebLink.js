import React, { Component } from "react";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import Icon from "@instructure/ui-icons/lib/Line/IconExternalLink";
import { I18n } from "@lingui/react";
import { Trans, t } from "@lingui/macro";

export default class WebLink extends Component {
  render() {
    const doc = this.props.doc;
    if (doc.querySelector("url") == null) {
      // Not yet loaded
      return null;
    }
    const href = doc.querySelector("url").getAttribute("href");
    const labelColor = "#AD4AA0";

    return (
      <I18n>
        {({ i18n }) => (
          <div>
            <div className="resource-label" style={{ color: labelColor }}>
              <div
                className="resource-label-icon"
                style={{ backgroundColor: labelColor }}
              >
                <Icon color="primary-inverse" />
              </div>
              <span>
                <Trans>External link</Trans>
              </span>
            </div>

            <Heading level="h1" margin="0 0 small">
              {doc.querySelector("title")
                ? doc.querySelector("title").textContent
                : i18n._(t`Untitled`)}
            </Heading>

            <a href={href} target="_blank" rel="noopener noreferrer">
              <Trans>Click here to open link in new window</Trans>
            </a>
          </div>
        )}
      </I18n>
    );
  }
}
