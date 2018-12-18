import { basename } from "path";
import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  resourceTypes,
  DOCUMENT_PREVIEW_EXTENSIONS_SUPPORTED
} from "./constants";
import { saveAs } from "file-saver";
import Billboard from "@instructure/ui-billboard/lib/components/Billboard";
import IconDownload from "@instructure/ui-icons/lib/Line/IconDownload";
import EntryDocument from "./EntryDocument";
import Image from "./Image";
import Assignment from "./Assignment";
import AssociatedContentAssignment from "./AssociatedContentAssignment";
import Discussion from "./Discussion";
import Assessment from "./Assessment";
import WikiContent from "./WikiContent";
import WebLink from "./WebLink";
import {
  getExtension,
  getResourceHref,
  getPreviousAndNextItems,
  isButtonNavigationEnabled
} from "./utils";
import DocumentPreview from "./DocumentPreview";
import ResourceUnavailable from "./ResourceUnavailable";
import NavigationButtonContainer from "./NavigationButtonContainer";

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

  handleNextButtonPressed = () => {
    this.nextButton && this.nextButton.click();
  };

  handlePreviousButtonPressed = () => {
    this.previousButton && this.previousButton.click();
  };

  renderResourceDocument = resource => {
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

    const isImage =
      type === resourceTypes.WEB_CONTENT &&
      ["png", "jpg", "gif", "webp"].includes(extension);
    const isWikiContent =
      type === resourceTypes.WEB_CONTENT && ["htm", "html"].includes(extension);
    const isDocumentWithPreview =
      type === resourceTypes.WEB_CONTENT &&
      DOCUMENT_PREVIEW_EXTENSIONS_SUPPORTED.includes(extension) &&
      this.props.externalViewer != null;

    let componentToRender;
    if (isImage) {
      componentToRender = (
        <Image getUrlForPath={this.props.getUrlForPath} href={href} />
      );
    } else if (isWikiContent) {
      componentToRender = (
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
      );
    } else if (isDocumentWithPreview) {
      componentToRender = (
        <DocumentPreview externalViewer={this.props.externalViewer} />
      );
    } else if (components[type] != null) {
      componentToRender = components[type];
    } else {
      componentToRender = (
        <Billboard
          hero={size => <IconDownload size={size} />}
          message={`Download ${filename}`}
          onClick={this.handleDownload}
          size="medium"
        />
      );
    }
    return componentToRender;
  };

  render() {
    let resource = this.props.resourceMap.get(this.props.identifier);
    const { moduleItems } = this.props;

    if (resource == null) {
      return (
        <ResourceUnavailable
          moduleItems={moduleItems}
          identifier={this.props.identifier}
          location={this.props.location}
        />
      );
    }

    if (resource.getAttribute("identifierref") != null) {
      resource = this.props.resourceMap.get(
        resource.getAttribute("identifierref")
      );
    }

    const href = getResourceHref(resource);
    const [previousItem, nextItem] = getPreviousAndNextItems(moduleItems, href);
    const buttonNavigationEnabled = isButtonNavigationEnabled(
      this.props.location
    );

    return (
      <React.Fragment>
        <div>
          <NavigationButtonContainer
            buttonNavigationEnabled={buttonNavigationEnabled}
            previousItem={previousItem}
            nextItem={nextItem}
            location={this.props.location}
          />
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
