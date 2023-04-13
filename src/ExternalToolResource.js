import React, { Component } from "react";
import ExternalTool from "./ExternalTool";
export default class ExternalToolResource extends Component {
  constructor(props) {
    super(props);
    this.resource = props.resource;
  }

  launchUrl() {
    return this.resource
      .getElementsByTagName("lticc:cartridge_basiclti_link")[0]
      .getElementsByTagName("lticc:launch_url")[0].textContent;
  }

  render() {
    const launchUrl = this.launchUrl();
    return <ExternalTool launchUrl={launchUrl} />;
  }
}
