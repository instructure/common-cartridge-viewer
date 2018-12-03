import { resourceTypes } from "./constants";
const zip = window.zip;

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
  const node = document.querySelector(
    "metadata > lom > general > title > string"
  );
  return node && node.textContent;
}

export function getResourcesFromXml(xml) {
  const parser = new DOMParser();
  const manifest = parser.parseFromString(xml, "text/xml");
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
      const extension = getExtension(
        node.querySelector("file").getAttribute("href")
      );
      return ["html", "htm"].includes(extension);
    });
  const fileResources = resources
    .filter(is(resourceTypes.WEB_CONTENT))
    .filter(node => node.querySelector("file"));
  const assessmentResources = resources
    .filter(is(resourceTypes.ASSESSMENT_CONTENT))
    .filter(node => node.querySelector("file"));
  const assignmentResources = resources
    .filter(is(resourceTypes.ASSIGNMENT))
    .filter(node => node.querySelector("file"));
  const showcaseResources = [].concat(
    pageResources,
    discussionResources,
    assessmentResources,
    assignmentResources
  );
  const modules = Array.from(
    manifest.querySelectorAll("organizations > organization > item > item")
  )
    .filter(item => item.querySelector("title"))
    .map(item => {
      const title = item.querySelector("title").textContent;
      const identifier = item.getAttribute("identifier");
      const itemNodes = Array.from(item.querySelectorAll("item"));
      const items = itemNodes.map(item => {
        const identifier = item.getAttribute("identifier");
        const title = item.querySelector("title")
          ? item.querySelector("title").textContent
          : "Untitled";
        const identifierref = item.getAttribute("identifierref");
        if (identifierref == null) {
          return { title };
        }
        const resource = manifest.querySelector(
          `resource[identifier="${identifierref}"]`
        );
        if (resource == null) {
          return { title };
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
      return { title, identifier, items };
    })
    .filter(module => module != null);
  const moduleItems = modules.reduce((state, module) => {
    return state.concat(module.items.filter(item => item.href != null));
  }, []);
  return {
    assessmentResources,
    assignmentResources,
    discussionResources,
    resourceMap,
    fileResources,
    moduleItems,
    modules,
    otherResources,
    pageResources,
    resources,
    resourceIdsByHrefMap,
    rightsDescription,
    showcaseResources,
    title,
    schema,
    schemaVersion
  };
}

function is(type) {
  return resource => resource.getAttribute("type") === type;
}

function isNot(type) {
  return resource => resource.getAttribute("type") !== type;
}
