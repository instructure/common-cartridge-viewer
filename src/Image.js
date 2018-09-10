import { basename } from "path";
import React, { Component } from "react";
import Spinner from "@instructure/ui-elements/lib/components/Spinner";
import { getBlobFromEntry, blobToDataUrl } from "./utils";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import Icon from "@instructure/ui-icons/lib/Line/IconImage";

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
    const entryKey = this.props.href;
    const entry = this.props.entryMap.get(entryKey);
    const filename = basename(entry.filename);
    const blob = await getBlobFromEntry(entry);
    const dataUrl = await blobToDataUrl(blob);

    this.setState({
      isLoading: false,
      dataUrl,
      filename
    });
  }

  render() {
    if (this.state.isLoading) {
      return <Spinner title="Loading" size="small" margin="medium" />;
    }

    const labelColor = "#AD4AA0";

    return (
      <div className="RichContent">
        <div className="resource-label" style={{ color: labelColor }}>
          <div
            className="resource-label-icon"
            style={{ backgroundColor: labelColor }}
          >
            <Icon color="primary-inverse" />
          </div>
          <span>Image</span>
        </div>

        <Heading level="h1">{this.state.filename}</Heading>
        <p>
          <img alt="{this.state.filename}" src={this.state.dataUrl} />
        </p>
      </div>
    );
  }
}
