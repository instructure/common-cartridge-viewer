import React, { Component } from "react";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import { questionTypes } from "./constants";
import RichContent from "./RichContent";
import ClassicQuizIcon from "@instructure/ui-icons/lib/Line/IconQuiz";
import QuizzesNextIcon from "@instructure/ui-icons/lib/Solid/IconQuiz";
import Text from "@instructure/ui-elements/lib/components/Text";
import View from "@instructure/ui-layout/lib/components/View";
import Pill from "@instructure/ui-elements/lib/components/Pill";
import { Trans } from "@lingui/macro";
import Grid, {
  GridCol,
  GridRow
} from "@instructure/ui-layout/lib/components/Grid";
import IconCheckMark from "@instructure/ui-icons/lib/Line/IconCheckMark";
import { getOptionalTextContent } from "./utils";

export default class Assessment extends Component {
  render() {
    const doc = this.props.doc;

    const assessmentNode = doc.querySelector("assessment");
    if (assessmentNode == null) {
      // Not yet loaded
      return null;
    }
    const title = assessmentNode.getAttribute("title");
    const isFromQuizzesNext = !!assessmentNode.getAttribute(
      "external_assignment_id"
    );
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

      let responses = {};
      let conditions = [];

      // Select all of the conditions var that the respcondition is empty
      // or has a continue attribute === "No"

      Array.from(itemNode.querySelectorAll("resprocessing respcondition"))
        .filter(
          respcondition =>
            !respcondition.getAttribute("continue") ||
            respcondition.getAttribute("continue") === "No"
        )
        .map(
          rescondition =>
            (conditions = conditions.concat(
              Array.from(rescondition.querySelectorAll("conditionvar > *"))
            ))
        );

      conditions.forEach(condition => {
        switch (condition.tagName) {
          case "and":
            condition
              .querySelectorAll(":scope > varresult, :scope > varequal")
              .forEach(
                result =>
                  (responses[result.textContent] = result.getAttribute(
                    "respident"
                  ))
              );
            break;
          case "other":
            break;
          default:
            responses[condition.textContent] = condition.getAttribute(
              "respident"
            );
            break;
        }
      });

      const options = Array.from(
        itemNode.querySelectorAll("presentation > response_lid")
      ).map(response_lid => {
        let response_lid_id = response_lid.getAttribute("ident");
        return {
          id: response_lid_id,
          name: getOptionalTextContent(response_lid, "mattext"),
          responses: Array.from(
            response_lid.querySelectorAll("response_label")
          ).map(response => {
            let response_id = response.getAttribute("ident");
            return {
              id: response_id,
              text: getOptionalTextContent(response, "mattext"),
              valid:
                response_id in responses &&
                responses[response_id] === response_lid_id
            };
          })
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
      const type =
        item.metadata.get("question_type") || item.metadata.get("cc_profile");
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
            />
          )}

          {questionTypes.MULTIPLE_CHOICE.includes(type) && (
            <Pill margin="0 0 small" text={<Trans>Multiple choice</Trans>} />
          )}
          {questionTypes.MULTIPLE_RESPONSE.includes(type) && (
            <Pill margin="0 0 small" text={<Trans>Multiple response</Trans>} />
          )}
          {questionTypes.TRUEFALSE.includes(type) && (
            <Pill margin="0 0 small" text={<Trans>True / false</Trans>} />
          )}
          {questionTypes.FILL_IN_THE_BLANK.includes(type) && (
            <Pill margin="0 0 small" text={<Trans>Fill in the blank</Trans>} />
          )}
          {questionTypes.PATTERN_MATCH.includes(type) && (
            <Pill margin="0 0 small" text={<Trans>Pattern match</Trans>} />
          )}
          {questionTypes.ESSAY.includes(type) && (
            <Pill margin="0 0 small" text={<Trans>Essay</Trans>} />
          )}
          {questionTypes.MULTIPLE_DROPDOWN.includes(type) && (
            <Pill margin="0 0 small" text={<Trans>Multiple Dropdowns</Trans>} />
          )}
          {questionTypes.MATCH_QUESTION.includes(type) && (
            <Pill margin="0 0 small" text={<Trans>Match Questions</Trans>} />
          )}
          {questionTypes.NUMERICAL.includes(type) && (
            <Pill margin="0 0 small" text={<Trans>Numerical</Trans>} />
          )}
          {questionTypes.CALCULATED.includes(type) && (
            <Pill margin="0 0 small" text={<Trans>Calculated</Trans>} />
          )}
          {questionTypes.TEXT_ONLY.includes(type) && (
            <Pill margin="0 0 small" text={<Trans>Text only</Trans>} />
          )}
          {questionTypes.FILE_UPLOAD.includes(type) && (
            <Pill margin="0 0 small" text={<Trans>File Upload</Trans>} />
          )}

          {showQuizzesAnswers && (
            <div className="question-answers">
              <Grid vAlign="middle" colSpacing="none">
                <GridRow>
                  <GridCol width={item.options.length > 1 ? 8 : 5}>
                    <Grid vAlign="middle" margin="none" colSpacing="none">
                      <GridRow startAt={null}>
                        {item.options &&
                          item.options.map(optionGroup => (
                            <GridCol key={optionGroup.id}>
                              {item.options.length > 1 && (
                                <Text lineHeight="double" weight="bold">
                                  {optionGroup.name}
                                </Text>
                              )}
                              <Grid vAlign="middle" colSpacing="none">
                                {optionGroup.responses.map(option => (
                                  <GridRow rowSpacing="none" key={option.id}>
                                    <GridCol width="auto">
                                      <IconCheckMark
                                        color="success"
                                        className="Assessment--IconCheckMark"
                                        style={{
                                          visibility: option.valid
                                            ? "visible"
                                            : "hidden"
                                        }}
                                      />
                                    </GridCol>
                                    <GridCol>
                                      <RichContent
                                        getUrlForPath={this.props.getUrlForPath}
                                        html={option.text}
                                        padding="none"
                                        margin="none"
                                        resourceIdsByHrefMap={
                                          this.props.resourceIdsByHrefMap
                                        }
                                      />
                                    </GridCol>
                                  </GridRow>
                                ))}
                              </Grid>
                            </GridCol>
                          ))}
                      </GridRow>
                    </Grid>
                  </GridCol>
                </GridRow>
              </Grid>
            </div>
          )}
        </View>
      );
    });

    return (
      <React.Fragment>
        <div className="resource-label font-color type-quiz">
          <div className="resource-label-icon background-color type-quiz">
            {isFromQuizzesNext ? (
              <QuizzesNextIcon color="primary-inverse" />
            ) : (
              <ClassicQuizIcon color="primary-inverse" />
            )}
          </div>
          <span>
            {isFromQuizzesNext ? (
              <Trans>New Quizzes</Trans>
            ) : (
              <Trans>Classic Quiz</Trans>
            )}
          </span>
        </div>

        <Heading level="h1" margin="0 0 small">
          {title}
        </Heading>

        <Text weight="bold">
          <Trans>Max attempts</Trans>: {metadata.get("cc_maxattempts")}
        </Text>
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
