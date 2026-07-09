import React from "react";
import Unavailable from "./Unavailable";
import { I18n } from "@lingui/react";
import { t } from "@lingui/macro";

export default function PreviewUnavailable() {
  return (
    <I18n>
      {({ i18n }) => (
        <Unavailable
          heading={i18n._(t`External Tool Content Can't be Previewed`)}
          subHeading={i18n._(
            t`In order to use this resource in Canvas, the external tool must be installed.`,
          )}
        />
      )}
    </I18n>
  );
}
