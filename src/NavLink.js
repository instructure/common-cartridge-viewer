import React, { PureComponent } from "react";
import { NavLink as ReactRouterNavLink } from "react-router-dom";

export default class NavLink extends PureComponent {
  render() {
    return <ReactRouterNavLink {...this.props} />;
  }
}
