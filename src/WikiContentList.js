import React, { Component } from "react";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import ScreenReaderContent from "@instructure/ui-a11y/lib/components/ScreenReaderContent";
import { getExtension } from "./utils"; // getResourceHref
import WikiContentListItem from "./WikiContentListItem";

export default class WikiContentList extends Component {
  render() {
    const resources = this.props.resources
      .filter(node => {
        const isFallback = node
          .getAttribute("identifier")
          .endsWith("_fallback");

        if (isFallback) {
          const identifier = node
            .getAttribute("identifier")
            .split("_fallback")[0];

          const resource = this.props.resourceMap.get(identifier);

          if (resource != null) {
            return false;
          }
        }

        return true;
      })
      .filter(node => node.querySelector("file"))
      .map(node => ({
        identifier: node.getAttribute("identifier"),
        href: node.querySelector("file").getAttribute("href")
      }))
      // needs filter to filter out dependencies
      .filter(({ href }) => {
        const extension = getExtension(href);

        return ["html", "htm"].includes(extension);
      });

    const listItems =
      this.props.entryMap.size &&
      resources.map(({ dependencyHrefs, href, identifier }, index) => {
        return (
          <WikiContentListItem
            entryMap={this.props.entryMap}
            key={href}
            dependencyHrefs={dependencyHrefs}
            href={`/${href}`}
            identifier={identifier}
            src={this.props.src}
          />
        );
      });

    return (
      <div className="Cartridge-content-inner">
        <Heading level="h1">
          <ScreenReaderContent>Wiki content</ScreenReaderContent>
        </Heading>
        <ul className="Discussions ExpandCollapseList">{listItems}</ul>
      </div>
    );
  }
}
