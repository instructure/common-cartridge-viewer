import React, { Component } from "react";
import { getBlobFromEntry, blobToDataUrl } from "./utils";
import createDOMPurify from "dompurify";
import { CC_FILE_PREFIX } from "./constants";
import Text from "@instructure/ui-elements/lib/components/Text";

const DOMPurify = createDOMPurify(window);

export default class RichContent extends Component {
  componentDidMount() {
    this.update();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.html !== this.props.html) {
      this.update();
    }
  }

  async update() {
    if (this.props.entryMap == null) {
      console.warn("this.props.entryMap missing");
      return;
    }

    const fragment = DOMPurify.sanitize(this.props.html, {
      RETURN_DOM_FRAGMENT: true,
      RETURN_DOM_IMPORT: true
    });

    const images = Array.from(fragment.querySelectorAll("img"));

    await Promise.all(
      images
        .filter(
          img =>
            img.getAttribute("src") &&
            img.getAttribute("src").indexOf(CC_FILE_PREFIX) > -1
        )
        .map(async img => {
          const src = img.getAttribute("src").split("?")[0];
          const entryKey = src.replace(CC_FILE_PREFIX, "web_resources");
          const entry = this.props.entryMap.get(decodeURIComponent(entryKey));

          if (entry) {
            const blob = await getBlobFromEntry(entry);
            const dataUrl = await blobToDataUrl(blob);
            img.setAttribute("src", dataUrl);
          }
        })
    );

    if (this.contentNode) {
      this.contentNode.appendChild(fragment);
    }
  }

  setContentRef = node => {
    this.contentNode = node;
  };

  render() {
    return (
      <Text>
        <div className="RichContent" ref={this.setContentRef} />
      </Text>
    );
  }
}
