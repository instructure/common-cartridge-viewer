import React, { Component, Fragment } from "react";
import IconExternalLink from "@instructure/ui-icons/lib/Line/IconExternalLink";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import Link from "@instructure/ui-elements/lib/components/Link";

import { resourceTypes, WIKI_CONTENT_HREF_PREFIX } from "./constants";
import NavLink from "./NavLink";
import AssignmentListItem from "./AssignmentListItem";
import AssessmentListItem from "./AssessmentListItem";
import DiscussionListItem from "./DiscussionListItem";
import WikiContentListItem from "./WikiContentListItem";
import FileListItem from "./FileListItem";
import WebLinkListItem from "./WebLinkListItem";
import { Trans } from "@lingui/macro";

import { getAssignmentSettingsHref } from "./utils.js";
import AssociatedContentAssignmentListItem from "./AssociatedContentAssignmentListItem";
import ExternalToolListItem from "./ExternalToolListItem";
import ExternalTool from "./ExternalTool";

export default class ModulesList extends Component {
  render() {
    const moduleComponents = this.props.modules.map(
      ({ title, ref, items, identifier }, index) => {
        const itemComponents = items.map((item, index) => {
          const isSubheading = item.href == null;

          if (isSubheading) {
            return (
              <li key={index} className="ExpandCollapseList-item">
                <div className="ExpandCollapseList-item-inner">
                  {this.renderHeading(item)}
                </div>
              </li>
            );
          }

          const isWikiContent =
            item.type === resourceTypes.WEB_CONTENT &&
            typeof item.href === "string" &&
            item.href.includes(WIKI_CONTENT_HREF_PREFIX);

          if (isWikiContent) {
            return (
              <WikiContentListItem
                dependencyHrefs={item.dependencyHrefs}
                getTextByPath={this.props.getTextByPath}
                href={`/${item.href}`}
                identifier={item.identifierref}
                item={item}
                key={index}
                src={this.props.src}
                isModuleItem={true}
              />
            );
          }

          if (item.type === resourceTypes.ASSIGNMENT) {
            return (
              <AssignmentListItem
                dependencyHrefs={item.dependencyHrefs}
                getTextByPath={this.props.getTextByPath}
                href={`/${item.href}`}
                identifier={item.identifierref}
                item={item}
                key={index}
                src={this.props.src}
                isModuleItem={true}
              />
            );
          }

          if (item.type === resourceTypes.ASSOCIATED_CONTENT) {
            const isAssociatedContentAssignment = this.props.associatedContentAssignmentHrefsSet.has(
              getAssignmentSettingsHref(item.identifierref)
            );
            if (isAssociatedContentAssignment) {
              return (
                <AssociatedContentAssignmentListItem
                  dependencyHrefs={item.dependencyHrefs}
                  getTextByPath={this.props.getTextByPath}
                  href={`/${item.href}`}
                  identifier={item.identifierref}
                  item={item}
                  key={index}
                  src={this.props.src}
                  isModuleItem={true}
                />
              );
            }
          }

          if (item.type === resourceTypes.ASSESSMENT_CONTENT) {
            return (
              <AssessmentListItem
                dependencyHrefs={item.dependencyHrefs}
                getTextByPath={this.props.getTextByPath}
                href={`/${item.href}`}
                identifier={item.identifierref}
                item={item}
                key={index}
                src={this.props.src}
                isModuleItem={true}
              />
            );
          }

          if (item.type === resourceTypes.DISCUSSION_TOPIC) {
            return (
              <DiscussionListItem
                dependencyHrefs={item.dependencyHrefs}
                getTextByPath={this.props.getTextByPath}
                href={`/${item.href}`}
                identifier={item.identifierref}
                item={item}
                key={index}
                src={this.props.src}
                isModuleItem={true}
              />
            );
          }

          if (item.type === resourceTypes.WEB_CONTENT) {
            return (
              <FileListItem
                getTextByPath={this.props.getTextByPath}
                href={`/${item.href}`}
                identifier={item.identifierref}
                key={index}
                metadata={item.metadata}
                src={this.props.src}
                title={item.title}
                isModuleItem={true}
              />
            );
          }

          if (item.type === resourceTypes.WEB_LINK) {
            return (
              <WebLinkListItem
                key={index}
                identifier={item.identifierref}
                item={item}
                isModuleItem={true}
              />
            );
          }

          if (
            item.type === resourceTypes.EXTERNAL_TOOL ||
            item.type === resourceTypes.BASIC_LTI
          ) {
            // debugger;
            return (
              <Fragment>
                <ExternalToolListItem
                  key={index}
                  item={item}
                  identifier={item.identifierref}
                  isModuleItem={true}
                />
              </Fragment>
            );
          }

          return (
            <li key={index} className="ExpandCollapseList-item">
              <div className="ExpandCollapseList-item-inner">
                <div>
                  {item.type === resourceTypes.WEB_LINK && (
                    <span className="resource-icon">
                      <IconExternalLink />
                    </span>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  {item.href && (
                    <Link as={NavLink} to={`resources/${item.identifier}`}>
                      <span>
                        {item.title || <Trans>Untitled</Trans>}{" "}
                        <Trans>(unidentified)</Trans>
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </li>
          );
        });

        return (
          <li className="Module" key={index}>
            <Heading level="h2" id={`modules/${identifier}`}>
              <div style={{ padding: "12px 0 6px 0" }}>{title}</div>
            </Heading>

            <ul className="ModuleItems ExpandCollapseList">{itemComponents}</ul>
          </li>
        );
      }
    );

    return <ul className="ModuleList">{moduleComponents}</ul>;
  }

  renderHeading(item) {
    if (item.identifierref !== undefined) {
      return (
        <Link
          as={NavLink}
          to={{
            pathname: item.isModuleItem
              ? `module-items/${item.identifierref}`
              : `resources/${item.identifierref}`
          }}
        >
          <h3>{item.title}</h3>
        </Link>
      );
    } else {
      return <h3>{item.title}</h3>;
    }
  }
}
