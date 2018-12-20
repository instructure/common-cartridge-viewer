import React, { Component } from "react";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import Icon from "@instructure/ui-icons/lib/Line/IconDocument";
import RichContent from "./RichContent";
import { Trans } from "@lingui/macro";

export default class WikiContent extends Component {
  render() {
    const doc = this.props.doc;
    const title =
      doc.querySelector("title") && doc.querySelector("title").textContent;
    const html = doc.body ? doc.body.innerHTML : ""; // doc.body.innerHTML;
    const labelColor = "#8A6240";

    return (
      <React.Fragment>
        <div className="resource-label" style={{ color: labelColor }}>
          <div
            className="resource-label-icon"
            style={{ backgroundColor: labelColor }}
          >
            <Icon color="primary-inverse" />
          </div>
          <span>
            <Trans>Page</Trans>
          </span>
        </div>

        {title != null && (
          <Heading level="h1" margin="0 0 small">
            {title}
          </Heading>
        )}

        <RichContent
          getUrlForPath={this.props.getUrlForPath}
          html={html}
          resourceIdsByHrefMap={this.props.resourceIdsByHrefMap}
          courseNavAvailabilityByType={this.props.courseNavAvailabilityByType}
        />
      </React.Fragment>
    );
  }
}
