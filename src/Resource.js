import { basename } from "path";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { resourceTypes } from "./constants";
import { Link as RouterLink } from "react-router-dom";
import { saveAs } from "file-saver/FileSaver";
import Billboard from "@instructure/ui-billboard/lib/components/Billboard";
import IconDownload from "@instructure/ui-icons/lib/Line/IconDownload";
import Button from "@instructure/ui-buttons/lib/components/Button";
import Tooltip from "@instructure/ui-overlays/lib/components/Tooltip";
import Flex, { FlexItem } from "@instructure/ui-layout/lib/components/Flex";

import EntryDocument from "./EntryDocument";
import Image from "./Image";
import Assignment from "./Assignment";
import Discussion from "./Discussion";
import Assessment from "./Assessment";
import WikiContent from "./WikiContent";
import WebLink from "./WebLink";
import { getBlobFromEntry } from "./utils";
import { getExtension, getResourceHref } from "./utils";

import notFoundImage from "./images/404-empty-planet.svg";

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
    const href = getResourceHref(resource);
    const entry = this.props.entryMap.get(href);
    const filename = basename(entry.filename);
    const blob = await getBlobFromEntry(entry);
    saveAs(blob, filename);
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
    return(
      <div className="previous-link">
        <Tooltip
          variant="inverse"
          tip={previousItem.title}
          placement="end"
        >
          <Button
            to={`/resources/${previousItem.identifierref ||
              previousItem.identifier}`}
            variant="ghost"
            as={RouterLink}
            innerRef={this.setPreviousButton}
            onClick={this.handlePreviousButtonPressed}
          >
            Previous
          </Button>
        </Tooltip>
      </div>
    );
  };

  renderNextButton = nextItem => {
    return(
      <div className="next-link">
        <Tooltip
          variant="inverse"
          tip={nextItem.title}
          placement="start"
        >
          <Button
            to={`/resources/${nextItem.identifierref ||
              nextItem.identifier}`}
            variant="ghost"
            as={RouterLink}
            innerRef={this.setNextButton}
            onClick={this.handleNextButtonPressed}
          >
            Next
          </Button>
        </Tooltip>
      </div>
    );
  };

  renderAllItemsButton = () => {
    return(
      <Tooltip
        variant="inverse"
        tip="All Items"
        placement="bottom"
      >
        <Button
          to={this.props.allItemsPath}
          variant="ghost"
          as={RouterLink}
          innerRef={this.setAllItemsButton}
          onClick={this.handleAllItemsButtonPressed}
        >
          All Items
        </Button>
      </Tooltip>
    )
  };

  renderResourceDocument = resource => {
    let componentToRender
    const href = getResourceHref(resource)
    const filename = basename(href)
    const extension = getExtension(href).toLowerCase()
    const type = resource.getAttribute('type')

    const components = {
      [resourceTypes.WEB_LINK]: (
        <EntryDocument
          entryMap={this.props.entryMap}
          href={href}
          render={doc => <WebLink doc={doc} />}
          src={this.props.src}
          type="text/xml"
        />
      ),
      [resourceTypes.ASSESSMENT_CONTENT]: (
        <EntryDocument
          entryMap={this.props.entryMap}
          href={href}
          render={doc => <Assessment entryMap={this.props.entryMap} doc={doc} />}
          src={this.props.src}
          type="text/xml"
        />
      ),
      [resourceTypes.ASSIGNMENT]: (
        <EntryDocument
          entryMap={this.props.entryMap}
          href={href}
          render={doc => <Assignment entryMap={this.props.entryMap} doc={doc} />}
          src={this.props.src}
          type="text/xml"
        />
      ),
      [resourceTypes.DISCUSSION_TOPIC]: (
        <EntryDocument
          entryMap={this.props.entryMap}
          href={href}
          render={doc => (
            <Discussion
              entryMap={this.props.entryMap}
              doc={doc}
              resourceIdsByHrefMap={this.props.resourceIdsByHrefMap}
            />
          )}
          src={this.props.src}
          type="text/xml"
        />
      )
    }

    const webComponents = {
      image: <Image href={href} entryMap={this.props.entryMap} />,
      html: (
        <EntryDocument
          entryMap={this.props.entryMap}
          href={href}
          render={doc => (
            <WikiContent
              doc={doc}
              entryMap={this.props.entryMap}
              resourceIdsByHrefMap={this.props.resourceIdsByHrefMap}
            />
          )}
          src={this.props.src}
          type="text/html"
        />
      )
    }

    const downloadComponent = (
      <Billboard
        size="medium"
        message={`Download ${filename}`}
        onClick={this.handleDownload}
        hero={size => <IconDownload size={size} />}
      />
    )

    if (type === resourceTypes.WEB_CONTENT) {
      if (['png', 'jpg', 'gif', 'webp'].includes(extension)) {
        componentToRender = webComponents['image']
      } else if (['html', 'htm'].includes(extension)) {
        componentToRender = webComponents['html']
      }
    }

    if (componentToRender == null) {
      componentToRender = components[type]
    }

    return componentToRender ? componentToRender : downloadComponent
  }

  render() {
    let resource = this.props.resourceMap.get(this.props.identifier);
    const { moduleItems } = this.props;

    if (resource == null) {
      return (
        <Billboard
          size="medium"
          heading={'Not found'}
          hero={size => (
            <img
              alt=""
              style={{ width: '260px', height: '200px' }}
              src={notFoundImage}
            />
          )}
        />
      )
    }

    if (resource.getAttribute('identifierref') != null) {
      resource = this.props.resourceMap.get(resource.getAttribute('identifierref'))
    }

    const href = getResourceHref(resource)
    const currentIndex = moduleItems.findIndex(item => `${item.href}` === href)

    const previousItem = currentIndex > -1 && moduleItems[currentIndex - 1]

    const nextItem = currentIndex > -1 && moduleItems[currentIndex + 1]

    return (
      <React.Fragment>
        <div>
          <Flex wrapItems justifyItems="space-between" margin="0 0 medium">
            <FlexItem padding="small">
              {previousItem && this.renderPreviousButton(previousItem)}
            </FlexItem>
            <FlexItem padding="small">
              {this.props.allItemsPath && this.renderAllItemsButton()}
            </FlexItem>
            <FlexItem padding="small">
              {nextItem && this.renderNextButton(nextItem)}
            </FlexItem>
          </Flex>
        </div>
        <div
          style={{
            clear: 'both'
          }}
        >
          {this.renderResourceDocument(resource)}
        </div>
      </React.Fragment>
    )
  }
}
