import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import NavLink from "./NavLink";
import Resource from "./Resource";
import RouterObserver from "./RouterObserver";
import Progress from "@instructure/ui-elements/lib/components/Progress";
import Breadcrumb, {
  BreadcrumbLink
} from "@instructure/ui-breadcrumb/lib/components/Breadcrumb";
import Billboard from "@instructure/ui-billboard/lib/components/Billboard";
import {
  blobToDataUrl,
  getBlobFromEntry,
  getEntriesFromBlob,
  getEntriesFromXHR,
  getTextFromEntry,
  parseManifestDocument,
  parseXml,
  getOptionalTextContent
} from "./utils.js";
import View from "@instructure/ui-layout/lib/components/View";
import Text from "@instructure/ui-elements/lib/components/Text";
import AssessmentList from "./AssessmentList";
import AssignmentList from "./AssignmentList";
import AssociatedContentAssignmentList from "./AssociatedContentAssignmentList";
import DiscussionList from "./DiscussionList";
import FileList from "./FileList";
import ModulesList from "./ModulesList";
import WikiContentList from "./WikiContentList";
import waitingWristWatch from "./images/waiting-wrist-watch.svg";
import { I18n } from "@lingui/react";
import { Trans, t } from "@lingui/macro";
import CourseNavigationUnavailable from "./CourseNavigationUnavailable";
import Unavailable from "./Unavailable";
import Responsive from "@instructure/ui-layout/lib/components/Responsive";
import IconOpen from "@instructure/ui-icons/lib/Solid/IconHamburger";
import IconClose from "@instructure/ui-icons/lib/Solid/IconX";

import Button from "@instructure/ui-buttons/lib/components/Button";

const queryString = require("query-string");

const ONE_MEG_IN_BYTES = 1000000;

// https://www.imsglobal.org/cc/ccv1p1/imscc_profilev1p1-Implementation.html

