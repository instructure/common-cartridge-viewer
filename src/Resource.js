import { basename } from "path";
import React, { Component } from "react";
import {
  resourceTypes,
  DOCUMENT_PREVIEW_EXTENSIONS_SUPPORTED,
  NOTORIOUS_EXTENSIONS_SUPPORTED
} from "./constants";
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
import EmbeddedPreview from "./EmbeddedPreview";
import ResourceUnavailable from "./ResourceUnavailable";
import PreviewUnavailable from "./PreviewUnavailable";

export default class Resource extends Component {
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

  makeNavigationButtonHrefFromModule = module =>
    this.props.isModuleItem
      ? `/module-items/${module.identifierref || module.identifier}`
      : `/resources/${module.identifierref || module.identifier}`;

  renderPreviousButton = previousItem => {
    return (
      <div className="previous-link">
        <Tooltip variant="inverse" tip={previousItem.title} placement="end">
          <Button
            to={{
              pathname: this.makeNavigationButtonHrefFromModule(previousItem)
            }}
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
            to={{
              pathname: this.makeNavigationButtonHrefFromModule(nextItem)
            }}
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
              rubrics={this.props.rubrics || false}
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
      ["png", "jpg", "jpeg", "gif", "webp"].includes(extension);
    const isWikiContent =
      type === resourceTypes.WEB_CONTENT && ["htm", "html"].includes(extension);
    const isDocumentWithPreview =
      type === resourceTypes.WEB_CONTENT &&
      [
        ...DOCUMENT_PREVIEW_EXTENSIONS_SUPPORTED,
        ...NOTORIOUS_EXTENSIONS_SUPPORTED
      ].includes(extension) &&
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
        <EmbeddedPreview externalViewer={this.props.externalViewer} />
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

  deriveResourceHref = resource => {
    if (resource.getAttribute("identifierref") != null) {
      resource = this.props.resourceMap.get(
        resource.getAttribute("identifierref")
      );
    }

    return getResourceHref(resource);
  };

  render() {
    let resource = this.props.resourceMap.get(this.props.identifier);
    const { moduleItems } = this.props;
    const moduleItem = this.props.moduleItems.find(
      moduleItem => moduleItem.identifierref === this.props.identifier
    );

    const isValidExternalToolResource =
      moduleItem !== undefined &&
      moduleItem.type === resourceTypes.EXTERNAL_TOOL;

    if (resource == null && isValidExternalToolResource === false) {
      return <ResourceUnavailable />;
    }

    const href = resource ? this.deriveResourceHref(resource) : moduleItem.href;
    const currentIndex = moduleItems.findIndex(item => `${item.href}` === href);
    const previousItem = currentIndex > -1 && moduleItems[currentIndex - 1];
    const nextItem = currentIndex > -1 && moduleItems[currentIndex + 1];
    return (
      <React.Fragment>
        {this.props.isModuleItem && (previousItem || nextItem) && (
          <Flex margin="0 0 medium">
            <FlexItem padding="small" width="14rem">
              {this.props.isModuleItem &&
                previousItem &&
                this.renderPreviousButton(previousItem)}
            </FlexItem>
            <FlexItem padding="small" width="14rem" grow={true}>
              <Flex justifyItems="end">
                <FlexItem>
                  {this.props.isModuleItem &&
                    nextItem &&
                    this.renderNextButton(nextItem)}
                </FlexItem>
              </Flex>
            </FlexItem>
          </Flex>
        )}

        <div style={{ clear: "both" }}>
          {isValidExternalToolResource ? (
            <PreviewUnavailable />
          ) : (
            this.renderResourceDocument(resource)
          )}
        </div>
      </React.Fragment>
    );
  }
}
