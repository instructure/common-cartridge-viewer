import React, { Component } from "react";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import { questionTypeLabels } from "./constants";
import RichContent from "./RichContent";
import FormFieldGroup from "@instructure/ui-forms/lib/components/FormFieldGroup";
import FormField from "@instructure/ui-forms/lib/components/FormField";
import Icon from "@instructure/ui-icons/lib/Line/IconQuiz";
import Text from "@instructure/ui-elements/lib/components/Text";
import View from "@instructure/ui-layout/lib/components/View";
import Pill from "@instructure/ui-elements/lib/components/Pill";

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
      const typeLabel =
        questionTypeLabels[item.metadata.get("cc_profile")] || "Other type";

      const material = item.mattextNode && item.mattextNode.textContent;

      return (
        <View
          key={index}
          as="li"
          padding="small none"
          background="default"
          borderWidth="small none none none"
        >
          <Pill variant="success" margin="0 0 small" text={typeLabel} />

          {material && (
            <RichContent html={material} entryMap={this.props.entryMap} />
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
          <span>Assessment</span>
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
          Questions
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
