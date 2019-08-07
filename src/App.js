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
import Responsive from "@instructure/ui-layout/lib/components/Responsive";

import { HashRouter as Router } from "react-router-dom";
import { getExtension } from "./utils";
import { I18n } from "@lingui/react";
import { Trans, t } from "@lingui/macro";
import GithubCorner from "react-github-corner";

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

  handleSubmit = event => {
    event.preventDefault();
    const url = this.inputRef.value || "";
    const extension = getExtension(url);
    const isCartridge = ["imscc", "zip"].includes(extension);
    const isManifest = url.includes("imsmanifest.xml") && extension === "xml";
    if (isManifest) {
      window.location.href = `/?manifest=${encodeURIComponent(url)}`;
    } else if (isCartridge) {
      window.location.href = `/?cartridge=${encodeURIComponent(url)}`;
    }
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
          <a
            href={`/?${
              href.includes(".xml") ? "manifest" : "cartridge"
            }=${href}`}
          >
            {title}
          </a>
          {source && (
            <span>
              {" "}
              ({author}, {license}, <a href={source}>source</a>)
            </span>
          )}
        </li>
      )
    );

    const hasNoSource =
      this.state.cartridge == null &&
      this.state.file == null &&
      this.props.manifest == null;

    return (
      <I18n>
        {({ i18n }) => (
          <Responsive
            match="media"
            query={{
              large: { minWidth: "600px" }
            }}
            props={{
              large: { margin: "medium" }
            }}
            render={(props, matches) => (
              <View as="div" {...props}>
                {hasNoSource && (
                  <React.Fragment>
                    <GithubCorner href="https://github.com/instructure/common-cartridge-viewer" />
                    <View as="div" margin="large">
                      <FileDrop
                        accept={[".imscc", ".zip"]}
                        onDropAccepted={files => {
                          this.setState({ file: files[0] });
                        }}
                        onDropRejected={file => {
                          console.error("file rejected");
                        }}
                        label={
                          <Billboard
                            heading={i18n._(t`Common Cartridge Viewer`)}
                            message={i18n._(
                              t`Drag and drop the cartridge, or click to browse your computer.`
                            )}
                            hero={<IconZipped />}
                          />
                        }
                      />
                    </View>
                    <form onSubmit={this.handleSubmit}>
                      <Flex justifyItems="center" margin="medium none large">
                        <FlexItem>
                          <TextInput
                            inputRef={input => (this.inputRef = input)}
                            label={
                              <ScreenReaderContent>
                                <Trans>Cartridge</Trans>
                              </ScreenReaderContent>
                            }
                            name="src"
                            placeholder={i18n._(
                              t`https://www.yourdomain.com/cartridge.imscc (CORS enabled)`
                            )}
                            width="30rem"
                          />
                        </FlexItem>
                        <FlexItem padding="0 0 0 x-small">
                          <Button type="submit" variant="primary">
                            <Trans>View</Trans>
                          </Button>
                        </FlexItem>
                      </Flex>
                    </form>

                    <p>
                      <Trans>
                        View Common Cartridges in the browser. Requires no
                        server-side processing.
                      </Trans>
                    </p>

                    <Heading level="h2">
                      <Trans>Examples</Trans>
                    </Heading>

                    <ul style={{ marginBottom: "12px" }}>{cartridges}</ul>
                  </React.Fragment>
                )}

                <Router>
                  <CommonCartridge
                    manifest={this.props.manifest}
                    cartridge={this.state.cartridge || this.state.file}
                    file={this.state.file}
                    compact={this.props.compact}
                    onHistoryChange={this.handleHistoryChange}
                    onPreviewFailure={this.handlePreviewFailure}
                    previewType={this.state.previewType}
                  />
                </Router>
              </View>
            )}
          />
        )}
      </I18n>
    );
  }
}
