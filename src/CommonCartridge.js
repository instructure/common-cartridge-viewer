// import "babel-polyfill";

import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  HashRouter as Router,
  Route,
  Link as RouterLink,
  Switch,
  Redirect
} from "react-router-dom";
import Resource from "./Resource";
import RouterObserver from "./RouterObserver";
import Progress from "@instructure/ui-elements/lib/components/Progress";
import Heading from "@instructure/ui-elements/lib/components/Heading";
import Button from "@instructure/ui-buttons/lib/components/Button";
import Breadcrumb, {
  BreadcrumbLink
} from "@instructure/ui-breadcrumb/lib/components/Breadcrumb";
import IconExternalLink from "@instructure/ui-icons/lib/Line/IconExternalLink";
import Link from "@instructure/ui-elements/lib/components/Link";
import Grid, {
  GridRow,
  GridCol
} from "@instructure/ui-layout/lib/components/Grid";
import {
  getTextFromEntry,
  getEntriesFromXHR,
  getEntriesFromBlob,
  getResourceHref
} from "./utils.js";
import { resourceTypes } from "./constants";
import styles from "./styles.css";
import ScreenReaderContent from "@instructure/ui-a11y/lib/components/ScreenReaderContent";
import WikiContentListItem from "./WikiContentListItem";
import AssignmentListItem from "./AssignmentListItem";
import AssessmentListItem from "./AssessmentListItem";
import DiscussionListItem from "./DiscussionListItem";
import FileListItem from "./FileListItem";
import View from "@instructure/ui-layout/lib/components/View";
import Text from "@instructure/ui-elements/lib/components/Text";
import prettyBytes from "./vendor/pretty-bytes";

// https://www.imsglobal.org/cc/ccv1p1/imscc_profilev1p1-Implementation.html

