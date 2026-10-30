import { Spinner } from "@instructure/ui";
import React, { Component } from "react";

import I18n from "./I18n";
import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";
import { getExtension } from "./utils";

export default class EmbeddedPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      embeddedViewerSrc: "",
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
    if (event.data == null || event.data[0] !== "{") {
      this.props.onFail();
      return;
    }
    let response;
    try {
      response = JSON.parse(event.data);
    } catch (error) {
      console.warn("Error parsing data from postMessage");
      this.props.onFail();
      return;
    }
    if (response.type !== "externalViewerResponse") {
      this.props.onFail();
      return;
    }
    if (response.body.url) {
      this.setState({ embeddedViewerSrc: response.body.url, isLoading: false });
    }
  };

  render() {
    const extension = getExtension(this.state.embeddedViewerSrc);
    return (
      <div className="EmbeddedPreview">
        {this.state.isLoading && (
          <div className="EmbeddedPreview--loading">
            <I18n>
              {({ i18n }) => (
                <Spinner
                  renderTitle={t`Loading`}
                  size="small"
                  margin="medium"
                />
              )}
            </I18n>
          </div>
        )}
        {this.state.embeddedViewerSrc && (
          <I18n>
            {({ i18n }) =>
              ["mp3"].includes(extension) ? (
                <audio
                  className="EmbeddedPreview--audio"
                  controls
                  title={t`Media viewer`}
                >
                  <source src={this.state.embeddedViewerSrc} type="audio/mp3" />
                  <Trans>
                    Your browser doesn't support HTML5 audio. Here is a{" "}
                    <a href={this.state.embeddedViewerSrc}>link to the audio</a>{" "}
                    instead.
                  </Trans>
                </audio>
              ) : ["mp4"].includes(extension) ? (
                <video
                  className="EmbeddedPreview--video"
                  controls
                  title={t`Media viewer`}
                >
                  <source src={this.state.embeddedViewerSrc} type="video/mp4" />
                  <Trans>
                    Your browser doesn't support HTML5 video. Here is a{" "}
                    <a href={this.state.embeddedViewerSrc}>link to the audio</a>{" "}
                    instead.
                  </Trans>
                </video>
              ) : (
                <iframe
                  title={t`Media viewer`}
                  src={this.state.embeddedViewerSrc}
                  allowfullscreen
                />
              )
            }
          </I18n>
        )}
      </div>
    );
  }
}
