import React, { PureComponent } from "react";
import { basename } from "path";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import Icon from "@instructure/ui-icons/lib/Line/IconAssignment";
import RichContent from "./RichContent";
import { Trans } from "@lingui/macro";
import Text from "@instructure/ui-elements/es/components/Text";

export default class AssignmentBody extends PureComponent {
  getRubricRatingsColSpan = () => {
    let colspan = 1;

    this.props.rubric.criteria.forEach(criteria => {
      if (criteria.ratings.length > colspan) colspan = criteria.ratings.length;
    });

    return colspan;
  };

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
          <span>
            <Trans>Assignment</Trans>
          </span>
        </div>

        <Heading level="h1" margin="0 0 small">
          {this.props.title}
        </Heading>
        {this.props.submissionFormats &&
          this.props.submissionFormats.length > 0 && (
            <React.Fragment>
              <div style={{ marginTop: "12px", marginBottom: "12px" }}>
                <span style={{ fontWeight: "bold" }}>
                  <Trans>Submitting</Trans>
                </span>
                :{" "}
                <span className="submission-format">
                  {this.props.submissionFormats}
                </span>
              </div>
            </React.Fragment>
          )}

        {this.props.pointsPossible != null && (
          <div>
            <span style={{ fontWeight: "bold" }}>
              <Trans>Points</Trans>
            </span>
            : {this.props.pointsPossible}
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

        {this.props.attachments && this.props.attachments.length > 0 && (
          <React.Fragment>
            <Heading level="h2">
              <Trans>Attachments</Trans>
            </Heading>
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
        {this.props.rubric && (
          <React.Fragment>
            <table title={this.props.rubric.title}>
              <thead>
                <tr>
                  <th
                    align="left"
                    scope="col"
                    style={{ borderBottom: "none" }}
                    colspan={this.getRubricRatingsColSpan() + 2}
                  >
                    <Text size="large" weight="bold" lineHeight="double">
                      {this.props.rubric.title}
                    </Text>
                  </th>
                </tr>
                <tr>
                  <th align="left" scope="col" style={{ border: "none" }}>
                    <Trans>Criteria</Trans>
                  </th>
                  <th
                    align="left"
                    scope="col"
                    colspan={this.getRubricRatingsColSpan()}
                    style={{ border: "none" }}
                  >
                    <Trans>Ratings</Trans>
                  </th>
                  <th align="left" scope="col" style={{ border: "none" }}>
                    <Trans>Pts</Trans>
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.props.rubric.criteria.map(criteria => {
                  return (
                    <tr key={criteria.id}>
                      <td>{criteria.description}</td>
                      {criteria.ratings.map(rating => (
                        <td>
                          <Text as="div">
                            {rating.points} <Trans>pts</Trans>
                          </Text>
                          <Text as="div">{rating.description}</Text>
                        </td>
                      ))}
                      <td align="center">{criteria.points}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <th
                    align="right"
                    scope="col"
                    colspan={this.getRubricRatingsColSpan() + 1}
                    style={{ borderRight: "none" }}
                  >
                    <Text weight="bold" lineHeight="double">
                      <Trans>Total points:</Trans>
                    </Text>
                  </th>
                  <th scope="col" style={{ borderLeft: "none" }}>
                    {this.props.rubric.pointsPossible}
                  </th>
                </tr>
              </tfoot>
            </table>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}
