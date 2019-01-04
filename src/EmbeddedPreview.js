import React, { Component } from "react";
import Spinner from "@instructure/ui-elements/lib/components/Spinner";
import { I18n } from "@lingui/react";
import { Trans, t } from "@lingui/macro";
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
    const extension = getExtension(this.state.embeddedViewerSrc);
    return (
      <div className="EmbeddedPreview">
        {this.state.isLoading && (
          <div className="EmbeddedPreview--loading">
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
        {this.state.embeddedViewerSrc && (
          <I18n>
            {({ i18n }) =>
              ["mp3"].includes(extension) ? (
                <audio controls title={i18n._(t`Media viewer`)}>
                  <source src={this.state.embeddedViewerSrc} type="audio/mp3" />
                  <Trans>
                    Your browser doesn't support HTML5 audio. Here is a{" "}
                    <a href={this.state.embeddedViewerSrc}>link to the audio</a>{" "}
                    instead.
                  </Trans>
                </audio>
              ) : ["mp4"].includes(extension) ? (
                <video controls title={i18n._(t`Media viewer`)}>
                  <source src={this.state.embeddedViewerSrc} type="video/mp4" />
                  <Trans>
                    Your browser doesn't support HTML5 video. Here is a{" "}
                    <a href={this.state.embeddedViewerSrc}>link to the audio</a>{" "}
                    instead.
                  </Trans>
                </video>
              ) : (
                <iframe
                  title={i18n._(t`Media viewer`)}
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
