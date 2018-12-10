import { basename } from "path";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { resourceTypes } from "./constants";
import { Link as RouterLink } from "react-router-dom";
import { saveAs } from "file-saver";
import Billboard from "@instructure/ui-billboard/lib/components/Billboard";
import IconDownload from "@instructure/ui-icons/lib/Line/IconDownload";
import Button from "@instructure/ui-buttons/lib/components/Button";
import Tooltip from "@instructure/ui-overlays/lib/components/Tooltip";
import Flex, { FlexItem } from "@instructure/ui-layout/lib/components/Flex";
import EntryDocument from "./EntryDocument";
import Image from "./Image";
import Assignment from "./Assignment";
import AssociatedContentAssignment from "./AssociatedContentAssignment";
import Discussion from "./Discussion";
import Assessment from "./Assessment";
import WikiContent from "./WikiContent";
import WebLink from "./WebLink";
import { getExtension, getResourceHref } from "./utils";
import { Trans } from "@lingui/macro";
import ResourceUnavailable from "./ResourceUnavailable";

export default class Resource extends Component {
  static propTypes = {
    allItemsPath: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      isNotFound: false
    };
  }

  async componentDidMount() {
    const resource = this.props.resourceMap.get(this.props.identifier);
    if (resource == null) {
      this.setState({ isNotFound: true });
      return;
    }
    document.body.addEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = event => {
    if (event.which === 37) {
      this.handlePreviousButtonPressed();
      event.preventDefault();
    } else if (event.which === 39) {
      this.handleNextButtonPressed();
      event.preventDefault();
    }
  };

  handleDownload = async () => {
    const resource = this.props.resourceMap.get(this.props.identifier);
    const path = getResourceHref(resource);
    saveAs(
      this.props.isCartridgeRemotelyExpanded
        ? `${this.props.basepath}/${path}`
        : await this.props.getBlobByPath(path),
      basename(path)
    );
  };

  componentWillUnmount() {
    document.body.removeEventListener("keydown", this.handleKeyDown);
  }

  setNextButton = node => {
    this.nextButton = node;
  };

  setPreviousButton = node => {
    this.previousButton = node;
  };

  setAllItemsButton = node => {
    this.allItemsButton = node;
  };

  handleNextButtonPressed = () => {
    this.nextButton && this.nextButton.click();
  };

  handlePreviousButtonPressed = () => {
    this.previousButton && this.previousButton.click();
  };

  handleAllItemsButtonPressed = () => {
    this.allItemsButton.click();
  };

  renderPreviousButton = previousItem => {
    return (
      <div className="previous-link">
        <Tooltip variant="inverse" tip={previousItem.title} placement="end">
          <Button
            to={`/resources/${previousItem.identifierref ||
              previousItem.identifier}`}
            variant="ghost"
            as={RouterLink}
            innerRef={this.setPreviousButton}
            onClick={this.handlePreviousButtonPressed}
          >
            <Trans>Previous</Trans>
          </Button>
        </Tooltip>
      </div>
    );
  };

  renderNextButton = nextItem => {
    return (
      <div className="next-link">
        <Tooltip variant="inverse" tip={nextItem.title} placement="start">
          <Button
            to={`/resources/${nextItem.identifierref || nextItem.identifier}`}
            variant="ghost"
            as={RouterLink}
            innerRef={this.setNextButton}
            onClick={this.handleNextButtonPressed}
          >
            <Trans>Next</Trans>
          </Button>
        </Tooltip>
      </div>
    );
  };

  renderAllItemsButton = () => {
    return (
      <Tooltip variant="inverse" tip="All Items" placement="bottom">
        <Button
          to={this.props.allItemsPath}
          variant="ghost"
          as={RouterLink}
          innerRef={this.setAllItemsButton}
          onClick={this.handleAllItemsButtonPressed}
        >
          <Trans>All Items</Trans>
        </Button>
      </Tooltip>
    );
  };

  renderResourceDocument = resource => {
    let componentToRender;
    const href = getResourceHref(resource);
    const filename = basename(href);
    const extension = getExtension(href).toLowerCase();
    const type = resource.getAttribute("type");

    const components = {
      [resourceTypes.WEB_LINK]: (
        <EntryDocument
          getTextByPath={this.props.getTextByPath}
          href={href}
          render={doc => <WebLink doc={doc} />}
          src={this.props.src}
          type="text/xml"
        />
      ),
      [resourceTypes.ASSESSMENT_CONTENT]: (
        <EntryDocument
          getTextByPath={this.props.getTextByPath}
          href={href}
          render={doc => (
            <Assessment
              getTextByPath={this.props.getTextByPath}
              getUrlForPath={this.props.getUrlForPath}
              doc={doc}
              resourceIdsByHrefMap={this.props.resourceIdsByHrefMap}
            />
          )}
          src={this.props.src}
          type="text/xml"
        />
      ),
      [resourceTypes.ASSIGNMENT]: (
        <EntryDocument
          getTextByPath={this.props.getTextByPath}
          href={href}
          render={doc => (
            <Assignment
              getTextByPath={this.props.getTextByPath}
              getUrlForPath={this.props.getUrlForPath}
              doc={doc}
              resourceIdsByHrefMap={this.props.resourceIdsByHrefMap}
            />
          )}
          src={this.props.src}
          type="text/xml"
        />
      ),
      [resourceTypes.ASSOCIATED_CONTENT]: (
        <EntryDocument
          getTextByPath={this.props.getTextByPath}
          href={href}
          render={doc => (
            <AssociatedContentAssignment
              getTextByPath={this.props.getTextByPath}
              getUrlForPath={this.props.getUrlForPath}
              doc={doc}
              identifier={this.props.identifier}
              resourceIdsByHrefMap={this.props.resourceIdsByHrefMap}
            />
          )}
          src={this.props.src}
          type="text/xml"
        />
      ),
      [resourceTypes.DISCUSSION_TOPIC]: (
        <EntryDocument
          getTextByPath={this.props.getTextByPath}
          href={href}
          render={doc => (
            <Discussion
              doc={doc}
              getTextByPath={this.props.getTextByPath}
              getUrlForPath={this.props.getUrlForPath}
              resourceIdsByHrefMap={this.props.resourceIdsByHrefMap}
            />
          )}
          src={this.props.src}
          type="text/xml"
        />
      )
    };

    const webComponents = {
      image: <Image getUrlForPath={this.props.getUrlForPath} href={href} />,
      html: (
        <EntryDocument
          getTextByPath={this.props.getTextByPath}
          href={href}
          render={doc => (
            <WikiContent
              doc={doc}
              getBlobByPath={this.props.getBlobByPath}
              getTextByPath={this.props.getTextByPath}
              getUrlForPath={this.props.getUrlForPath}
              resourceIdsByHrefMap={this.props.resourceIdsByHrefMap}
              resourceMap={this.props.resourceMap}
            />
          )}
          src={this.props.src}
          type="text/html"
        />
      )
    };

    const downloadComponent = (
      <Billboard
        size="medium"
        message={`Download ${filename}`}
        onClick={this.handleDownload}
        hero={size => <IconDownload size={size} />}
      />
    );

    if (type === resourceTypes.WEB_CONTENT) {
      if (["png", "jpg", "gif", "webp"].includes(extension)) {
        componentToRender = webComponents["image"];
      } else if (["html", "htm"].includes(extension)) {
        componentToRender = webComponents["html"];
      }
    }

    if (componentToRender == null) {
      componentToRender = components[type];
    }

    return componentToRender ? componentToRender : downloadComponent;
  };

  render() {
    let resource = this.props.resourceMap.get(this.props.identifier);
    const { moduleItems } = this.props;

    if (resource == null) {
      return <ResourceUnavailable />;
    }

    if (resource.getAttribute("identifierref") != null) {
      resource = this.props.resourceMap.get(
        resource.getAttribute("identifierref")
      );
    }

    const href = getResourceHref(resource);
    const currentIndex = moduleItems.findIndex(item => `${item.href}` === href);
    const previousItem = currentIndex > -1 && moduleItems[currentIndex - 1];
    const nextItem = currentIndex > -1 && moduleItems[currentIndex + 1];

    return (
      <React.Fragment>
        <div>
          <Flex margin="0 0 medium">
            <FlexItem padding="small" width="14rem">
              {previousItem && this.renderPreviousButton(previousItem)}
            </FlexItem>
            <FlexItem padding="small" grow={true} align="center">
              <Flex justifyItems="center">
                {this.props.allItemsPath && this.renderAllItemsButton()}
              </Flex>
            </FlexItem>
            <FlexItem padding="small" width="14rem">
              <Flex justifyItems="end">
                {nextItem && this.renderNextButton(nextItem)}
              </Flex>
            </FlexItem>
          </Flex>
        </div>
        <div
          style={{
            clear: "both"
          }}
        >
          {this.renderResourceDocument(resource)}
        </div>
      </React.Fragment>
    );
  }
}
