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
import { HashRouter as Router } from "react-router-dom";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartridge: this.props.cartridge,
      file: null,
      history: { location: { pathname: "/" } },
      featuredCartridges: []
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

  componentDidMount() {
    fetch("/featured-cartridges.json")
      .then(response => {
        return response.json();
      })
      .then(featuredCartridges => {
        this.setState({ featuredCartridges });
      });
  }

  render() {
    const cartridges = this.state.featuredCartridges.map(
      ([title, href, license, author, source], index) => (
        <li key={index}>
          <a href={`/?src=${href}`}>{title}</a> ({author}, {license},{" "}
          <a href={source}>source</a>)
        </li>
      )
    );

    const hasSourceOrContent =
      this.state.cartridge == null &&
      this.state.file == null &&
      this.props.manifest == null;

    return (
      <View as="div" margin="medium">
        {hasSourceOrContent && (
          <React.Fragment>
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
                    label={<ScreenReaderContent>Cartridge</ScreenReaderContent>}
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

            <Heading level="h2">Examples</Heading>

            <ul style={{ marginBottom: "12px" }}>{cartridges}</ul>
          </React.Fragment>
        )}

        {this.props.manifest != null && (
          <Router>
            <CommonCartridge
              compact={this.props.compact}
              onHistoryChange={this.handleHistoryChange}
              manifest={this.props.manifest}
            />
          </Router>
        )}

        {this.props.cartridge != null && (
          <Router>
            <CommonCartridge
              compact={this.props.compact}
              onHistoryChange={this.handleHistoryChange}
              src={this.state.cartridge || this.state.file}
            />
          </Router>
        )}

        {this.state.file != null && (
          <Router>
            <CommonCartridge
              compact={this.props.compact}
              onHistoryChange={this.handleHistoryChange}
              src="droppedFile"
              file={this.state.file}
            />
          </Router>
        )}
      </View>
    );
  }
}
