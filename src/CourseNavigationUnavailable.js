import React from "react";
import Unavailable from "./Unavailable";
import { I18n } from "@lingui/react";
import { t } from "@lingui/macro";

export default function CourseNavigationUnavailable() {
  return (
    <I18n>
      {({ i18n }) => (
        <Unavailable
          heading={i18n._(t`Course Navigation Cannot Be Previewed`)}
          subHeading={i18n._(
            t`Course navigation links are only available within a Canvas course.`
          )}
        />
      )}
    </I18n>
  );
}
