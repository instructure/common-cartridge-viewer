import React, { Component } from "react";
import { getBlobFromEntry, blobToDataUrl } from "./utils";
import createDOMPurify from "dompurify";
import {
  CC_FILE_PREFIX,
  CC_FILE_PREFIX_OLD,
  WIKI_REFERENCE,
  CANVAS_COURSE_REFERENCE,
  CANVAS_OBJECT_REFERENCE
} from "./constants";
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

    {
      const links = Array.from(fragment.querySelectorAll("a[href]"));
      const wikiExp = RegExp(`${WIKI_REFERENCE}/(pages)/(.*)`);
      await Promise.all(
        links
          .filter(link => wikiExp.test(link.getAttribute("href")))
          .map(async link => {
            const slug = (link.getAttribute("href") || "").match(wikiExp)[2];
            const href = `wiki_content/${slug}.html`;
            const entry = this.props.entryMap.get(href);
            if (entry && this.props.resourceIdsByHrefMap.has(href)) {
              const resourceId = this.props.resourceIdsByHrefMap.get(href);
              link.setAttribute("href", `#/resources/${resourceId}`);
            }
          })
      );
    }

    {
      const links = Array.from(fragment.querySelectorAll("a[href]"));
      const moduleExp = RegExp(`${CANVAS_OBJECT_REFERENCE}/(.*)/(.*)`);
      await Promise.all(
        links
          .filter(link => moduleExp.test(link.getAttribute("href")))
          .map(async link => {
            const resourceId = (link.getAttribute("href") || "").match(
              moduleExp
            )[2];
            link.setAttribute("href", `#/resources/${resourceId}`);
          })
      );
    }

    {
      const links = Array.from(fragment.querySelectorAll("a[href]"));
      const moduleExp = RegExp(`${CANVAS_COURSE_REFERENCE}/(.*)/(.*)`);
      await Promise.all(
        links
          .filter(link => moduleExp.test(link.getAttribute("href")))
          .map(async link => {
            const resourceId = (link.getAttribute("href") || "").match(
              moduleExp
            )[2];
            link.setAttribute("href", `#/resources/${resourceId}`);
          })
      );
    }

    const images = Array.from(fragment.querySelectorAll("img"));
    await Promise.all(
      images
        .filter(
          img =>
            img.getAttribute("src") &&
            (img.getAttribute("src").indexOf(CC_FILE_PREFIX_OLD) > -1 ||
              img.getAttribute("src").indexOf(CC_FILE_PREFIX) > -1)
        )
        .map(async img => {
          const src = img.getAttribute("src").split("?")[0];
          const entryKey = src
            .replace(CC_FILE_PREFIX_OLD, "web_resources")
            .replace(CC_FILE_PREFIX, "web_resources");
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
