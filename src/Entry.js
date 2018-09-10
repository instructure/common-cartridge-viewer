import { basename } from "path";
import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import { saveAs } from "file-saver/FileSaver";
import Billboard from "@instructure/ui-billboard/lib/components/Billboard";
import IconDownload from "@instructure/ui-icons/lib/Line/IconDownload";
import Button from "@instructure/ui-buttons/lib/components/Button";
import Tooltip from "@instructure/ui-overlays/lib/components/Tooltip";

import Image from "./Image";
import Assignment from "./Assignment";
import Discussion from "./Discussion";
import Assessment from "./Assessment";
import WikiContent from "./WikiContent";
import EntryDocument from "./EntryDocument";
import WebLink from "./WebLink";
import { getBlobFromEntry, getExtension } from "./utils";

import notFoundImage from "./images/404-empty-planet.svg";

export default class WebResource extends Component {
  constructor() {
    super();
    this.state = {
      isNotFound: false
    };
  }

  async componentDidMount() {
    const entry = this.props.entryMap.get(this.props.href.substr(1));
    if (entry == null) {
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
    const extension = (getExtension(this.props.href) || "").toLowerCase();
    const filename = basename(this.props.href);

    if (this.state.isNotFound) {
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

    let resource;

    if (["png", "jpg", "gif", "webp"].includes(extension)) {
      resource = (
        <Image href={this.props.href} entryMap={this.props.entryMap} />
      );
    } else if (["html"].includes(extension)) {
      resource = (
        <EntryDocument
          href={this.props.href}
          src={this.props.src}
          entryMap={this.props.entryMap}
          type="text/html"
          render={doc => (
            <WikiContent entryMap={this.props.entryMap} doc={doc} />
          )}
        />
      );
    } else if (["qti"].includes(extension)) {
      resource = (
        <Assessment entryMap={this.props.entryMap} href={this.props.href} />
      );
    } else if (["xml"].includes(extension)) {
      resource = (
        <EntryDocument
          href={this.props.href}
          src={this.props.src}
          entryMap={this.props.entryMap}
          type="text/xml"
          render={doc => {
            if (
              doc.querySelector("assignment") &&
              doc.querySelector("assignment").getAttribute("xmlns") ===
                "http://www.imsglobal.org/xsd/imscc_extensions/assignment"
            ) {
              return <Assignment doc={doc} entryMap={this.props.entryMap} />;
            } else if (
              doc.querySelector("topic") &&
              doc.querySelector("topic").getAttribute("xmlns") ===
                "http://www.imsglobal.org/xsd/imsccv1p1/imsdt_v1p1"
            ) {
              return <Discussion doc={doc} entryMap={this.props.entryMap} />;
            } else if (
              doc.querySelector("questestinterop") &&
              doc.querySelector("questestinterop").getAttribute("xmlns") ===
                "http://www.imsglobal.org/xsd/ims_qtiasiv1p2"
            ) {
              return <Assessment doc={doc} entryMap={this.props.entryMap} />;
            } else if (
              doc.querySelector("url") &&
              doc.firstChild.getAttribute("xmlns") ===
                "http://www.imsglobal.org/xsd/imsccv1p1/imswl_v1p1"
            ) {
              return <WebLink doc={doc} />;
            }

            return <div>Not supported.</div>;
          }}
        />
      );
    } else {
      // file
      resource = (
        <Billboard
          size="medium"
          message={`Download ${filename}`}
          onClick={this.handleDownload}
          hero={size => <IconDownload size={size} />}
        />
      );
    }

    const currentIndex = this.props.moduleItems.findIndex(
      item => `/${item.href}` === this.props.href
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
                    to={`/${previousItem.href}`}
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
                    to={`/${nextItem.href}`}
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
          {resource}
        </div>
      </React.Fragment>
    );
  }
}
