import React, { Component } from "react";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import ScreenReaderContent from "@instructure/ui-a11y/lib/components/ScreenReaderContent";
import FileListItem from "./FileListItem";

export default class FileList extends Component {
  render() {
    const fileResources = this.props.resources
      .filter(node => node.querySelector("file"))
      .map(node => ({
        href: node.querySelector("file").getAttribute("href"),
        identifier: node.getAttribute("identifier"),
        metadata: node.querySelector("metadata")
      }))
      .filter(({ href }) => {
        return href.startsWith("wiki_content/") === false;
      });

    const listItems = fileResources.map(
      ({ dependencyHrefs, href, identifier }, index) => {
        return (
          <FileListItem
            dependencyHrefs={dependencyHrefs}
            href={`/${href}`}
            identifier={identifier}
            key={index}
            src={this.props.src}
          />
        );
      }
    );

    return (
      <div className="Cartridge-content-inner">
        <Heading level="h1">
          <ScreenReaderContent>Files</ScreenReaderContent>
        </Heading>
        <ul className="Files ExpandCollapseList">{listItems}</ul>
      </div>
    );
  }
}
