import React, { Component } from "react";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import { questionTypes } from "./constants";
import RichContent from "./RichContent";
import Icon from "@instructure/ui-icons/lib/Line/IconQuiz";
import Text from "@instructure/ui-elements/lib/components/Text";
import View from "@instructure/ui-layout/lib/components/View";
import Pill from "@instructure/ui-elements/lib/components/Pill";
import { Trans } from "@lingui/macro";
import Grid, {
  GridCol,
  GridRow
} from "@instructure/ui-layout/lib/components/Grid";
import IconCheckMark from "@instructure/ui-icons/lib/Line/IconCheckMark";

export default class Assessment extends Component {
  render() {
    const doc = this.props.doc;

    const assessmentNode = doc.querySelector("assessment");
    if (assessmentNode == null) {
      // Not yet loaded
      return null;
    }
    const title = assessmentNode.getAttribute("title");
    const metadata = getMetadataFields(
      assessmentNode.parentNode.querySelector("assessment > qtimetadata")
    );

    const items = Array.from(
      assessmentNode.querySelectorAll("section > item")
    ).map(itemNode => {
      const ident = itemNode.getAttribute("ident");

      const metadata = getMetadataFields(
        itemNode.querySelector("itemmetadata")
      );

      const mattextNode = itemNode.querySelector(
        "presentation > material > mattext"
      );

      let responses = [];
      const conditions = itemNode.querySelectorAll(
        'resprocessing respcondition[continue="No"] conditionvar > *'
      );

      conditions.forEach(condition => {
        switch (condition.tagName) {
          case "and":
            condition
              .querySelectorAll(":scope > varresult, :scope > varequal")
              .forEach(result => responses.push(result.textContent));
            break;
          case "other":
            break;
          default:
            responses.push(condition.textContent);
            break;
        }
      });

      const options = Array.from(
        itemNode.querySelectorAll("presentation > response_lid response_label")
      ).map(response => {
        let id = response.getAttribute("ident");
        return {
          id,
          text: response.querySelector("mattext").textContent,
          valid: responses.includes(id)
        };
      });

      return {
        ident,
        metadata,
        mattextNode,
        options
      };
    });

    const showQuizzesAnswers = !window.location.href.includes("hide-responses");

    const questionComponents = items.map((item, index) => {
      const type = item.metadata.get("cc_profile");
      const material = item.mattextNode && item.mattextNode.textContent;

      return (
        <View
          key={index}
          as="li"
          padding="none none small"
          background="default"
          borderWidth="none"
        >
          {material && (
            <RichContent
              getUrlForPath={this.props.getUrlForPath}
              html={material}
              padding="none"
              margin="none"
              resourceIdsByHrefMap={this.props.resourceIdsByHrefMap}
              courseNavAvailabilityByType={
                this.props.courseNavAvailabilityByType
              }
            />
          )}

          {type === questionTypes.MULTIPLE_CHOICE && (
            <Pill margin="0 0 small" text={<Trans>Multiple choice</Trans>} />
          )}
          {type === questionTypes.MULTIPLE_RESPONSE && (
            <Pill margin="0 0 small" text={<Trans>Multiple response</Trans>} />
          )}
          {type === questionTypes.TRUEFALSE && (
            <Pill margin="0 0 small" text={<Trans>True / false</Trans>} />
          )}
          {type === questionTypes.FILL_IN_THE_BLANK && (
            <Pill margin="0 0 small" text={<Trans>Fill in the blank</Trans>} />
          )}
          {type === questionTypes.PATTERN_MATCH && (
            <Pill margin="0 0 small" text={<Trans>Pattern match</Trans>} />
          )}
          {type === questionTypes.ESSAY && (
            <Pill margin="0 0 small" text={<Trans>Essay</Trans>} />
          )}

          {showQuizzesAnswers && (
            <div className="question-answers">
              <Grid vAlign="middle" colSpacing="none">
                <GridRow>
                  <GridCol width={5}>
                    {item.options &&
                      item.options.map(option => (
                        <Grid vAlign="middle" colSpacing="none">
                          <GridRow>
                            <GridCol width={1}>
                              {option.valid && (
                                <IconCheckMark color="success" />
                              )}
                            </GridCol>
                            <GridCol>{option.text}</GridCol>
                          </GridRow>
                        </Grid>
                      ))}
                  </GridCol>
                </GridRow>
              </Grid>
            </div>
          )}
        </View>
      );
    });

    const labelColor = "#A1403E";

    return (
      <React.Fragment>
        <div className="resource-label" style={{ color: labelColor }}>
          <div
            className="resource-label-icon"
            style={{ backgroundColor: labelColor }}
          >
            <Icon color="primary-inverse" />
          </div>
          <span>
            <Trans>Quiz</Trans>
          </span>
        </div>

        <Heading level="h1" margin="0 0 small">
          {title}
        </Heading>

        <Grid vAlign="middle" colSpacing="none">
          {metadata.has("cc_maxattempts") && (
            <GridRow>
              <GridCol width={2}>
                <Text weight="bold">
                  <Trans>Max attempts</Trans>
                </Text>
              </GridCol>
              <GridCol>{metadata.get("cc_maxattempts")}</GridCol>
            </GridRow>
          )}
          {/* {metadata.has("qmd_assessmenttype") && (
            <GridRow>
              <GridCol width={2}>Type</div>
              <GridCol>{metadata.get("qmd_assessmenttype")}</GridCol>
            </GridRow>
          )} */}
        </Grid>

        <Heading level="h3" margin="medium 0 small">
          <Trans>Questions</Trans>
        </Heading>
        <hr aria-hidden="true" />
        <ol className="assessment-questions">{questionComponents}</ol>
      </React.Fragment>
    );
  }
}

function getMetadataFields(node) {
  if (node == null) {
    return new Map();
  }

  const metadataFields = Array.from(
    node.querySelectorAll("qtimetadatafield")
  ).map(field => [
    field.querySelector("fieldlabel").textContent,
    field.querySelector("fieldentry").textContent
  ]);

  return new Map(metadataFields);
}
