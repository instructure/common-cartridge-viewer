import React, { Component } from "react";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import ScreenReaderContent from "@instructure/ui-a11y/lib/components/ScreenReaderContent";
import AssignmentListItem from "./AssignmentListItem";
import { getResourceHref } from "./utils";

export default class AssignmentList extends Component {
  render() {
    const resources = this.props.resources
      .filter(node => node.querySelector("file"))
      .map(node => ({
        identifier: node.getAttribute("identifier"),
        href: node.querySelector("file").getAttribute("href"),
        dependencyHrefs: Array.from(node.querySelectorAll("dependency")).map(
          node => {
            const identifier = node.getAttribute("identifierref");
            const resource = this.props.resourceMap.get(identifier);
            return getResourceHref(resource);
          }
        )
      }));

    const listItems =
      this.props.entryMap.size &&
      resources.map(({ href, dependencyHrefs, identifier }, index) => {
        return (
          <AssignmentListItem
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
          <ScreenReaderContent>Assignments</ScreenReaderContent>
        </Heading>
        <ul className="Assignments ExpandCollapseList">{listItems}</ul>
      </div>
    );
  }
}
