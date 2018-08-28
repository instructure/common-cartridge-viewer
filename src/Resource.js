import { basename } from "path";
import React, { Component } from "react";
import { saveAs } from "file-saver/FileSaver";
import Billboard from "@instructure/ui-billboard/lib/components/Billboard";
import IconDownload from "@instructure/ui-icons/lib/Line/IconDownload";

import Image from "./Image";
import Assignment from "./Assignment";
import Discussion from "./Discussion";
import Assessment from "./Assessment";
import WikiContent from "./WikiContent";
import EntryDocument from "./EntryDocument";
import WebLink from "./WebLink";
import { getBlobFromEntry } from "./utils";

export default class WebResource extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  async componentDidMount() {
    const extension = (getExtension(this.props.href) || "").toLowerCase();

    if (
      ["png", "jpg", "gif", "webp", "html", "qti", "xml"].includes(
        extension
      ) === false
    ) {
      const entry = this.props.entryMap.get(this.props.href.substr(1));

      const filename = basename(entry.filename);

      const blob = await getBlobFromEntry(entry);

      saveAs(blob, filename);
    }
  }

  render() {
    const extension = (getExtension(this.props.href) || "").toLowerCase();

    const filename = basename(this.props.href);

    if (["png", "jpg", "gif", "webp"].includes(extension)) {
      return <Image href={this.props.href} entryMap={this.props.entryMap} />;
    }

    if (["html"].includes(extension)) {
      return (
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
    }

    if (["qti"].includes(extension)) {
      return (
        <Assessment entryMap={this.props.entryMap} href={this.props.href} />
      );
    }

    if (["xml"].includes(extension)) {
      return (
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
            }

            if (
              doc.querySelector("topic") &&
              doc.querySelector("topic").getAttribute("xmlns") ===
                "http://www.imsglobal.org/xsd/imsccv1p1/imsdt_v1p1"
            ) {
              return <Discussion doc={doc} entryMap={this.props.entryMap} />;
            }

            if (
              doc.querySelector("questestinterop") &&
              doc.querySelector("questestinterop").getAttribute("xmlns") ===
                "http://www.imsglobal.org/xsd/ims_qtiasiv1p2"
            ) {
              return <Assessment doc={doc} entryMap={this.props.entryMap} />;
            }

            if (
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
    }

    return (
      <div>
        <Billboard
          size="medium"
          message={`Downloading ${filename}`}
          hero={size => <IconDownload size={size} />}
        />
      </div>
    );
  }
}

function getExtension(uri) {
  return uri.split(".").pop();
}
