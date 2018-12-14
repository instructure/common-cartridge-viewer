import React, { Component } from "react";
import Spinner from "@instructure/ui-elements/lib/components/Spinner";
import { I18n } from "@lingui/react";
import { t } from "@lingui/macro";

export default class DocumentPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      embeddedViewerSrc: null,
      isLoading: true
    };
  }
  componentDidMount() {
    window.addEventListener("message", this.handleMessage);
    if (this.props.externalViewer != null) {
      window.parent.postMessage(
        JSON.stringify({
          type: "externalViewerRequest",
          body: this.props.externalViewer
        }),
        "*"
      );
    }
  }
  componentWillUnmount() {
    window.removeEventListener("message", this.handleMessage);
  }

  handleMessage = event => {
    console.debug(event);
    if (event.data == null || event.data[0] !== "{") {
      return;
    }
    let response;
    try {
      response = JSON.parse(event.data);
    } catch (error) {
      console.warn("Error parsing data from postMessage");
      return;
    }
    if (response.type !== "externalViewerResponse") {
      return;
    }
    if (response.body.url) {
      this.setState({ embeddedViewerSrc: response.body.url, isLoading: false });
    }
  };

  render() {
    return (
      <div className="DocumentPreview">
        {this.state.isLoading && (
          <div className="DocumentPreview--loading">
            <I18n>
              {({ i18n }) => (
                <Spinner
                  title={i18n._(t`Loading`)}
                  size="small"
                  margin="medium"
                />
              )}
            </I18n>
          </div>
        )}
        {this.state.embeddedViewerSrc != null && (
          <I18n>
            {({ i18n }) => (
              <iframe
                title={i18n._(t`Media viewer`)}
                src={this.state.embeddedViewerSrc}
              />
            )}
          </I18n>
        )}
      </div>
    );
  }
}
