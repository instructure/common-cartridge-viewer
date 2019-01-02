import React, { Component } from "react";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import ScreenReaderContent from "@instructure/ui-a11y/lib/components/ScreenReaderContent";
import { WIKI_CONTENT_HREF_PREFIX } from "./constants";
import WikiContentListItem from "./WikiContentListItem";
import { Trans } from "@lingui/macro";
import Paginate from "./Paginate";

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
      .filter(
        ({ href }) =>
          typeof href === "string" && href.includes(WIKI_CONTENT_HREF_PREFIX)
      );

    const listItems = resources.map(
      ({ dependencyHrefs, href, identifier }, index) => {
        return (
          <WikiContentListItem
            dependencyHrefs={dependencyHrefs}
            getTextByPath={this.props.getTextByPath}
            href={`/${href}`}
            identifier={identifier}
            key={href}
            src={this.props.src}
          />
        );
      }
    );

    return (
      <div className="Cartridge-content-inner">
        <Heading level="h1">
          <ScreenReaderContent>
            <Trans>Wiki content</Trans>
          </ScreenReaderContent>
        </Heading>
        <ul className="Discussions ExpandCollapseList">
          <Paginate listItems={listItems} location={this.props.location} />
        </ul>
      </div>
    );
  }
}
