import React from "react";
import noSignalTvIcon from "./images/no-signal-tv.svg";
import View from "@instructure/ui-layout/lib/components/View";
import Text from "@instructure/ui-elements/lib/components/Text";
import { getPreviousAndNextItems, isButtonNavigationEnabled } from "./utils";
import NavigationButtonContainer from "./NavigationButtonContainer";

export default function Unavailable(props) {
  const moduleItem = props.moduleItems.find(
    moduleItem => moduleItem.identifierref === props.identifier
  );
  const [previousItem, nextItem] = getPreviousAndNextItems(
    props.moduleItems,
    moduleItem && moduleItem.href
  );
  const buttonNavigationEnabled = isButtonNavigationEnabled(props.location);
  return (
    <View as="div" textAlign="center">
      {previousItem && nextItem && (
        <NavigationButtonContainer
          buttonNavigationEnabled={buttonNavigationEnabled}
          previousItem={previousItem}
          nextItem={nextItem}
          location={props.location}
        />
      )}
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
