import React, { Component } from "react";
import createDOMPurify from "dompurify";
import {
  CC_FILE_PREFIX,
  CC_FILE_PREFIX_OLD,
  CC_FILE_OLDFIX_DECODED,
  CC_FILE_PREFIX_DECODED,
  WIKI_REFERENCE,
  WIKI_REFERENCE_DECODED,
  CANVAS_COURSE_REFERENCE,
  CANVAS_OBJECT_REFERENCE,
  resourceTypeToHref
} from "./constants";
import { getFileResourcePath, mathJaxTypeset } from "./utils";
import Text from "@instructure/ui-elements/lib/components/Text";
import _ from "lodash";

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
    const fragment = DOMPurify.sanitize(this.props.html, {
      ADD_TAGS: ["iframe"],
      RETURN_DOM_FRAGMENT: true,
      RETURN_DOM_IMPORT: true
    });

    const pagesCourseNavigation = RegExp(`${WIKI_REFERENCE}/pages/$`);
    {
      const wikiExp = RegExp(`${WIKI_REFERENCE}/(pages)/(.*)`);
      const links = Array.from(fragment.querySelectorAll("a[href]"))
        .map(link => {
          const href = link.getAttribute("href");
          if (href.includes(WIKI_REFERENCE_DECODED)) {
            link.setAttribute(
              "href",
              href.replace(WIKI_REFERENCE_DECODED, WIKI_REFERENCE)
            );
          }
          return link;
        })
        .filter(
          link =>
            wikiExp.test(link.getAttribute("href")) &&
            pagesCourseNavigation.test(link.getAttribute("href")) === false
        );
      await Promise.all(
        links.map(async link => {
          const slug = (link.getAttribute("href") || "")
            .split("?")[0]
            .match(wikiExp)[2];
          const href = `wiki_content/${slug}.html`;
          if (
            this.props.resourceIdsByHrefMap &&
            this.props.resourceIdsByHrefMap.has(href)
          ) {
            const resourceId = this.props.resourceIdsByHrefMap.get(href);
            link.setAttribute("href", `#/resources/${resourceId}`);
          } else if (slug) {
            link.setAttribute("href", `#/resources/${slug}`);
          } else {
            link.setAttribute("href", `#/resources/unavailable`);
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
            const href = link.getAttribute("href") || "";
            const isModuleLink = href.includes("/modules/");
            if (isModuleLink) {
              link.setAttribute("href", "#/");
            } else {
              const resourceId = href.split("?")[0].match(moduleExp)[2];
              link.setAttribute("href", `#/resources/${resourceId}`);
            }
          })
      );
    }

    {
      const links = Array.from(fragment.querySelectorAll("a[href]"));
      const moduleExp = RegExp(`${CANVAS_COURSE_REFERENCE}/(.*)`);
      await Promise.all(
        links
          .filter(
            link =>
              moduleExp.test(link.getAttribute("href")) ||
              pagesCourseNavigation.test(link.getAttribute("href"))
          )
          .map(async link => {
            const resourceType = link.getAttribute("title");
            if (typeof resourceTypeToHref[resourceType] === "string") {
              link.setAttribute("href", resourceTypeToHref[resourceType]);
            } else {
              link.setAttribute("href", `#/course/navigation`);
            }
          })
      );
    }

    {
      const links = Array.from(fragment.querySelectorAll("a[href]"));
      const fileExpOld = RegExp(`${CC_FILE_PREFIX_OLD}/(.*)`);
      const fileExp = RegExp(`${CC_FILE_PREFIX}/(.*)`);
      const fileOldDecoded = RegExp(
        `${_.escapeRegExp(CC_FILE_OLDFIX_DECODED)}/(.*)`
      );
      const fileExpDecoded = RegExp(
        `${_.escapeRegExp(CC_FILE_PREFIX_DECODED)}/(.*)`
      );
      const queryStringExp = /\?(.*)/;
      await Promise.all(
        links
          .filter(
            link =>
              fileExpOld.test(link.getAttribute("href")) ||
              fileExp.test(link.getAttribute("href")) ||
              fileOldDecoded.test(link.getAttribute("href")) ||
              fileExpDecoded.test(link.getAttribute("href"))
          )
          .map(async link => {
            const resourceHref = getFileResourcePath(
              link.getAttribute("href")
            ).replace(queryStringExp, "");
            const resourceId = this.props.resourceIdsByHrefMap.get(
              decodeURIComponent(resourceHref)
            );
            link.setAttribute("href", `#/resources/${resourceId}`);
          })
      );
    }

    {
      const links = Array.from(fragment.querySelectorAll("a[href]"));
      await Promise.all(
        links
          .filter(link => link.host !== window.location.host)
          .map(async link => {
            link.setAttribute("target", `_blank`);
            link.setAttribute("rel", "noopener noreferrer");
          })
      );
    }

    const isCartridgeFile = img =>
      img.getAttribute("src") &&
      (img.getAttribute("src").indexOf(CC_FILE_PREFIX_OLD) > -1 ||
        img.getAttribute("src").indexOf(CC_FILE_PREFIX) > -1 ||
        img.getAttribute("src").indexOf(CC_FILE_OLDFIX_DECODED) > -1 ||
        img.getAttribute("src").indexOf(CC_FILE_PREFIX_DECODED) > -1);
    const images = Array.from(fragment.querySelectorAll("img")).filter(
      isCartridgeFile
    );

    await Promise.all(
      images.map(async img => {
        const src = img.getAttribute("src").split("?")[0];
        const relativePath = getFileResourcePath(src);
        const url = await this.props.getUrlForPath(relativePath);
        if (url != null) {
          img.setAttribute("src", url);
        }
      })
    );

    if (this.contentNode) {
      this.contentNode.appendChild(fragment);
    }
    setTimeout(mathJaxTypeset, 0);
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
