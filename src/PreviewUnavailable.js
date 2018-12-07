import React from "react";
import noSignalTvIcon from "./images/no-signal-tv.svg";
import View from "@instructure/ui-layout/lib/components/View";
import Text from "@instructure/ui-elements/lib/components/Text";
import { Trans } from "@lingui/macro";

export default function PreviewUnavailable() {
  return (
    <View as="div" textAlign="center">
      <View as="div">
        <img
          className="preview-not-available-icon"
          src={noSignalTvIcon}
          alt="No signal TV icon"
        />
      </View>
      <Text size="x-large">
        <Trans>External Tool Content Can't be Previewed</Trans>
      </Text>
      <br />
      <br />
      <Text>
        <Trans>
          In order to use this resource in Canvas, the external tool must be
          installed.
        </Trans>
      </Text>
    </View>
  );
}
