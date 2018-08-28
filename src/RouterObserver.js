import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class RouterObserver extends Component {
  constructor(props) {
    super(props);

    this.url = "/";
  }

  updateUrl = url => {
    if (this.url !== url) {
      this.url = url;

      if (this.props.onHistoryChange) {
        this.props.onHistoryChange(this.props.history);
      }
    }
  };

  componentWillUpdate(nextProps) {
    this.updateUrl(nextProps.location.pathname);
  }

  render() {
    return null;
  }
}

export default withRouter(props => <RouterObserver {...props} />);
