import {
  resourceTypes,
  submissionTypes,
  moduleMetaContentTypes,
  WIKI_CONTENT_HREF_PREFIX
} from "./constants";
import { i18n } from "./index";
import { t } from "@lingui/macro";

const zip = window.zip;

export const pipe = (g, f) => x => f(g(x));

export function getReaderFromXHR(url) {
  const request = new XMLHttpRequest();
  const promise = new Promise((resolve, reject) => {
    request.open("GET", url, true);
    request.responseType = "blob";
    request.onload = function() {
      resolve(request.response);
    };
    request.send();
  });
  return { request, promise };
}

export async function getTextFromEntry(entry) {
  return new Promise((resolve, reject) => {
    entry.getData(new zip.TextWriter(), resolve);
  });
}

export async function getBlobFromEntry(entry) {
  if (entry == null || entry.getData == null) {
    console.warn("entry is missing");
  }
  return new Promise((resolve, reject) => {
    entry.getData(new zip.BlobWriter(), resolve);
  });
}

export function getEntriesFromBlob(blob) {
  return new Promise((resolve, reject) => {
    window.zip.createReader(
      new zip.BlobReader(blob),
      zipReader => {
        zipReader.getEntries(resolve);
      },
      reject
    );
  });
}

export function getEntriesFromXHR(file) {
  const { request, promise: readerPromise } = getReaderFromXHR(file);

  const promise = readerPromise.then(
    blob =>
      new Promise((resolve, reject) => {
        window.zip.createReader(
          new zip.BlobReader(blob),
          zipReader => {
            zipReader.getEntries(resolve);
          },
          reject
        );
      })
  );
  return [request, promise];
}

export async function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = event => {
      resolve(event.target.result);
    };
    reader.readAsDataURL(blob);
  });
}

export function getResourceHref(resource) {
  const resourceHrefAttribute = resource.getAttribute("href");
  if (resourceHrefAttribute) {
    return resourceHrefAttribute;
  }
  const fileNode = resource.querySelector("file");
  const fileNodeHrefAttribute =
    fileNode != null && fileNode.getAttribute("href");
  if (fileNodeHrefAttribute) {
    return fileNodeHrefAttribute;
  }
  return null;
}

export function getExtension(uri) {
  return uri.split(".").pop();
}

function $text(document, selector) {
  const node = document.querySelector(selector);
  return node && node.textContent;
}

export function parseXml(xml) {
  const parser = new DOMParser();
  return parser.parseFromString(xml, "text/xml");
}

