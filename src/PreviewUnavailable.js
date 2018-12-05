import React from "react";
import noSignalTvIcon from "./images/no-signal-tv.svg";
import View from "@instructure/ui-layout/lib/components/View";
import Text from "@instructure/ui-elements/lib/components/Text";

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
      <Text size="x-large">External Tool Content Can't be Previewed</Text>
      <br />
      <br />
      <Text>
        In order to use this resource in Canvas, the external tool must be
        installed.
      </Text>
    </View>
  );
}
