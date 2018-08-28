import { basename } from "path";
import React, { Component } from "react";
import Spinner from "@instructure/ui-elements/lib/components/Spinner";
import { getBlobFromEntry, blobToDataUrl } from "./utils";
import Heading from "@instructure/ui-elements/lib/components/Heading";

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
    const entryKey = this.props.href.substr(1);

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

    return (
      <div className="RichContent">
        <Heading level="h1">{this.state.filename}</Heading>
        <p>
          <img alt="{this.state.filename}" src={this.state.dataUrl} />
        </p>
      </div>
    );
  }
}
