import { basename } from "path";
import React, { Component } from "react";
import { resourceTypes } from "./constants";
import { Link as RouterLink } from "react-router-dom";
import { saveAs } from "file-saver/FileSaver";
import Billboard from "@instructure/ui-billboard/lib/components/Billboard";
import IconDownload from "@instructure/ui-icons/lib/Line/IconDownload";
import Button from "@instructure/ui-buttons/lib/components/Button";
import Tooltip from "@instructure/ui-overlays/lib/components/Tooltip";

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
  constructor() {
    super();
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
      const link = document.querySelector(".previous-link a");
      if (link != null) {
        link.click();
      }
      event.preventDefault();
    } else if (event.which === 39) {
      const link = document.querySelector(".next-link a");
      if (link != null) {
        link.click();
      }
      event.preventDefault();
    }
  };

  handleDownload = async () => {
    const entry = this.props.entryMap.get(this.props.href.substr(1));
    const filename = basename(entry.filename);
    const blob = await getBlobFromEntry(entry);
    saveAs(blob, filename);
  };

  componentWillUnmount() {
    document.body.removeEventListener("keydown", this.handleKeyDown);
  }

  render() {
    let resource = this.props.resourceMap.get(this.props.identifier);
    if (resource == null) {
      return (
        <Billboard
          size="medium"
          heading={"Not found"}
          hero={size => (
            <img
              alt=""
              style={{ width: "260px", height: "200px" }}
              src={notFoundImage}
            />
          )}
        />
      );
    }

    const href = getResourceHref(resource);
    const filename = basename(href);
    const extension = getExtension(href).toLowerCase();
    if (resource.getAttribute("identifierref") != null) {
      resource = this.props.resourceMap.get(
        resource.getAttribute("identifierref")
      );
    }

    let resourceComponent;
    if (resource.getAttribute("type") === resourceTypes.WEB_LINK) {
      resourceComponent = (
        <EntryDocument
          entryMap={this.props.entryMap}
          href={href}
          render={doc => <WebLink doc={doc} />}
          src={this.props.src}
          type="text/xml"
        />
      );
    } else if (
      resource.getAttribute("type") === resourceTypes.ASSESSMENT_CONTENT
    ) {
      resourceComponent = (
        <EntryDocument
          entryMap={this.props.entryMap}
          href={href}
          render={doc => (
            <Assessment entryMap={this.props.entryMap} doc={doc} />
          )}
          src={this.props.src}
          type="text/xml"
        />
      );
    } else if (resource.getAttribute("type") === resourceTypes.ASSIGNMENT) {
      resourceComponent = (
        <EntryDocument
          entryMap={this.props.entryMap}
          href={href}
          render={doc => (
            <Assignment entryMap={this.props.entryMap} doc={doc} />
          )}
          src={this.props.src}
          type="text/xml"
        />
      );
    } else if (
      resource.getAttribute("type") === resourceTypes.DISCUSSION_TOPIC
    ) {
      resourceComponent = (
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
      );
    } else if (resource.getAttribute("type") === resourceTypes.WEB_CONTENT) {
      if (["png", "jpg", "gif", "webp"].includes(extension)) {
        return <Image href={href} entryMap={this.props.entryMap} />;
      }

      if (["html", "htm"].includes(extension)) {
        resourceComponent = (
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
        );
      } else {
        resourceComponent = (
          <Billboard
            size="medium"
            message={`Download ${filename}`}
            onClick={this.handleDownload}
            hero={size => <IconDownload size={size} />}
          />
        );
      }
    }

    const currentIndex = this.props.moduleItems.findIndex(
      item => `${item.href}` === href
    );
    const previousItem =
      currentIndex > -1 && this.props.moduleItems[currentIndex - 1];
    const nextItem =
      currentIndex > -1 && this.props.moduleItems[currentIndex + 1];

    return (
      <React.Fragment>
        {(previousItem || nextItem) && (
          <div>
            {previousItem && (
              <div className="previous-link" style={{ float: "left" }}>
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
                  >
                    Previous
                  </Button>
                </Tooltip>
              </div>
            )}

            {nextItem && (
              <div className="next-link" style={{ float: "right" }}>
                <Tooltip
                  variant="inverse"
                  tip={nextItem.title}
                  placement="start"
                >
                  <Button
                    as={RouterLink}
                    to={`/resources/${nextItem.identifierref ||
                      nextItem.identifier}`}
                    variant="ghost"
                  >
                    Next
                  </Button>
                </Tooltip>
              </div>
            )}
          </div>
        )}

        <div
          style={{
            clear: "both",
            paddingTop: previousItem || nextItem ? "16px" : "0"
          }}
        >
          {resourceComponent}
        </div>
      </React.Fragment>
    );
  }
}
