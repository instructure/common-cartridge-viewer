import React, { Component } from "react";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import Icon from "@instructure/ui-icons/lib/Line/IconDocument";
import RichContent from "./RichContent";
import { Trans } from "@lingui/macro";
import { getOptionalTextContent } from "./utils";

export default class WikiContent extends Component {
  render() {
    const doc = this.props.doc;
    const title = getOptionalTextContent(doc, "title");
    const html = doc.body ? doc.body.innerHTML : ""; // doc.body.innerHTML;

    return (
      <React.Fragment>
        <div className="resource-label font-color type-page">
          <div className="resource-label-icon background-color type-page">
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
        />
      </React.Fragment>
    );
  }
}
