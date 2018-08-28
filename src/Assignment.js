import React, { Component } from "react";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import RichContent from "./RichContent";
import FormFieldGroup from "@instructure/ui-forms/lib/components/FormFieldGroup";
import FormField from "@instructure/ui-forms/lib/components/FormField";
import Select from "@instructure/ui-forms/lib/components/Select";
import NumberInput from "@instructure/ui-forms/lib/components/NumberInput";

export default class Assignment extends Component {
  render() {
    const doc = this.props.doc;

    const assignmentNode = doc.querySelector("assignment");

    const title = assignmentNode.querySelector("title").textContent;

    const descriptionHtml = assignmentNode.querySelector("text").textContent;

    const submissionFormats = Array.from(
      assignmentNode.querySelectorAll("submission_formats > format")
    ).map(node => node.getAttribute("type"));

    const gradableNode = assignmentNode.querySelector("gradable");

    const points =
      gradableNode &&
      gradableNode.textContent === "true" &&
      gradableNode.getAttribute("points_possible")
        ? parseFloat(gradableNode.getAttribute("points_possible"))
        : 0;

    return (
      <React.Fragment>
        <Heading level="h1" margin="0 0 small">
          {title}
        </Heading>

        <FormFieldGroup id="assignmentfields" description="">
          {submissionFormats.length > 0 && (
            <Select
              readOnly={true}
              label="Submission formats"
              defaultOption={submissionFormats}
              formatSelectedOption={option => {
                return <span>{option.label}</span>;
              }}
              multiple
              onChange={(event, options) => console.log(options)}
            >
              {submissionFormats.map(format => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </Select>
          )}

          {gradableNode != null && (
            <NumberInput readOnly={true} label="Points" defaultValue={points} />
          )}

          {descriptionHtml &&
            descriptionHtml.length > 0 && (
              <FormField id="description" label="Description">
                <RichContent
                  html={descriptionHtml}
                  entryMap={this.props.entryMap}
                />
              </FormField>
            )}
        </FormFieldGroup>
      </React.Fragment>
    );
  }
}
