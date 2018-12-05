import React, { PureComponent } from "react";
import { basename } from "path";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import Icon from "@instructure/ui-icons/lib/Line/IconAssignment";
import RichContent from "./RichContent";

export default class AssignmentBody extends PureComponent {
  render() {
    return (
      <React.Fragment>
        <div
          className="resource-label"
          style={{ color: this.props.labelColor }}
        >
          <div
            className="resource-label-icon"
            style={{ backgroundColor: this.props.labelColor }}
          >
            <Icon color="primary-inverse" />
          </div>
          <span>Assignment</span>
        </div>

        <Heading level="h1" margin="0 0 small">
          {this.props.title}
        </Heading>
        {this.props.submissionFormats &&
          this.props.submissionFormats.length > 0 && (
            <React.Fragment>
              <div style={{ marginTop: "12px", marginBottom: "12px" }}>
                <span style={{ fontWeight: "bold" }}>Submitting</span>:{" "}
                <span className="submission-format">
                  {this.props.submissionFormats}
                </span>
              </div>
            </React.Fragment>
          )}

        {this.props.pointsPossible != null && (
          <div>
            <span style={{ fontWeight: "bold" }}>Points</span>:{" "}
            {this.props.pointsPossible}
          </div>
        )}

        {this.props.descriptionHtml &&
          this.props.descriptionHtml.length > 0 && (
            <RichContent
              html={this.props.descriptionHtml}
              getUrlForPath={this.props.getUrlForPath}
              resourceIdsByHrefMap={this.props.resourceIdsByHrefMap}
            />
          )}

        {this.props.attachments &&
          this.props.attachments.length > 0 && (
            <React.Fragment>
              <Heading level="h2">Attachments</Heading>
              <ul>
                {this.props.attachments.map(attachment => {
                  return (
                    <li key={attachment}>
                      {this.props.resourceIdsByHrefMap.has(attachment) ? (
                        <a
                          href={`#/resources/${this.props.resourceIdsByHrefMap.get(
                            attachment
                          )}`}
                        >
                          {basename(attachment)}
                        </a>
                      ) : (
                        basename(attachment)
                      )}
                    </li>
                  );
                })}
              </ul>
            </React.Fragment>
          )}
      </React.Fragment>
    );
  }
}
