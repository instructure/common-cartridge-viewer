// import "babel-polyfill";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import NavLink from "./NavLink";
import Resource from "./Resource";
import RouterObserver from "./RouterObserver";
import Progress from "@instructure/ui-elements/lib/components/Progress";
import Breadcrumb, {
  BreadcrumbLink
} from "@instructure/ui-breadcrumb/lib/components/Breadcrumb";
import Billboard from "@instructure/ui-billboard/lib/components/Billboard";
import Grid, {
  GridRow,
  GridCol
} from "@instructure/ui-layout/lib/components/Grid";
import {
  getTextFromEntry,
  getEntriesFromXHR,
  getEntriesFromBlob,
  getExtension,
  getResourceHref
} from "./utils.js";
import { resourceTypes } from "./constants";
import View from "@instructure/ui-layout/lib/components/View";
import Text from "@instructure/ui-elements/lib/components/Text";
import AssessmentList from "./AssessmentList";
import AssignmentList from "./AssignmentList";
import DiscussionList from "./DiscussionList";
import FileList from "./FileList";
import ModulesList from "./ModulesList";
import WikiContentList from "./WikiContentList";

import waitingWristWatch from "./images/waiting-wrist-watch.svg";

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
      isLoaded: false,
      loadProgress: {},
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
    if (this.props.src !== prevProps.src && this.props.file == null) {
      this.setState(
        {
          isLoaded: false,
          filter: "organizations"
        },
        () => this.getEntriesFromSrc()
      );
    } else if (this.props.file != null && this.props.file !== prevProps.file) {
      this.getEntriesFromFile();
    }
  }

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

      const resourceMap = new Map();
      resources.forEach(resource => {
        resourceMap.set(resource.getAttribute("identifier"), resource);
      });

      const resourceIdsByHrefMap = new Map();
      resources
        .filter(resource => resource.getAttribute("href") != null)
        .forEach(resource => {
          resourceIdsByHrefMap.set(
            resource.getAttribute("href"),
            resource.getAttribute("identifier")
          );
        });

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

      this.setState({
        assessmentResources,
        assignmentResources,
        discussionResources,
        resourceMap,
        fileResources,
        isLoaded: true,
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
      });
    }
  }

  handleHistoryChange = history => {
    this.history = history;
    this.props.onHistoryChange(history);
  };

  handleLoadProgress = event => {
    this.setState({ loadProgress: event });
  };

  setActiveNavLink = link => {
    this.activeNavLink = link;
  };

  render() {
    if (this.state.isLoaded === false) {
      return (
        <div className="delayed-appearance">
          <View as="div" margin="small" padding="large" textAlign="center">
            <Billboard
              size="medium"
              heading={"Loading Cartridge"}
              hero={size => (
                <img
                  alt=""
                  style={{ width: "125px", height: "80px" }}
                  src={waitingWristWatch}
                />
              )}
              message="This may take some time depending on the size of the cartridge."
            />

            <Progress
              variant="bar"
              animateOnMount
              label="Loading completion"
              formatValueText={(valueNow, valueMax) =>
                `${Math.floor((valueNow / valueMax) * 100)}% loaded`
              }
              formatDisplayedValue={(valueNow, valueMax) => (
                <Text>
                  <pre>{Math.floor((valueNow / valueMax) * 100)}%</pre>
                </Text>
              )}
              valueNow={this.state.loadProgress.loaded}
              valueMax={this.state.loadProgress.total}
            />
          </View>
        </div>
      );
    }

    let showcaseSingleResource = null;

    if (this.state.resources.length === 1) {
      showcaseSingleResource = this.state.resources[0];
    } else if (
      this.props.compact &&
      this.state.modules.length === 0 &&
      this.state.showcaseResources.length === 1
    ) {
      showcaseSingleResource = this.state.showcaseResources[0];
    }

    return (
      <React.Fragment>
        {this.props.compact !== true && (
          <View
            as="header"
            margrin="small"
            padding="small"
            background="default"
            borderWidth="0 0 small"
          >
            <Breadcrumb size="large" label="You are here:">
              <BreadcrumbLink>{this.state.title || "Untitled"}</BreadcrumbLink>
            </Breadcrumb>
          </View>
        )}

        <div style={{ marginTop: this.props.compact ? "0" : "12px" }}>
          <Grid>
            <GridRow padding="small">
              {showcaseSingleResource === null && (
                <GridCol width={2}>
                  <nav>
                    {this.state.modules.length > 0 && (
                      <NavLink exact className="MenuItem" to="/">
                        Modules ({this.state.modules.length})
                      </NavLink>
                    )}

                    {this.state.assignmentResources.length > 0 && (
                      <NavLink className="MenuItem" to="/assignments">
                        Assignments ({this.state.assignmentResources.length})
                      </NavLink>
                    )}

                    {this.state.pageResources.length > 0 && (
                      <NavLink className="MenuItem" to="/pages">
                        Pages ({this.state.pageResources.length})
                      </NavLink>
                    )}

                    {this.state.discussionResources.length > 0 && (
                      <NavLink className="MenuItem" to="/discussions">
                        Discussions ({this.state.discussionResources.length})
                      </NavLink>
                    )}

                    {this.state.assessmentResources.length > 0 && (
                      <NavLink className="MenuItem" to="/assessments">
                        Assessments ({this.state.assessmentResources.length})
                      </NavLink>
                    )}

                    {this.state.fileResources.length > 0 && (
                      <NavLink className="MenuItem" to="/files">
                        Files ({this.state.fileResources.length})
                      </NavLink>
                    )}
                  </nav>
                </GridCol>
              )}

              <GridCol width={showcaseSingleResource !== null ? 12 : 10}>
                <View
                  as="main"
                  margin={this.props.compact ? "none" : "small"}
                  background="default"
                >
                  <Switch>
                    <Route
                      exact
                      path="/"
                      render={({ match }) => (
                        <React.Fragment>
                          { this.setActiveNavLink("/") }
                          {showcaseSingleResource !== null ? (
                            <Resource
                              entryMap={this.state.entryMap}
                              identifier={this.state.showcaseResources[0].getAttribute(
                                "identifier"
                              )}
                              moduleItems={this.state.moduleItems}
                              modules={this.state.modules}
                              resourceMap={this.state.resourceMap}
                              resourceIdsByHrefMap={
                                this.state.resourceIdsByHrefMap
                              }
                              src={this.props.src}
                              allItemsPath={this.activeNavLink}
                            />
                          ) : this.state.showcaseResources.length === 1 ? (
                            <Resource
                              entryMap={this.state.entryMap}
                              identifier={this.state.showcaseResources[0].getAttribute(
                                "identifier"
                              )}
                              moduleItems={this.state.moduleItems}
                              modules={this.state.modules}
                              resourceMap={this.state.resourceMap}
                              resourceIdsByHrefMap={
                                this.state.resourceIdsByHrefMap
                              }
                              src={this.props.src}
                              allItemsPath={this.activeNavLink}
                            />
                          ) : (
                            <ModulesList
                              entryMap={this.state.entryMap}
                              moduleItems={this.state.moduleItems}
                              modules={this.state.modules}
                              match={match}
                            />
                          )}
                        </React.Fragment>
                      )}
                    />

                    <Route
                      exact
                      path="/resources/:identifier"
                      render={({ match }) => (
                        <Resource
                          entryMap={this.state.entryMap}
                          identifier={match.params.identifier}
                          moduleItems={this.state.moduleItems}
                          modules={this.state.modules}
                          resourceMap={this.state.resourceMap}
                          resourceIdsByHrefMap={this.state.resourceIdsByHrefMap}
                          src={this.props.src}
                          allItemsPath={this.activeNavLink}
                        />
                      )}
                    />

                    <Route
                      exact
                      path="/modules/:module"
                      render={({ match }) => (
                        <ModulesList
                          entryMap={this.state.entryMap}
                          moduleItems={this.state.moduleItems}
                          modules={this.state.modules}
                          match={match}
                        />
                      )}
                    />

                    <Route
                      exact
                      path="/assessments"
                      render={({ match }) => (
                        <React.Fragment>
                          { this.setActiveNavLink('/assignments') }
                          <AssessmentList
                            resources={this.state.assessmentResources}
                            entryMap={this.state.entryMap}
                            moduleItems={this.state.moduleItems}
                            resourceMap={this.state.resourceMap}
                            src={this.props.src}
                          />
                        </React.Fragment>
                      )}
                    />

                    <Route
                      exact
                      path="/pages"
                      render={({ match }) => (
                        <React.Fragment>
                          { this.setActiveNavLink('/pages') }
                          <WikiContentList
                            resources={this.state.pageResources}
                            entryMap={this.state.entryMap}
                            moduleItems={this.state.moduleItems}
                            resourceMap={this.state.resourceMap}
                            src={this.props.src}
                          />
                        </React.Fragment>
                      )}
                    />

                    <Route
                      exact
                      path="/discussions"
                      render={({ match }) => (
                        <React.Fragment>
                          { this.setActiveNavLink('/discussions') }
                          <DiscussionList
                            entryMap={this.state.entryMap}
                            moduleItems={this.state.moduleItems}
                            resourceMap={this.state.resourceMap}
                            resources={this.state.discussionResources}
                            src={this.props.src}
                          />
                        </React.Fragment>
                      )}
                    />

                    <Route
                      exact
                      path="/files"
                      render={({ match }) => (
                        <React.Fragment>
                          { this.setActiveNavLink('/files') }
                          <FileList
                            resources={this.state.fileResources}
                            entryMap={this.state.entryMap}
                            moduleItems={this.state.moduleItems}
                            resourceMap={this.state.resourceMap}
                            src={this.props.src}
                          />
                        </React.Fragment>
                      )}
                    />

                    <Route
                     exact
                     path="/assignments"
                     render={({ match }) => (
                       <React.Fragment>
                         { this.setActiveNavLink('/assignments') }
                         <AssignmentList
                           resources={this.state.assignmentResources}
                           entryMap={this.state.entryMap}
                           moduleItems={this.state.moduleItems}
                           resourceMap={this.state.resourceMap}
                           src={this.props.src}
                         />
                       </React.Fragment>
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
                </View>
              </GridCol>
            </GridRow>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

function is(type) {
  return resource => resource.getAttribute("type") === type;
}

function isNot(type) {
  return resource => resource.getAttribute("type") !== type;
}
