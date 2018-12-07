import React, { Component } from "react";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import ScreenReaderContent from "@instructure/ui-a11y/lib/components/ScreenReaderContent";
import { getResourceHref } from "./utils";
import DiscussionListItem from "./DiscussionListItem";
import { Trans } from "@lingui/macro";

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

    const listItems = resources.map(
      ({ dependencyHrefs, href, identifier }, index) => {
        return (
          <DiscussionListItem
            dependencyHrefs={dependencyHrefs}
            getTextByPath={this.props.getTextByPath}
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
          <ScreenReaderContent>
            <Trans>Discussions</Trans>
          </ScreenReaderContent>
        </Heading>
        <ul className="Discussions ExpandCollapseList">{listItems}</ul>
      </div>
    );
  }
}
