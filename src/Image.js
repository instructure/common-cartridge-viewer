import { Spinner, Heading, IconImageLine as Icon } from "@instructure/ui";
import { basename } from "./utils";
import React, { Component } from "react";
import I18n from "./I18n";
import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";

export default class Image extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      dataUrl: null,
      filename: null
    };
  }

  async componentDidMount() {
    const relativePath = this.props.href;
    const imageUrl = await this.props.getUrlForPath(relativePath);
    const filename = basename(relativePath);

    this.setState({
      isLoading: false,
      imageUrl,
      filename
    });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <I18n>
          {({ i18n }) => (
            <Spinner renderTitle={t`Loading`} size="small" margin="medium" />
          )}
        </I18n>
      );
    }

    return (
      <div className="RichContent">
        <div className="resource-label font-color type-image">
          <div className="resource-label-icon background-color type-image">
            <Icon color="primary-inverse" />
          </div>
          <span>
            <Trans>Image</Trans>
          </span>
        </div>

        <Heading level="h1">{this.state.filename}</Heading>
        <p>
          <img alt={this.state.filename} src={this.state.imageUrl} />
        </p>
      </div>
    );
  }
}
