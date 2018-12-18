import React from "react";
import Unavailable from "./Unavailable";
import { I18n } from "@lingui/react";
import { t } from "@lingui/macro";

export default function ResourceUnavailable(props) {
  return (
    <I18n>
      {({ i18n }) => (
        <Unavailable
          heading={i18n._(t`Resource Unavailable`)}
          subHeading={i18n._(t`This resource is not included in the package.`)}
          moduleItems={props.moduleItems}
          identifier={props.identifier}
          location={props.location}
        />
      )}
    </I18n>
  );
}
