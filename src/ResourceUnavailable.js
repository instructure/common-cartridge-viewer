import React from "react";
import Unavailable from "./Unavailable";
import I18n from "./I18n";
import { t } from "@lingui/core/macro";

export default function ResourceUnavailable() {
  return (
    <I18n>
      {({ i18n }) => (
        <Unavailable
          heading={t`Resource Unavailable`}
          subHeading={t`This resource is not included in the package.`}
        />
      )}
    </I18n>
  );
}
