import React, { Component } from "react";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import { questionTypes } from "./constants";
import RichContent from "./RichContent";
import FormFieldGroup from "@instructure/ui-forms/lib/components/FormFieldGroup";
import FormField from "@instructure/ui-forms/lib/components/FormField";
import Icon from "@instructure/ui-icons/lib/Line/IconQuiz";
import Text from "@instructure/ui-elements/lib/components/Text";
import View from "@instructure/ui-layout/lib/components/View";
import Pill from "@instructure/ui-elements/lib/components/Pill";
import { I18n } from "@lingui/react";
import { Trans, t } from "@lingui/macro";

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

      return {
        ident,
        metadata,
        mattextNode
      };
    });

    const questionComponents = items.map((item, index) => {
      const type = item.metadata.get("cc_profile");
      const material = item.mattextNode && item.mattextNode.textContent;

      return (
        <I18n key={index}>
          {({ i18n }) => (
            <View
              key={index}
              as="li"
              padding="small none"
              background="default"
              borderWidth="small none none none"
            >
              {type === questionTypes.MULTIPLE_CHOICE ? (
                <Pill
                  variant="success"
                  margin="0 0 small"
                  text={i18n._(t`Multiple choice`)}
                />
              ) : type === questionTypes.MULTIPLE_RESPONSE ? (
                <Pill
                  variant="success"
                  margin="0 0 small"
                  text={i18n._(t`Multiple response`)}
                />
              ) : type === questionTypes.TRUEFALSE ? (
                <Pill
                  variant="success"
                  margin="0 0 small"
                  text={i18n._(t`True / false`)}
                />
              ) : type === questionTypes.FILL_IN_THE_BLANK ? (
                <Pill
                  variant="success"
                  margin="0 0 small"
                  text={i18n._(t`Fill in the blank`)}
                />
              ) : type === questionTypes.PATTERN_MATCH ? (
                <Pill
                  variant="success"
                  margin="0 0 small"
                  text={i18n._(t`Pattern match`)}
                />
              ) : type === questionTypes.ESSAY ? (
                <Pill
                  variant="success"
                  margin="0 0 small"
                  text={i18n._(t`Essay`)}
                />
              ) : (
                <Pill
                  variant="success"
                  margin="0 0 small"
                  text={i18n._(t`Other type`)}
                />
              )}

              {material && (
                <RichContent
                  getUrlForPath={this.props.getUrlForPath}
                  html={material}
                  resourceIdsByHrefMap={this.props.resourceIdsByHrefMap}
                />
              )}
            </View>
          )}
        </I18n>
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
            <Trans>Assessment</Trans>
          </span>
        </div>

        <Heading level="h1" margin="0 0 small">
          {title}
        </Heading>

        {/* {metadata.has("qmd_assessmenttype") && (
            <div>
              <div>Type</div>
              <div>{metadata.get("qmd_assessmenttype")}</div>
            </div>
          )} */}

        <FormFieldGroup id="assessmentfields" description="">
          {metadata.has("cc_maxattempts") && (
            <FormField id="maxattempts" label="Max attempts">
              <Text>{metadata.get("cc_maxattempts")}</Text>
            </FormField>
          )}
        </FormFieldGroup>

        <Heading level="h2" margin="medium 0 small">
          <Trans>Questions</Trans>
        </Heading>

        <ul className="assessment-questions">{questionComponents}</ul>
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
