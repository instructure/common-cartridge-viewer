import React from "react";
import Unavailable from "./Unavailable";
import I18n from "./I18n";
import { t } from "@lingui/core/macro";

export default function PreviewUnavailable() {
  return (
    <I18n>
      {({ i18n }) => (
        <Unavailable
          heading={t`External Tool Content Can't be Previewed`}
          subHeading={t`In order to use this resource in Canvas, the external tool must be installed.`}
        />
      )}
    </I18n>
  );
}
