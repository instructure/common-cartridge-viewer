import React from "react";
import Unavailable from "./Unavailable";
import I18n from "./I18n";
import { t } from "@lingui/core/macro";

export default function CourseNavigationUnavailable() {
  return (
    <I18n>
      {({ i18n }) => (
        <Unavailable
          heading={t`Course Navigation Cannot Be Previewed`}
          subHeading={t`Course navigation links are only available within a Canvas course.`}
        />
      )}
    </I18n>
  );
}
