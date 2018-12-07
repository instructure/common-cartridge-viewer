import React, { Component } from "react";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import ScreenReaderContent from "@instructure/ui-a11y/lib/components/ScreenReaderContent";
import AssociatedContentAssignmentListItem from "./AssociatedContentAssignmentListItem";
import { getAssignmentListResources } from "./utils";
import { Trans } from "@lingui/macro";

export default class AssociatedContentAssignmentList extends Component {
  render() {
    if (this.props.resources.length === 0) {
      return null;
    }
    const resources = getAssignmentListResources(this.props.resources);

    const listItems = resources.map(
      ({ href, dependencyHrefs, identifier }, index) => {
        return (
          <AssociatedContentAssignmentListItem
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
            <Trans>Assignments</Trans>
          </ScreenReaderContent>
        </Heading>
        <ul className="Assignments ExpandCollapseList">{listItems}</ul>
      </div>
    );
  }
}
