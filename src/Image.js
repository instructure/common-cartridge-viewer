import { basename } from "path";
import React, { Component } from "react";
import Spinner from "@instructure/ui-elements/lib/components/Spinner";
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
          <img alt={this.state.filename} src={this.state.imageUrl} />
        </p>
      </div>
    );
  }
}