export default class CommonCartridge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assignmentResources: [],
      associatedContentAssignmentResources: [],
      assessmentResources: [],
      basepath:
        this.props.manifest != null
          ? this.props.manifest.split("/imsmanifest.xml").slice(0, -1)
          : null,
      discussionResources: [],
      entries: [],
      entryMap: new Map(),
      errorLoading: null,
      externalViewers: new Map(),
      fileResources: [],
      isCartridgeRemotelyExpanded: this.props.manifest != null,
      isLoaded: false,
      loadProgress: {},
      modules: [],
      otherResources: [],
      pageResources: [],
      resourceIdsByHrefMap: new Map(),
      showcaseResources: [],
      showcaseSingleResource: null,
      previewType:
        this.props.manifest != null
          ? "manifest" // prefer manifest
          : this.props.cartridge != null
          ? "cartridge" // fall back to cartridge
          : this.props.file != null
          ? "file"
          : null
    };
  }

  handleDocumentKeydown = event => {
    if (event.code !== "Enter") return;
    const wasLinkTriggered = event.target.nodeName === "A";
    if (wasLinkTriggered === false) return;
    setTimeout(() => {
      const isFocusInMain = this.mainRef.contains(document.activeElement);
      const isFocusOnLink =
        document.activeElement && document.activeElement.nodeName === "A";
      if (isFocusInMain === false && isFocusOnLink === false) {
        this.mainRef.focus();
      }
    }, 0);
  };

  getEntriesFromPreviewType = () => {
    if (this.state.previewType === "manifest") {
      this.getEntriesFromManifest();
    } else if (this.state.previewType === "cartridge") {
      this.getEntriesFromExternalImscc();
    } else if (this.state.previewType === "file") {
      this.getEntriesFromDroppedFile();
    }
  };

  componentDidMount() {
    document.addEventListener("keydown", this.handleDocumentKeydown);
    this.getEntriesFromPreviewType();
  }

  getEntriesFromManifest = () => {
    fetch(this.props.manifest)
      .then(response => {
        if (response.ok === false) {
          throw new Error();
        }
        return response.text();
      })
      .then(xml => this.loadResources(xml))
      .catch(error => {
        const canAttemptCartridgeFallBack =
          this.state.previewType === "manifest" && this.props.cartridge != null;
        if (canAttemptCartridgeFallBack) {
          this.setState({
            previewType: "cartridge",
            basepath: null,
            isCartridgeRemotelyExpanded: false
          });
        } else {
          this.setState({ errorLoading: true });
        }
      });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.previewType !== prevState.previewType) {
      this.getEntriesFromPreviewType();
      return;
    }
    if (
      this.props.cartridge !== prevProps.cartridge &&
      this.props.file == null
    ) {
      this.setState(
        {
          isLoaded: false,
          filter: "organizations"
        },
        () => this.getEntriesFromExternalImscc()
      );
    } else if (this.props.file != null && this.props.file !== prevProps.file) {
      this.getEntriesFromDroppedFile();
    }

    const isOnEmptyModulesPage =
      this.state.showcaseSingleResource == null &&
      this.state.modules.length === 0 &&
      window.location.hash === "#/";
    if (isOnEmptyModulesPage && this.state.showcaseResources.length > 1) {
      if (
        this.state.assignmentResources.length > 0 ||
        this.state.associatedContentAssignmentResources.length > 0
      ) {
        window.location.hash = "#/assignments";
      } else if (this.state.pageResources.length > 0) {
        window.location.hash = "#/pages";
      } else if (this.state.discussionResources.length > 0) {
        window.location.hash = "#/discussions";
      } else if (this.state.assessmentResources.length > 0) {
        window.location.hash = "#/quizzes";
      } else if (this.state.fileResources.length > 0) {
        window.location.hash = "#/files";
      }
    }
  }

  async getEntriesFromExternalImscc() {
    const [request, getEntriesPromise] = getEntriesFromXHR(
      this.props.cartridge
    );
    request.addEventListener("progress", this.handleLoadProgress);
    try {
      const entries = await getEntriesPromise;
      this.setState({ entries }, () => this.loadEntries());
    } catch (error) {
      this.setState({ errorLoading: true });
    }
  }

  async getEntriesFromDroppedFile() {
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

    if (manifestEntry) {
      let xml;
      try {
        xml = await getTextFromEntry(manifestEntry);
      } catch (error) {
        this.setState({ errorLoading: true });
      }
      if (xml != null) {
        this.loadResources(xml);
      }
    } else {
      this.setState({ errorLoading: true });
    }
  }

  getUrlForPath = async path => {
    if (this.state.isCartridgeRemotelyExpanded) {
      return `${this.state.basepath}/${path}`;
    }
    const blob = await this.getBlobByPath(decodeURIComponent(path));
    return blob ? blobToDataUrl(blob) : "";
  };

  getBlobByPath = path => {
    return this.state.isCartridgeRemotelyExpanded
      ? fetch(`${this.state.basepath}/${path}`)
          .then(response => response.blob())
          .catch(err => null)
      : this.state.entryMap.has(path)
      ? getBlobFromEntry(this.state.entryMap.get(path))
      : "";
  };

  getRubrics = async () => {
    const xml = await this.getTextByPath("course_settings/rubrics.xml");
    if (xml == null) return [];
    const document = parseXml(xml);
    if (document == null) return [];
    const rubrics = new Map();

    Array.from(document.querySelectorAll("rubric")).forEach(node => {
      rubrics.set(node.getAttribute("identifier"), {
        title: getOptionalTextContent(node, "title"),
        pointsPossible: getOptionalTextContent(node, "points_possible"),
        criteria: Array.from(node.querySelectorAll("criterion")).map(
          criterion => {
            return {
              id: getOptionalTextContent(criterion, "criterion_id"),
              description: getOptionalTextContent(criterion, "description"),
              points: getOptionalTextContent(criterion, "points"),
              ratings: Array.from(criterion.querySelectorAll("rating")).map(
                rating => {
                  return {
                    id: getOptionalTextContent(rating, "id"),
                    description: rating.querySelector("description")
                      .textContent,
                    points: getOptionalTextContent(rating, "points")
                  };
                }
              )
            };
          }
        )
      });
    });

    return rubrics;
  };

  getTextByPath = path =>
    this.state.isCartridgeRemotelyExpanded
      ? fetch(`${this.state.basepath}/${path}`)
          .then(response => {
            return response.ok ? response.text() : null;
          })
          .catch(err => null)
      : this.state.entryMap.has(path)
      ? getTextFromEntry(this.state.entryMap.get(path))
      : null;

  handleHistoryChange = history => {
    this.history = history;
    this.props.onHistoryChange(history);
  };

  handleLoadProgress = event => {
    this.setState({ loadProgress: event });
  };

  getExternalViewers = async resourceIdsByHrefMap => {
    const xml = await this.getTextByPath(
      "course_settings/external_viewers.xml"
    );
    if (xml == null) return;
    const document = parseXml(xml);
    if (document == null) return;
    const externalViewers = new Map();
    Array.from(document.querySelectorAll("externalViewer")).forEach(node => {
      const resourceId = resourceIdsByHrefMap.get(node.getAttribute("path"));
      if (resourceId != null) {
        externalViewers.set(resourceId, {
          service: node.getAttribute("service"),
          id: node.getAttribute("id")
        });
      } else {
        console.warn(
          `Entry ${node.getAttribute(
            "path"
          )} not associated in cartridge to any resource`
        );
      }
    });
    return externalViewers;
  };

  getModuleMeta = async () => {
    const xml = await this.getTextByPath("course_settings/module_meta.xml");
    if (xml == null) return;
    return parseXml(xml);
  };

  async loadResources(xml) {
    const manifest = parseXml(xml);
    const moduleMeta = await this.getModuleMeta();
    const result = await parseManifestDocument(manifest, { moduleMeta });
    if (result.resources.length === 0) {
      throw new Error();
    }
    let externalViewers = new Map();
    if (result.hasExternalViewers) {
      externalViewers = await this.getExternalViewers(
        result.resourceIdsByHrefMap
      );
    }

    const rubrics = await this.getRubrics();

    const showcaseSingleResource =
      result.modules.length === 0 &&
      result.showcaseResources.length === 1 &&
      result.fileResources.length === 0
        ? result.showcaseResources[0]
        : null;

    this.setState({
      ...result,
      externalViewers,
      isLoaded: true,
      showcaseSingleResource,
      rubrics
    });
  }

  render() {
    if (this.state.errorLoading === true) {
      return (
        <I18n>
          {({ i18n }) => (
            <Unavailable
              heading={i18n._(t`Failed to load resource`)}
              subHeading={i18n._(
                t`We had a problem loading the Common Cartridge`
              )}
            />
          )}
        </I18n>
      );
    }

    if (this.state.isLoaded === false) {
      const isLarge =
        this.state.loadProgress &&
        this.state.loadProgress.total &&
        this.state.loadProgress.total > 2 * ONE_MEG_IN_BYTES;
      const isTakingAwhile =
        this.state.loadProgress &&
        this.state.loadProgress.timestamp &&
        this.state.loadProgress.timestamp > 2000;
      return (
        <I18n>
          {({ i18n }) => (
            <div className={isLarge || isTakingAwhile ? "fade-in" : "hidden"}>
              <Responsive
                query={{
                  large: { minWidth: "600px" }
                }}
                props={{
                  large: { margin: "small", padding: "large" }
                }}
                render={props => (
                  <View {...props} as="div" textAlign="center">
                    <Billboard
                      size="medium"
                      heading={i18n._(t`Loading Cartridge`)}
                      hero={size => (
                        <img
                          alt=""
                          style={{ width: "125px", height: "80px" }}
                          src={waitingWristWatch}
                        />
                      )}
                      message={i18n._(t`
                      This may take some time depending on the size of the
                      cartridge.
                    `)}
                    />

                    <Progress
                      variant="bar"
                      animateOnMount
                      label={i18n._(t`Loading completion`)}
                      formatValueText={(valueNow, valueMax) =>
                        i18n._(
                          t`${Math.floor((valueNow / valueMax) * 100)}% loaded`
                        )
                      }
                      formatDisplayedValue={(valueNow, valueMax) => (
                        <Text>
                          <pre>
                            {i18n._(
                              t`${Math.floor((valueNow / valueMax) * 100)}%`
                            )}
                          </pre>
                        </Text>
                      )}
                      valueNow={this.state.loadProgress.loaded}
                      valueMax={this.state.loadProgress.total}
                    />
                  </View>
                )}
              />
            </div>
          )}
        </I18n>
      );
    }

    const numberOfAssignments = Math.max(
      this.state.assignmentResources.length,
      this.state.associatedContentAssignmentResources.length
    );

    const startIndexQuery = queryString.stringify({ startIndex: 0 });

    return (
      <I18n>
        {({ i18n }) => (
          <React.Fragment>
            {this.props.compact !== true && (
              <View
                as="header"
                margrin="small"
                padding="small"
                background="default"
                borderWidth="0 0 small"
              >
                <Breadcrumb size="large" label={i18n._(t`You are here:`)}>
                  <BreadcrumbLink>
                    {this.state.title || <Trans>Untitled</Trans>}
                  </BreadcrumbLink>
                </Breadcrumb>
              </View>
            )}

            <div
              className={[
                "CommonCartridge--view",
                this.state.showcaseSingleResource ? "single-resource" : null
              ]
                .join(" ")
                .trim()}
            >
              {this.state.showcaseSingleResource === null && (
                <nav>
                  <input type="checkbox" id="NavTrigger" name="NavTrigger" />
                  <Button
                    as="label"
                    variant="ghost"
                    buttonRef={ref =>
                      ref &&
                      ref.classList.add("open") &
                        ref.setAttribute("for", "NavTrigger")
                    }
                    margin="0 x-small 0 0"
                    icon={IconOpen}
                  />
                  <div className="navLinks">
                    {this.state.modules.length > 0 && (
                      <NavLink exact className="MenuItem" to="/">
                        <Trans>Modules ({this.state.modules.length})</Trans>
                      </NavLink>
                    )}
                    {numberOfAssignments > 0 && (
                      <NavLink
                        className="MenuItem"
                        to={{
                          pathname: "/assignments",
                          search: startIndexQuery
                        }}
                      >
                        <Trans>Assignments ({numberOfAssignments})</Trans>
                      </NavLink>
                    )}
                    {this.state.pageResources.length > 0 && (
                      <NavLink
                        className="MenuItem"
                        to={{
                          pathname: "/pages",
                          search: startIndexQuery
                        }}
                      >
                        <Trans>Pages ({this.state.pageResources.length})</Trans>
                      </NavLink>
                    )}
                    {this.state.discussionResources.length > 0 && (
                      <NavLink
                        className="MenuItem"
                        to={{
                          pathname: "/discussions",
                          search: startIndexQuery
                        }}
                      >
                        <Trans
                          id="Discussions ({length})"
                          values={{
                            length: this.state.discussionResources.length
                          }}
                        />
                      </NavLink>
                    )}
                    {this.state.assessmentResources.length > 0 && (
                      <NavLink
                        className="MenuItem"
                        to={{
                          pathname: "/quizzes",
                          search: startIndexQuery
                        }}
                      >
                        <Trans>
                          Quizzes ({this.state.assessmentResources.length})
                        </Trans>
                      </NavLink>
                    )}
                    {this.state.fileResources.length > 0 && (
                      <NavLink
                        className="MenuItem"
                        to={{
                          pathname: "/files",
                          search: startIndexQuery
                        }}
                      >
                        <Trans>Files ({this.state.fileResources.length})</Trans>
                      </NavLink>
                    )}
                  </div>
                  <Button
                    as="label"
                    variant="ghost"
                    buttonRef={ref =>
                      ref &&
                      ref.classList.add("close") &
                        ref.setAttribute("for", "NavTrigger")
                    }
                    margin="0 x-small 0 0"
                    icon={IconClose}
                  />
                </nav>
              )}

              <div className="CommonCartridge--content">
                <View
                  as="main"
                  elementRef={ref => (this.mainRef = ref)}
                  margin={this.props.compact ? "none" : "small"}
                  background="default"
                >
                  <Switch>
                    <Route
                      exact
                      path="/"
                      render={({ match, location }) => (
                        <React.Fragment>
                          {this.state.showcaseSingleResource !== null ? (
                            <React.Fragment>
                              <Resource
                                getTextByPath={this.getTextByPath}
                                externalViewer={this.state.externalViewers.get(
                                  this.state.showcaseResources[0].getAttribute(
                                    "identifier"
                                  )
                                )}
                                getUrlForPath={this.getUrlForPath}
                                identifier={this.state.showcaseResources[0].getAttribute(
                                  "identifier"
                                )}
                                moduleItems={this.state.moduleItems}
                                modules={this.state.modules}
                                resourceMap={this.state.resourceMap}
                                resourceIdsByHrefMap={
                                  this.state.resourceIdsByHrefMap
                                }
                                location={location}
                                rubrics={this.state.rubrics}
                              />
                            </React.Fragment>
                          ) : this.state.showcaseResources.length === 1 ? (
                            <React.Fragment>
                              <Resource
                                externalViewer={this.state.externalViewers.get(
                                  this.state.showcaseResources[0].getAttribute(
                                    "identifier"
                                  )
                                )}
                                getTextByPath={this.getTextByPath}
                                getUrlForPath={this.getUrlForPath}
                                identifier={this.state.showcaseResources[0].getAttribute(
                                  "identifier"
                                )}
                                moduleItems={this.state.moduleItems}
                                modules={this.state.modules}
                                resourceMap={this.state.resourceMap}
                                resourceIdsByHrefMap={
                                  this.state.resourceIdsByHrefMap
                                }
                                location={location}
                                rubrics={this.state.rubrics}
                              />
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              <ModulesList
                                getTextByPath={this.getTextByPath}
                                associatedContentAssignmentHrefsSet={
                                  this.state.associatedContentAssignmentHrefsSet
                                }
                                moduleItems={this.state.moduleItems}
                                modules={this.state.modules}
                                match={match}
                                location={location}
                              />
                            </React.Fragment>
                          )}
                        </React.Fragment>
                      )}
                    />

                    <Route
                      exact
                      path="/resources/:identifier"
                      render={({ match, location }) => (
                        <React.Fragment>
                          <Resource
                            basepath={this.state.basepath}
                            externalViewers={this.state.externalViewers}
                            externalViewer={this.state.externalViewers.get(
                              match.params.identifier
                            )}
                            getBlobByPath={this.getBlobByPath}
                            getTextByPath={this.getTextByPath}
                            getUrlForPath={this.getUrlForPath}
                            identifier={match.params.identifier}
                            isCartridgeRemotelyExpanded={
                              this.state.isCartridgeRemotelyExpanded
                            }
                            moduleItems={this.state.moduleItems}
                            modules={this.state.modules}
                            resourceIdsByHrefMap={
                              this.state.resourceIdsByHrefMap
                            }
                            resourceMap={this.state.resourceMap}
                            location={location}
                            rubrics={this.state.rubrics}
                          />
                        </React.Fragment>
                      )}
                    />

                    <Route
                      exact
                      path="/module-items/:identifier"
                      render={({ match, location }) => (
                        <React.Fragment>
                          <Resource
                            basepath={this.state.basepath}
                            externalViewers={this.state.externalViewers}
                            externalViewer={this.state.externalViewers.get(
                              match.params.identifier
                            )}
                            getBlobByPath={this.getBlobByPath}
                            getTextByPath={this.getTextByPath}
                            getUrlForPath={this.getUrlForPath}
                            identifier={match.params.identifier}
                            isCartridgeRemotelyExpanded={
                              this.state.isCartridgeRemotelyExpanded
                            }
                            moduleItems={this.state.moduleItems}
                            modules={this.state.modules}
                            resourceIdsByHrefMap={
                              this.state.resourceIdsByHrefMap
                            }
                            resourceMap={this.state.resourceMap}
                            isModuleItem={true}
                            rubrics={this.state.rubrics}
                          />
                        </React.Fragment>
                      )}
                    />

                    <Route
                      exact
                      path="/modules/:module"
                      render={({ match, location }) => (
                        <React.Fragment>
                          <ModulesList
                            getTextByPath={this.getTextByPath}
                            associatedContentAssignmentHrefsSet={
                              this.state.associatedContentAssignmentHrefsSet
                            }
                            moduleItems={this.state.moduleItems}
                            modules={this.state.modules}
                            match={match}
                            location={location}
                          />
                        </React.Fragment>
                      )}
                    />

                    <Route
                      exact
                      path="/quizzes"
                      render={({ match, location }) =>
                        this.state.assessmentResources.length > 0 ? (
                          <React.Fragment>
                            <AssessmentList
                              getTextByPath={this.getTextByPath}
                              moduleItems={this.state.moduleItems}
                              resourceMap={this.state.resourceMap}
                              resources={this.state.assessmentResources}
                              location={location}
                            />
                          </React.Fragment>
                        ) : (
                          <CourseNavigationUnavailable />
                        )
                      }
                    />

                    <Route
                      exact
                      path="/pages"
                      render={({ match, location }) =>
                        this.state.pageResources.length > 0 ? (
                          <React.Fragment>
                            <WikiContentList
                              getTextByPath={this.getTextByPath}
                              moduleItems={this.state.moduleItems}
                              resourceMap={this.state.resourceMap}
                              resources={this.state.pageResources}
                              location={location}
                            />
                          </React.Fragment>
                        ) : (
                          <CourseNavigationUnavailable />
                        )
                      }
                    />

                    <Route
                      exact
                      path="/discussions"
                      render={({ match, location }) =>
                        this.state.discussionResources.length > 0 ? (
                          <React.Fragment>
                            <DiscussionList
                              getTextByPath={this.getTextByPath}
                              moduleItems={this.state.moduleItems}
                              resourceMap={this.state.resourceMap}
                              resources={this.state.discussionResources}
                              location={location}
                            />
                          </React.Fragment>
                        ) : (
                          <CourseNavigationUnavailable />
                        )
                      }
                    />

                    <Route
                      exact
                      path="/files"
                      render={({ match, location }) =>
                        this.state.fileResources.length > 0 ? (
                          <React.Fragment>
                            <FileList
                              resources={this.state.fileResources}
                              moduleItems={this.state.moduleItems}
                              resourceMap={this.state.resourceMap}
                              location={location}
                            />
                          </React.Fragment>
                        ) : (
                          <CourseNavigationUnavailable />
                        )
                      }
                    />

                    <Route
                      exact
                      path="/assignments"
                      render={({ match, location }) =>
                        numberOfAssignments > 0 ? (
                          <React.Fragment>
                            <AssignmentList
                              getTextByPath={this.getTextByPath}
                              moduleItems={this.state.moduleItems}
                              resourceMap={this.state.resourceMap}
                              resources={this.state.assignmentResources}
                              location={location}
                            />
                            <AssociatedContentAssignmentList
                              resources={
                                this.state.associatedContentAssignmentResources
                              }
                              getTextByPath={this.getTextByPath}
                              moduleItems={this.state.moduleItems}
                              resourceMap={this.state.resourceMap}
                              location={location}
                            />
                          </React.Fragment>
                        ) : (
                          <CourseNavigationUnavailable />
                        )
                      }
                    />

                    <Route
                      exact
                      path="/course/navigation"
                      render={({ match }) => <CourseNavigationUnavailable />}
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
              </div>
            </div>
          </React.Fragment>
        )}
      </I18n>
    );
  }
}
