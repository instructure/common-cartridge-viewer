import React, { Component } from "react";
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

import { getAssignmentSettingsHref } from "./utils.js";
import AssociatedContentAssignmentListItem from "./AssociatedContentAssignmentListItem";

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
                  <h3>{item.title}</h3>
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
              />
            );
          }

          if (item.type === resourceTypes.ASSOCIATED_CONTENT) {
            const associatedContentAssignmentSettings = this.props.isValidPath(
              getAssignmentSettingsHref(item.identifierref)
            );
            if (associatedContentAssignmentSettings) {
              return (
                <AssociatedContentAssignmentListItem
                  dependencyHrefs={item.dependencyHrefs}
                  getTextByPath={this.props.getTextByPath}
                  href={`/${item.href}`}
                  identifier={item.identifierref}
                  item={item}
                  key={index}
                  src={this.props.src}
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
              />
            );
          }

          if (item.type === resourceTypes.WEB_LINK) {
            return (
              <WebLinkListItem
                key={index}
                identifier={item.identifierref}
                item={item}
              />
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
                      <span>{item.title || "Untitled"} (unidentified)</span>
                    </Link>
                  )}
                </div>
              </div>
            </li>
          );
        });

        return (
          <li className="Module" key={index}>
            <Heading level="h3" id={`modules/${identifier}`}>
              <div style={{ padding: "12px 0 6px 0" }}>{title}</div>
            </Heading>

            <ul className="ModuleItems ExpandCollapseList">{itemComponents}</ul>
          </li>
        );
      }
    );

    return moduleComponents;
  }
}