export function parseManifestDocument(manifest, { moduleMeta }) {
  const title = $text(manifest, "metadata > lom > general > title > string");
  const schema = $text(manifest, "metadata > schema");
  const schemaVersion = $text(manifest, "metadata > schemaversion");
  const rightsDescription = $text(
    manifest,
    "metadata > lom > rights > description"
  );
  const resources = Array.from(
    manifest.querySelectorAll("resources > resource")
  );
  const resourceMap = new Map(
    resources.map(resource => [resource.getAttribute("identifier"), resource])
  );
  const resourceIdsByHrefMap = new Map(
    resources
      .filter(resource => resource.getAttribute("href") != null)
      .map(resource => [
        resource.getAttribute("href"),
        resource.getAttribute("identifier")
      ])
  );
  const otherResources = resources
    .filter(isNot(resourceTypes.DISCUSSION_TOPIC))
    .filter(isNot(resourceTypes.ASSIGNMENT))
    .filter(isNot(resourceTypes.ASSOCIATED_CONTENT))
    .filter(isNot(resourceTypes.ASSESSMENT_CONTENT))
    .filter(isNot(resourceTypes.WEB_CONTENT));
  const discussionResources = resources
    .filter(is(resourceTypes.DISCUSSION_TOPIC))
    .filter(node => node.querySelector("file"));
  const pageResources = resources
    .filter(is(resourceTypes.WEB_CONTENT))
    .filter(node => {
      const isFallback = node.getAttribute("identifier").endsWith("_fallback");
      if (isFallback) {
        const identifier = node
          .getAttribute("identifier")
          .split("_fallback")[0];
        const resource = manifest.querySelector(
          `resource[identifier="${identifier}"]`
        );
        if (resource != null) {
          return false;
        }
      }
      return true;
    })
    .filter(node => node.querySelector("file"))
    // needs filter to filter out dependencies
    .filter(node => {
      const href = node.getAttribute("href");
      return (
        typeof href === "string" && href.includes(WIKI_CONTENT_HREF_PREFIX)
      );
    });
  const fileResources = resources
    .filter(is(resourceTypes.WEB_CONTENT))
    .filter(node => node.querySelector("file"))
    .filter(
      node =>
        typeof node.getAttribute("href") === "string" &&
        node.getAttribute("href").startsWith("web_resources/")
    );

  const assessmentResources = resources
    .filter(is(resourceTypes.ASSESSMENT_CONTENT))
    .filter(node => node.querySelector("file"));
  const assignmentResources = resources
    .filter(is(resourceTypes.ASSIGNMENT))
    .filter(node => node.querySelector("file"));
  const associatedContentAssignmentResources = resources
    .filter(is(resourceTypes.ASSOCIATED_CONTENT))
    .filter(node =>
      Array.from(node.querySelectorAll("file")).some(file =>
        file.getAttribute("href").includes("assignment_settings.xml")
      )
    );
  const associatedContentAssignmentHrefsSet = new Set(
    associatedContentAssignmentResources.map(resource =>
      Array.from(resource.querySelectorAll("file"))
        .find(file =>
          file.getAttribute("href").includes("assignment_settings.xml")
        )
        .getAttribute("href")
    )
  );

  const showcaseResources = [].concat(
    pageResources,
    discussionResources,
    assessmentResources,
    assignmentResources,
    associatedContentAssignmentResources
  );
  const modules = Array.from(
    manifest.querySelectorAll("organizations > organization > item > item")
  )
    .filter(item => item.querySelector("title"))
    .map(item => {
      const title = item.querySelector("title").textContent;
      const moduleIdentifier = item.getAttribute("identifier");
      const itemNodes = Array.from(item.querySelectorAll("item"));
      const items = itemNodes.map(item => {
        const identifier = item.getAttribute("identifier");
        const title = item.querySelector("title")
          ? item.querySelector("title").textContent
          : i18n._(t`Untitled`);
        const identifierref = item.getAttribute("identifierref");
        if (identifierref == null) {
          return { title };
        }
        const resource = manifest.querySelector(
          `resource[identifier="${identifierref}"]`
        );
        if (resource == null) {
          if (moduleMeta) {
            const moduleNode = moduleMeta.querySelector(
              `modules > module[identifier="${moduleIdentifier}"]`
            );
            const moduleMetaItem = Array.from(
              moduleNode.querySelectorAll("items > item")
            ).find(item => item.getAttribute("identifier") === identifierref);
            const moduleMetaItemContentType = moduleMetaItem
              ? $text(moduleMetaItem, "content_type")
              : "";
            const isExternalTool =
              moduleMetaItemContentType ===
              moduleMetaContentTypes.CONTENT_EXTERNAL_TOOL;
            if (isExternalTool) {
              return {
                title,
                type: resourceTypes.EXTERNAL_TOOL,
                href: "#/external/tool"
              };
            }
          }
          return {
            title
          };
        }
        const type = resource.getAttribute("type");
        const href = getResourceHref(resource);
        const dependencyHrefs = Array.from(
          resource.querySelectorAll("dependency")
        ).map(node => {
          const identifier = node.getAttribute("identifierref");
          const resource = manifest.querySelector(
            `resource[identifier="${identifier}"]`
          );
          return getResourceHref(resource);
        });
        return {
          dependencyHrefs,
          href,
          identifier,
          identifierref,
          title,
          type
        };
      });

      return { title, identifier: moduleIdentifier, items };
    })
    .filter(module => module != null);

  const moduleItems = modules.reduce((state, module) => {
    return state.concat(module.items.filter(item => item.href != null));
  }, []);
  const externalViewersFileNode = manifest.querySelector(
    `resource[href="course_settings/canvas_export.txt"] file[href="course_settings/external_viewers.xml"]`
  );
  const hasExternalViewers =
    externalViewersFileNode && externalViewersFileNode.getAttribute("href");

  return {
    assessmentResources,
    assignmentResources,
    associatedContentAssignmentHrefsSet,
    associatedContentAssignmentResources,
    discussionResources,
    fileResources,
    hasExternalViewers,
    moduleItems,
    modules,
    otherResources,
    pageResources,
    resourceIdsByHrefMap,
    resourceMap,
    resources,
    rightsDescription,
    schema,
    schemaVersion,
    showcaseResources,
    title
  };
}

function is(type) {
  return resource => resource.getAttribute("type") === type;
}

function isNot(type) {
  return resource => resource.getAttribute("type") !== type;
}

export function generateFriendlyStringFromSubmissionFormats(submissionType) {
  const submissionTypeLabels = {
    [submissionTypes.ONLINE_UPLOAD]: i18n._(t`a file upload`),
    [submissionTypes.ONLINE_TEXT_ENTRY]: i18n._(`a text entry box`),
    [submissionTypes.ONLINE_URL]: i18n._(`a website url`),
    [submissionTypes.MEDIA_RECORDING]: i18n._(`a media recording`),
    [submissionTypes.ON_PAPER]: i18n._(`on paper`),
    [submissionTypes.NONE]: i18n._(`Nothing`)
  };

  const SUBMISSION_TYPE_JOIN_STRING = i18n._(`, or `);

  const submissionTypeToSubmissionLabel = submissionType =>
    Object.keys(submissionTypeLabels).includes(submissionType)
      ? submissionTypeLabels[submissionType]
      : "";

  return submissionType === submissionTypes.NONE
    ? submissionTypeLabels[submissionTypes.NONE]
    : submissionType
        .split(",")
        .map(submissionTypeToSubmissionLabel)
        .filter(submissionTypeLabel => submissionTypeLabel.length > 0) // get rid of submission types we couldn't find.
        .join(SUBMISSION_TYPE_JOIN_STRING);
}

export function getAssignmentSettingsHref(identifier) {
  return `${identifier}/assignment_settings.xml`;
}

export function getAssignmentListResources(resources) {
  return resources
    .filter(node => node.querySelector("file"))
    .map(node => ({
      identifier: node.getAttribute("identifier"),
      href: node.querySelector("file").getAttribute("href"),
      dependencyHrefs: Array.from(node.querySelectorAll("dependency")).map(
        node => {
          const identifier = node.getAttribute("identifierref");
          const resource = this.props.resourceMap.get(identifier);
          return getResourceHref(resource);
        }
      )
    }));
}
