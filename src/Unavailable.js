import React from "react";
import noSignalTvIcon from "./images/no-signal-tv.svg";
import View from "@instructure/ui-layout/lib/components/View";
import Text from "@instructure/ui-elements/lib/components/Text";

export default function Unavailable(props) {
  return (
    <View as="div" textAlign="center">
      <View as="div">
        <img
          className="preview-not-available-icon"
          src={noSignalTvIcon}
          alt="No signal TV icon"
        />
      </View>
      <Text size="x-large">{props.heading}</Text>
      <br />
      <br />
      <Text>{props.subHeading}</Text>
    </View>
  );
}
