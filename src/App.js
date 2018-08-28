import React, { Component } from "react";
import CommonCartridge from "./CommonCartridge";
import Flex, { FlexItem } from "@instructure/ui-layout/lib/components/Flex";
import FileDrop from "@instructure/ui-forms/lib/components/FileDrop";
import Billboard from "@instructure/ui-billboard/lib/components/Billboard";
import IconZipped from "@instructure/ui-icons/lib/Line/IconZipped";
import ScreenReaderContent from "@instructure/ui-a11y/lib/components/ScreenReaderContent";
import TextInput from "@instructure/ui-forms/lib/components/TextInput";
import Button from "@instructure/ui-buttons/lib/components/Button";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import View from "@instructure/ui-layout/lib/components/View";
// import GitHubCorner from "./GitHubCorner";

const queryString = require("query-string-es5");

const FEATURED_CARTRIDGES = [
  [
    "Ally: Accessibility Workshop",
    "https://dl2ge9eav9ucb.cloudfront.net/facc0607309246638c298c6a1b01abcf.imscc",
    "cc-by 4.0",
    "Liz Falconer",
    "https://lor.instructure.com/resources/facc0607309246638c298c6a1b01abcf"
  ],
  [
    "US History Since 1877",
    "https://dl2ge9eav9ucb.cloudfront.net/45b943dadf904bb0835df11e62030742.imscc",
    "public domain",
    "Adam Boarman",
    "https://lor.instructure.com/resources/45b943dadf904bb0835df11e62030742"
  ],
  [
    "Canvas Levels of Learning XP",
    "https://dl2ge9eav9ucb.cloudfront.net/292b3b44b9b34309b7c6e1f92019007f.imscc",
    "by-sa 4.0",
    "Bradley Moser",
    "https://lor.instructure.com/resources/292b3b44b9b34309b7c6e1f92019007f"
  ],
  [
    "HBUHSD Geometry Resource Course (29.7 MB)",
    "https://dl2ge9eav9ucb.cloudfront.net/c075c6df1f674a7b9d9192307e812f74.imscc",
    "by-nc-sa 4.0",
    "Kendra Rosales",
    "https://lor.instructure.com/resources/c075c6df1f674a7b9d9192307e812f74"
  ],
  [
    "Kung Fu Canvas (with videos linked) (65.48 MB)",
    "https://dl2ge9eav9ucb.cloudfront.net/faa3332ffd834070ad81d97bdb236649.imscc",
    "by-nc-sa 4.0",
    "Mike Cowen",
    "https://lor.instructure.com/resources/faa3332ffd834070ad81d97bdb236649"
  ],
  [
    "KNOW & The Challenge Mosaic (572.43 MB)",
    "https://dl2ge9eav9ucb.cloudfront.net/d933c048da6d4fd5a9cb552148d628cb.imscc",
    "by-nc-sa 4.0",
    "Missy Widmann",
    "https://lor.instructure.com/resources/d933c048da6d4fd5a9cb552148d628cb"
  ]
];

const parseQueryString = queryString.parse(window.location.search);

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cartridge: parseQueryString.src, // localCartridges[0],
      file: null,
      history: { location: { pathname: "/" } }
    };
  }

  selectCartridge = cartridge => {
    this.setState({ cartridge }, () => {
      this.handleTabClick();
    });
  };

  handleHistoryChange = history => {
    this.setState({ history });
  };

  render() {
    const cartridges = FEATURED_CARTRIDGES.map(
      ([title, href, license, author, source], index) => (
        <li key={index}>
          <a href={`/?src=${href}`}>{title}</a> ({author}, {license},{" "}
          <a href={source}>source</a>)
        </li>
      )
    );

    return (
      <View as="div" margin="medium">
        {this.state.cartridge == null &&
          this.state.file == null && (
            <React.Fragment>
              {/* <GitHubCorner /> */}

              <View as="div" margin="large">
                <FileDrop
                  accept=".imscc"
                  onDropAccepted={files => {
                    this.setState({ file: files[0] });
                  }}
                  onDropRejected={file => {
                    console.error("file rejected");
                  }}
                  label={
                    <Billboard
                      heading="View a Common Cartridge (.imscc)"
                      message="Drag and drop, or click to browse your computer"
                      hero={<IconZipped />}
                    />
                  }
                />
              </View>

              <form>
                <Flex justifyItems="center" margin="medium none large">
                  <FlexItem>
                    <TextInput
                      name="src"
                      width="30rem"
                      label={
                        <ScreenReaderContent>Cartridge</ScreenReaderContent>
                      }
                      placeholder={
                        "https://www.yourdomain.com/cartridge.imscc (CORS enabled)"
                      }
                    />
                  </FlexItem>
                  <FlexItem padding="0 0 0 x-small">
                    <Button type="submit" variant="primary">
                      View
                    </Button>
                  </FlexItem>
                </Flex>
              </form>

              <p>
                View Common Cartridges in the browser. Requires no server-side
                processing.
              </p>

              <p>This is in an early rapid development phase.</p>

              <Heading level="h2">Examples</Heading>

              <ul style={{ marginBottom: "12px" }}>{cartridges}</ul>
            </React.Fragment>
          )}

        {this.state.cartridge != null && (
          <CommonCartridge
            onHistoryChange={this.handleHistoryChange}
            src={this.state.cartridge}
          />
        )}

        {this.state.file != null && (
          <CommonCartridge
            onHistoryChange={this.handleHistoryChange}
            file={this.state.file}
          />
        )}
      </View>
    );
  }
}
