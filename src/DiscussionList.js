import React, { Component } from "react";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import ScreenReaderContent from "@instructure/ui-a11y/lib/components/ScreenReaderContent";
import { getResourceHref } from "./utils";
import DiscussionListItem from "./DiscussionListItem";

export default class DiscussionList extends Component {
  render() {
    const resources = this.props.resources.map(node => ({
      dependencyHrefs: Array.from(node.querySelectorAll("dependency")).map(
        node => {
          const identifier = node.getAttribute("identifierref");
          const resource = this.props.resourceMap.get(identifier);
          return getResourceHref(resource);
        }
      ),
      href: node.querySelector("file").getAttribute("href"),
      identifier: node.getAttribute("identifier")
    }));

    const listItems =
      this.props.entryMap.size &&
      resources.map(({ dependencyHrefs, href, identifier }, index) => {
        return (
          <DiscussionListItem
            key={index}
            src={this.props.src}
            href={`/${href}`}
            identifier={identifier}
            dependencyHrefs={dependencyHrefs}
            entryMap={this.props.entryMap}
          />
        );
      });

    return (
      <div className="Cartridge-content-inner">
        <Heading level="h1">
          <ScreenReaderContent>Discussions</ScreenReaderContent>
        </Heading>
        <ul className="Discussions ExpandCollapseList">{listItems}</ul>
      </div>
    );
  }
}
