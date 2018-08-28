import React, { Component } from "react";

export default class CommonCartridge extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const moduleComponents = this.props.modules.map(
      ({ title, ref, items }, index) => {
        const itemComponents = items.map((item, index) => (
          <li key={index}>{item.title}</li>
        ));

        return (
          <li key={index}>
            <h3>{title}</h3>
            <ul>{itemComponents}</ul>
          </li>
        );
      }
    );

    return <div>{moduleComponents}</div>;
  }
}