export default class CommonCartridge extends Component {
  static propTypes = {
    src: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      assignments: [],
      assessments: [],
      discussions: [],
      entries: [],
      entryMap: new Map(),
      files: [],
      filter: "organizations",
      isLoaded: false,
      loadProgress: null,
      modules: [],
      pageResources: [],
      otherResources: []
    };
  }

  componentDidMount() {
    if (this.props.file != null) {
      this.getEntriesFromFile();
    } else if (this.props.src != null) {
      this.getEntriesFromSrc();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.src !== prevProps.src) {
      this.setState(
        {
          isLoaded: false,
          filter: "organizations"
        },
        () => this.getEntriesFromSrc()
      );
    }
  }

  handleLoadProgress = event => {
    this.setState({ loadProgress: event });
  };

  async getEntriesFromSrc() {
    const [request, getEntriesPromise] = getEntriesFromXHR(this.props.src);

    request.addEventListener("progress", this.handleLoadProgress);

    const entries = await getEntriesPromise;

    this.setState({ entries }, () => this.loadEntries());
  }

  async getEntriesFromFile() {
    const entries = await getEntriesFromBlob(this.props.file);

    this.setState({ entries }, () => this.loadEntries());
  }

  async loadEntries() {
    const entries = this.state.entries;

    const entryMap = new Map();

    for (let entry of entries) {
      entryMap.set(entry.filename, entry);
    }

    this.setState({ entryMap });

    const manifestEntry = entries.find(
      entry => entry.filename === "imsmanifest.xml"
    );

    if (manifestEntry != null) {
      const parser = new DOMParser();

      const xml = await getTextFromEntry(manifestEntry);

      const manifest = parser.parseFromString(xml, "text/xml");

      const titleNode = manifest.querySelector(
        "metadata > lom > general > title > string"
      );

      const title = titleNode && titleNode.textContent;

      const schemaNode = manifest.querySelector("metadata > schema");

      const schema = schemaNode && schemaNode.textContent;

      const schemaVersionNode = manifest.querySelector(
        "metadata > schemaversion"
      );

      const schemaVersion = schemaVersionNode && schemaVersionNode.textContent;

      const rightDescriptionNode = manifest.querySelector(
        "metadata > lom > rights > description"
      );

      const rightsDescription =
        rightDescriptionNode && rightDescriptionNode.textContent;

      const resources = Array.from(
        manifest.querySelectorAll("resources > resource")
      );

      const supportedResources = resources.filter(resource => {
        const type = resource.getAttribute("type");

        return [
          resourceTypes.DISCUSSION_TOPIC,
          resourceTypes.ASSESSMENT_CONTENT,
          resourceTypes.ASSIGNMENT,
          resourceTypes.WEB_CONTENT
        ].includes(type);
      });

      const otherResources = resources
        .filter(isNot(resourceTypes.DISCUSSION_TOPIC))
        .filter(isNot(resourceTypes.ASSIGNMENT))
        .filter(isNot(resourceTypes.ASSESSMENT_CONTENT))
        .filter(isNot(resourceTypes.WEB_CONTENT))
        .filter(isNot(resourceTypes.ASSOCIATED_CONTENT));

      // discussions

      const discussionResources = resources
        .filter(is(resourceTypes.DISCUSSION_TOPIC))
        .filter(node => node.querySelector("file"))
        .map(node => ({
          href: node.querySelector("file").getAttribute("href"),
          dependencyHrefs: Array.from(node.querySelectorAll("dependency")).map(
            node => {
              const identifier = node.getAttribute("identifierref");

              const resource = manifest.querySelector(
                `resource[identifier="${identifier}"]`
              );

              return getResourceHref(resource);
            }
          )
        }));

      // pages

      const pageResources = resources
        .filter(is(resourceTypes.WEB_CONTENT))
        .filter(node => {
          const isFallback = node
            .getAttribute("identifier")
            .endsWith("_fallback");

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
        .map(node => ({
          href: node.querySelector("file").getAttribute("href")
        }))
        // needs filter to filter out dependencies
        .filter(({ href }) => {
          const extension = getExtension(href);

          return ["html", "htm"].includes(extension);
        });

      // files

      const fileResources = resources
        .filter(is(resourceTypes.WEB_CONTENT))
        .filter(node => node.querySelector("file"))
        .map(node => ({
          href: node.querySelector("file").getAttribute("href"),
          metadata: node.querySelector("metadata")
        }))
        // needs filter to filter out dependencies
        .filter(({ href }) => {
          const extension = getExtension(href);

          return ["html", "htm"].includes(extension) === false;
        });

      const assessmentResources = resources
        .filter(is(resourceTypes.ASSESSMENT_CONTENT))
        .filter(node => node.querySelector("file"))
        .map(node => ({
          href: node.querySelector("file").getAttribute("href"),
          dependencyHrefs: Array.from(node.querySelectorAll("dependency")).map(
            node => {
              const identifier = node.getAttribute("identifierref");

              const resource = manifest.querySelector(
                `resource[identifier="${identifier}"]`
              );

              return getResourceHref(resource);
            }
          )
        }));

      const assignmentResources = resources
        .filter(is(resourceTypes.ASSIGNMENT))
        .filter(node => node.querySelector("file"))
        .map(node => ({
          href: node.querySelector("file").getAttribute("href"),
          dependencyHrefs: Array.from(node.querySelectorAll("dependency")).map(
            node => {
              const identifier = node.getAttribute("identifierref");

              const resource = manifest.querySelector(
                `resource[identifier="${identifier}"]`
              );

              return getResourceHref(resource);
            }
          )
        }));

      // organizations

      const modules = Array.from(
        manifest.querySelectorAll("organizations > organization > item")
      )
        .filter(item => item.querySelector("title"))
        .map(item => {
          const title = item.querySelector("title").textContent;

          const itemNodes = Array.from(item.querySelectorAll("item"));

          const items = itemNodes.map(item => {
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
              title,
              href,
              type,
              dependencyHrefs
            };
          });

          return { title, items };
        })
        .filter(module => module != null);

      this.setState({
        assessmentResources,
        assignmentResources,
        discussionResources,
        fileResources,
        isLoaded: true,
        modules,
        otherResources,
        pageResources,
        rightsDescription,
        supportedResources,
        title,
        schema,
        schemaVersion
      });
    }
  }

  setFilter = filter => {
    if (this.history) {
      this.history.push("/");
    }
    this.setState({ filter });
  };

  handleHistoryChange = history => {
    this.history = history;
    this.props.onHistoryChange(history);
  };

  render() {
    if (this.state.isLoaded === false) {
      const showProgress =
        this.state.loadProgress != null && this.state.loadProgress.loaded;

      const prettyProgressBytes =
        showProgress && prettyBytes(this.state.loadProgress.loaded).split(" ");

      const displayProgress =
        prettyProgressBytes &&
        `${parseFloat(prettyProgressBytes[0]).toFixed(1)} ${
          prettyProgressBytes[1]
        }`;

      return (
        <View as="div" margin="small" padding="large" textAlign="center">
          {showProgress && (
            <Progress
              variant="bar"
              animateOnMount
              label="Loading completion"
              formatValueText={(valueNow, valueMax) =>
                `${prettyBytes(valueNow)} of ${prettyBytes(valueMax)} loaded`
              }
              formatDisplayedValue={(valueNow, valueMax) => (
                <Text>
                  <pre>{displayProgress}</pre>
                </Text>
              )}
              valueNow={this.state.loadProgress.loaded}
              valueMax={this.state.loadProgress.total}
            />
          )}

          {showProgress === false && <span> </span>}
        </View>
      );
    }

    const onlyOneSupportedResource = this.state.supportedResources.length === 1;

    const href =
      onlyOneSupportedResource &&
      getResourceHref(this.state.supportedResources[0]);

    const discussionComponents = this.state.discussionResources.map(
      ({ href, dependencyHrefs }, index) => {
        return (
          <DiscussionListItem
            key={index}
            src={this.props.src}
            href={`/${href}`}
            dependencyHrefs={dependencyHrefs}
            entryMap={this.state.entryMap}
          />
        );
      }
    );

    const assignmentComponents = this.state.assignmentResources.map(
      ({ href, dependencyHrefs }, index) => {
        return (
          <AssignmentListItem
            key={index}
            src={this.props.src}
            href={`/${href}`}
            dependencyHrefs={dependencyHrefs}
            entryMap={this.state.entryMap}
          />
        );
      }
    );

    const assessmentComponents = this.state.assessmentResources.map(
      ({ href, dependencyHrefs }, index) => {
        return (
          <AssessmentListItem
            key={index}
            src={this.props.src}
            href={`/${href}`}
            dependencyHrefs={dependencyHrefs}
            entryMap={this.state.entryMap}
          />
        );
      }
    );

    const pageComponents = this.state.pageResources.map(({ href }, index) => {
      return (
        <WikiContentListItem
          key={index}
          src={this.props.src}
          href={`/${href}`}
          entryMap={this.state.entryMap}
        />
      );
    });

    const moduleComponents = this.state.modules.map(
      ({ title, ref, items }, index) => {
        const itemComponents = items.map((item, index) => {
          const isSubheading = item.href == null;

          if (isSubheading) {
            return (
              <li key={index} className="ExpandCollapseList-item">
                <div className="ExpandCollapseList-item-inner">
                  <h3>{item.title}</h3>
                </div>
              </li>
            );
          }

          const extension = getExtension(item.href);

          const isWikiContent =
            item.type === resourceTypes.WEB_CONTENT &&
            ["html", "htm"].includes(extension);

          if (isWikiContent) {
            return (
              <WikiContentListItem
                key={index}
                item={item}
                src={this.props.src}
                href={`/${item.href}`}
                dependencyHrefs={item.dependencyHrefs}
                entryMap={this.state.entryMap}
              />
            );
          }

          if (item.type === resourceTypes.ASSIGNMENT) {
            return (
              <AssignmentListItem
                key={index}
                item={item}
                src={this.props.src}
                href={`/${item.href}`}
                dependencyHrefs={item.dependencyHrefs}
                entryMap={this.state.entryMap}
              />
            );
          }

          if (item.type === resourceTypes.ASSESSMENT_CONTENT) {
            return (
              <AssessmentListItem
                key={index}
                item={item}
                src={this.props.src}
                href={`/${item.href}`}
                dependencyHrefs={item.dependencyHrefs}
                entryMap={this.state.entryMap}
              />
            );
          }

          if (item.type === resourceTypes.DISCUSSION_TOPIC) {
            return (
              <DiscussionListItem
                key={index}
                item={item}
                src={this.props.src}
                href={`/${item.href}`}
                dependencyHrefs={item.dependencyHrefs}
                entryMap={this.state.entryMap}
              />
            );
          }

          if (item.type === resourceTypes.WEB_CONTENT) {
            return (
              <FileListItem
                key={index}
                src={this.props.src}
                href={`/${item.href}`}
                metadata={item.metadata}
                entryMap={this.state.entryMap}
              />
            );
          }

          return (
            <li key={index} className="ExpandCollapseList-item">
              <div className="ExpandCollapseList-item-inner">
                <div>
                  {item.type === resourceTypes.WEB_LINK && (
                    <span className="resource-icon">
                      <IconExternalLink />
                    </span>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <Link as={RouterLink} to={`/${item.href}`}>
                    {item.title}
                  </Link>
                </div>
              </div>
            </li>
          );
        });

        return (
          <li key={index}>
            <Heading level="h3">
              <div style={{ padding: "12px" }}>{title}</div>
            </Heading>

            <ul className="ExpandCollapseList">{itemComponents}</ul>
          </li>
        );
      }
    );

    const resourceComponents = this.state.otherResources
      .filter(resource => resource && resource.getAttribute("href"))
      .map((resource, index) => {
        return (
          <li className="ExpandCollapseList-item" key={index}>
            <div className="li-inner">
              <div>
                <Link as={RouterLink} to={`/${getResourceHref(resource)}`}>
                  {getResourceHref(resource)}
                </Link>
              </div>
              <div>
                {resource.getAttribute("type")}{" "}
                {resource.getAttribute("intendeduse") && (
                  <span>({resource.getAttribute("intendeduse")})</span>
                )}
              </div>
            </div>
          </li>
        );
      });

    const fileComponents = this.state.fileResources.map(
      ({ href, metadata }, index) => {
        return (
          <FileListItem
            key={index}
            src={this.props.src}
            href={`/${href}`}
            metadata={metadata}
            entryMap={this.state.entryMap}
          />
        );
      }
    );

    return (
      <div className={styles.BrowserContent}>
        <View
          as="div"
          margin="small"
          padding="small"
          background="default"
          borderWidth="0 0 small"
        >
          <Breadcrumb size="large" label="You are here:">
            <BreadcrumbLink>{this.state.title || "Untitled"}</BreadcrumbLink>
          </Breadcrumb>
        </View>
        <Grid>
          <GridRow>
            <GridCol width={2}>
              <ul
                className="unstyled-list"
                style={{
                  marginTop: "8px",
                  marginBottom: "8px",
                  marginLeft: "8px"
                }}
              >
                {this.state.modules.length > 0 && (
                  <li>
                    <Button
                      variant={
                        this.state.filter === "organizations"
                          ? "primary"
                          : "link"
                      }
                      onClick={this.setFilter.bind(null, "organizations")}
                    >
                      Modules ({this.state.modules.length})
                    </Button>
                  </li>
                )}

                {this.state.assignmentResources.length > 0 && (
                  <li>
                    <Button
                      variant={
                        this.state.filter === "assignments" ? "primary" : "link"
                      }
                      onClick={this.setFilter.bind(null, "assignments")}
                    >
                      Assignments ({this.state.assignmentResources.length})
                    </Button>
                  </li>
                )}

                {this.state.pageResources.length > 0 && (
                  <li>
                    <Button
                      variant={
                        this.state.filter === "pages" ? "primary" : "link"
                      }
                      onClick={this.setFilter.bind(null, "pages")}
                    >
                      Pages ({this.state.pageResources.length})
                    </Button>
                  </li>
                )}

                {this.state.discussionResources.length > 0 && (
                  <li>
                    <Button
                      variant={
                        this.state.filter === "discussions" ? "primary" : "link"
                      }
                      onClick={this.setFilter.bind(null, "discussions")}
                    >
                      Discussions ({this.state.discussionResources.length})
                    </Button>
                  </li>
                )}

                {this.state.assessmentResources.length > 0 && (
                  <li>
                    <Button
                      variant={
                        this.state.filter === "assessments" ? "primary" : "link"
                      }
                      onClick={this.setFilter.bind(null, "assessments")}
                    >
                      Assessments ({this.state.assessmentResources.length})
                    </Button>
                  </li>
                )}

                {/* {this.state.quizzes.length > 0 && (
                  <li>
                    <Button
                      variant="link"
                      onClick={this.setFilter.bind(null, "other")}
                    >
                      Other ({resourceComponents.length})
                    </Button>
                  </li>
                )} */}

                {this.state.fileResources.length > 0 && (
                  <li>
                    <Button
                      variant={
                        this.state.filter === "files" ? "primary" : "link"
                      }
                      onClick={this.setFilter.bind(null, "files")}
                    >
                      Files ({this.state.fileResources.length})
                    </Button>
                  </li>
                )}
              </ul>
            </GridCol>

            <GridCol width={10}>
              <View
                as="div"
                margin="small"
                padding="small"
                background="default"
              >
                <Router>
                  <React.Fragment>
                    <Switch>
                      <Route
                        exact
                        path="/"
                        render={() =>
                          onlyOneSupportedResource ? (
                            <Redirect to={`/${href}`} />
                          ) : (
                            <React.Fragment>
                              {this.state.filter === "organizations" &&
                                this.state.modules.length > 0 && (
                                  <div className="Cartridge-content-inner">
                                    <Heading level="h1">
                                      <ScreenReaderContent>
                                        Modules
                                      </ScreenReaderContent>
                                    </Heading>
                                    <ul className="ExpandCollapseList">
                                      {moduleComponents}
                                    </ul>
                                  </div>
                                )}

                              {this.state.filter === "discussions" &&
                                this.state.discussionResources.length > 0 && (
                                  <div className="Cartridge-content-inner">
                                    <Heading level="h1">
                                      <ScreenReaderContent>
                                        Discussions
                                      </ScreenReaderContent>
                                    </Heading>
                                    <ul className="ExpandCollapseList">
                                      {discussionComponents}
                                    </ul>
                                  </div>
                                )}

                              {this.state.filter === "assignments" &&
                                assignmentComponents.length > 0 && (
                                  <div className="Cartridge-content-inner">
                                    <Heading level="h1">
                                      <ScreenReaderContent>
                                        Assignments
                                      </ScreenReaderContent>
                                    </Heading>
                                    <ul className="ExpandCollapseList">
                                      {assignmentComponents}
                                    </ul>
                                  </div>
                                )}

                              {this.state.filter === "assessments" &&
                                assessmentComponents.length > 0 && (
                                  <div className="Cartridge-content-inner">
                                    <Heading level="h1">
                                      <ScreenReaderContent>
                                        Assessments
                                      </ScreenReaderContent>
                                    </Heading>
                                    <ul className="ExpandCollapseList">
                                      {assessmentComponents}
                                    </ul>
                                  </div>
                                )}

                              {this.state.filter === "pages" &&
                                this.state.pageResources.length > 0 && (
                                  <div className="Cartridge-content-inner">
                                    <Heading level="h1">
                                      <ScreenReaderContent>
                                        Pages
                                      </ScreenReaderContent>
                                    </Heading>
                                    <ul className="ExpandCollapseList">
                                      {pageComponents}
                                    </ul>
                                  </div>
                                )}

                              {this.state.filter === "files" && (
                                <div className="Cartridge-content-inner">
                                  <Heading level="h1">
                                    <ScreenReaderContent>
                                      Files
                                    </ScreenReaderContent>
                                  </Heading>
                                  <ul className="ExpandCollapseList">
                                    {fileComponents}
                                  </ul>
                                </div>
                              )}

                              {this.state.filter === "other" && (
                                <div className="Cartridge-content-inner">
                                  <Heading level="h1">
                                    <ScreenReaderContent>
                                      Other resources
                                    </ScreenReaderContent>
                                  </Heading>
                                  <ul className="ExpandCollapseList">
                                    {resourceComponents}
                                  </ul>
                                </div>
                              )}
                            </React.Fragment>
                          )
                        }
                      />

                      {/* <Route
                exact
                path="/wiki_content/:file.html"
                render={({ match }) => {
                  return (
                    <div>
                      {this.state.entryMap.size > 0 && (
                        <WikiContent
                          entryMap={this.state.entryMap}
                          href={match.url}
                        />
                      )}
                    </div>
                  );
                }}
              /> */}

                      <Route
                        path="*"
                        render={({ match }) => (
                          <div>
                            {this.state.entryMap.size > 0 && (
                              <Resource
                                entryMap={this.state.entryMap}
                                href={match.url}
                                src={this.props.src}
                              />
                            )}
                          </div>
                        )}
                      />
                    </Switch>

                    <Route
                      path="*"
                      render={({ match, history }) => {
                        return (
                          <RouterObserver
                            match={match}
                            history={history}
                            onHistoryChange={this.handleHistoryChange}
                          />
                        );
                      }}
                    />
                  </React.Fragment>
                </Router>
              </View>
            </GridCol>
          </GridRow>
        </Grid>
      </div>
    );
  }
}

function is(type) {
  return resource => resource.getAttribute("type") === type;
}

function isNot(type) {
  return resource => resource.getAttribute("type") !== type;
}

function getExtension(uri) {
  return uri.split(".").pop();
}
