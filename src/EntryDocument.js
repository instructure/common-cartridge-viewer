import React, { Component } from "react";
import { getTextFromEntry } from "./utils.js";

const parser = new DOMParser();
const documents = new Map();
const initialState = {
  doc: null,
  isLoading: true,
  text: null
};

export default class EntryDocument extends Component {
  constructor(props) {
    super(props);

    this.state = initialState;
  }

  componentDidMount() {
    this.update();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.href !== this.props.href) {
      this.setState(initialState, this.update);
    }
  }

  async update() {
    const src = this.props.src;
    const path = this.props.href.substr(1);
    const id = `${src}/${path}`;

    if (documents.has(id)) {
      this.setState({ isLoading: false, doc: documents.get(id) });
      return;
    }

    const entry = this.props.entryMap.get(path);
    const xml = await getTextFromEntry(entry);
    const doc = parser.parseFromString(xml, this.props.type);

    documents.set(id, doc);
    this.setState({ isLoading: false, doc });
  }

  render() {
    if (this.state.isLoading) {
      return <span />;
    }

    return this.props.render(this.state.doc);
  }
}
