import React, { Component } from "react";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import ScreenReaderContent from "@instructure/ui-a11y/lib/components/ScreenReaderContent";
import AssessmentListItem from "./AssessmentListItem";
import { getResourceHref } from "./utils";

export default class AssessmentList extends Component {
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

    const listItems = resources.map(
      ({ href, identifier, dependencyHrefs }, index) => {
        return (
          <AssessmentListItem
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
          <ScreenReaderContent>Assessments</ScreenReaderContent>
        </Heading>
        <ul className="Assessments ExpandCollapseList">{listItems}</ul>
      </div>
    );
  }
}
