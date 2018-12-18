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
import Grid, {
  GridRow,
  GridCol
} from "@instructure/ui-layout/lib/components/Grid";
import {
  blobToDataUrl,
  getBlobFromEntry,
  getEntriesFromBlob,
  getEntriesFromXHR,
  getTextFromEntry,
  parseManifestDocument,
  parseXml
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
import PreviewUnavailable from "./PreviewUnavailable";
import Unavailable from "./Unavailable";

// https://www.imsglobal.org/cc/ccv1p1/imscc_profilev1p1-Implementation.html

export default class CommonCartridge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assignments: [],
      assessments: [],
      basepath:
        this.props.manifest != null
          ? this.props.manifest.split("/imsmanifest.xml").slice(0, -1)
          : null,
      discussions: [],
      entries: [],
      entryMap: new Map(),
      errorLoading: null,
      externalViewers: new Map(),
      files: [],
      isCartridgeRemotelyExpanded: this.props.manifest != null,
      isLoaded: false,
      loadProgress: {},
      modules: [],
      pageResources: [],
      resourceIdsByHrefMap: new Map(),
      otherResources: []
    };
  }

  componentDidMount() {
    if (this.props.file != null) {
      this.getEntriesFromDroppedFile();
    } else if (this.props.cartridge != null) {
      this.getEntriesFromExternalImscc();
    } else if (this.props.manifest != null) {
      this.getEntriesFromManifest();
    }
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
        this.setState({ errorLoading: true });
      });
  };

  componentDidUpdate(prevProps) {
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

    if (manifestEntry != null) {
      let xml;
      try {
        xml = await getTextFromEntry(manifestEntry);
      } catch (error) {
        this.setState({ errorLoading: true });
      }
      if (xml != null) {
        this.loadResources(xml);
      }
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

  getTextByPath = path =>
    this.state.isCartridgeRemotelyExpanded
      ? fetch(`${this.state.basepath}/${path}`)
          .then(response => response.text())
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

  setActiveNavLink = link => {
    this.activeNavLink = link;
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
      this.setState({ errorLoading: true });
      return;
    }
    let externalViewers = new Map();
    if (result.hasExternalViewers) {
      externalViewers = await this.getExternalViewers(
        result.resourceIdsByHrefMap
      );
    }
    this.setState({
      ...result,
      externalViewers,
      isLoaded: true
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
      return (
        <I18n>
          {({ i18n }) => (
            <div className="delayed-appearance">
              <View as="div" margin="small" padding="large" textAlign="center">
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
                        {i18n._(t`${Math.floor((valueNow / valueMax) * 100)}%`)}
                      </pre>
                    </Text>
                  )}
                  valueNow={this.state.loadProgress.loaded}
                  valueMax={this.state.loadProgress.total}
                />
              </View>
            </div>
          )}
        </I18n>
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

    const numberOfAssignments = Math.max(
      this.state.assignmentResources.length,
      this.state.associatedContentAssignmentResources.length
    );

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

            <div style={{ marginTop: this.props.compact ? "0" : "12px" }}>
              <Grid>
                <GridRow padding="small">
                  {showcaseSingleResource === null && (
                    <GridCol width={2}>
                      <nav>
                        {this.state.modules.length > 0 && (
                          <NavLink exact className="MenuItem" to="/">
                            <Trans>Modules ({this.state.modules.length})</Trans>
                          </NavLink>
                        )}
                        {numberOfAssignments > 0 && (
                          <NavLink className="MenuItem" to="/assignments">
                            <Trans>Assignments ({numberOfAssignments})</Trans>
                          </NavLink>
                        )}
                        {this.state.pageResources.length > 0 && (
                          <NavLink className="MenuItem" to="/pages">
                            <Trans>
                              Pages ({this.state.pageResources.length})
                            </Trans>
                          </NavLink>
                        )}
                        {this.state.discussionResources.length > 0 && (
                          <NavLink className="MenuItem" to="/discussions">
                            <Trans>
                              {`Discussions (${
                                this.state.discussionResources.length
                              })`}
                            </Trans>
                          </NavLink>
                        )}
                        {this.state.assessmentResources.length > 0 && (
                          <NavLink className="MenuItem" to="/quizzes">
                            <Trans>
                              {`Quizzes (${
                                this.state.assessmentResources.length
                              })`}
                            </Trans>
                          </NavLink>
                        )}
                        {this.state.fileResources.length > 0 && (
                          <NavLink className="MenuItem" to="/files">
                            <Trans>
                              Files ({this.state.fileResources.length})
                            </Trans>
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
                              {showcaseSingleResource !== null ? (
                                <React.Fragment>
                                  {this.setActiveNavLink(null)}
                                  <Resource
                                    getTextByPath={this.getTextByPath}
                                    externalViewer={this.state.externalViewers.get(
                                      this.state.showcaseResources[0].getAttribute(
                                        "identifier"
                                      )
                                    )}
                                    identifier={this.state.showcaseResources[0].getAttribute(
                                      "identifier"
                                    )}
                                    moduleItems={this.state.moduleItems}
                                    modules={this.state.modules}
                                    resourceMap={this.state.resourceMap}
                                    resourceIdsByHrefMap={
                                      this.state.resourceIdsByHrefMap
                                    }
                                  />
                                </React.Fragment>
                              ) : this.state.showcaseResources.length === 1 ? (
                                <React.Fragment>
                                  {this.setActiveNavLink("/")}
                                  <Resource
                                    externalViewer={this.state.externalViewers.get(
                                      this.state.showcaseResources[0].getAttribute(
                                        "identifier"
                                      )
                                    )}
                                    getTextByPath={this.getTextByPath}
                                    identifier={this.state.showcaseResources[0].getAttribute(
                                      "identifier"
                                    )}
                                    moduleItems={this.state.moduleItems}
                                    modules={this.state.modules}
                                    resourceMap={this.state.resourceMap}
                                    resourceIdsByHrefMap={
                                      this.state.resourceIdsByHrefMap
                                    }
                                    allItemsPath={this.activeNavLink}
                                  />
                                </React.Fragment>
                              ) : (
                                <React.Fragment>
                                  {this.setActiveNavLink("/")}
                                  <ModulesList
                                    getTextByPath={this.getTextByPath}
                                    associatedContentAssignmentHrefsSet={
                                      this.state
                                        .associatedContentAssignmentHrefsSet
                                    }
                                    moduleItems={this.state.moduleItems}
                                    modules={this.state.modules}
                                    match={match}
                                  />
                                </React.Fragment>
                              )}
                            </React.Fragment>
                          )}
                        />

                        <Route
                          exact
                          path="/resources/:identifier"
                          render={({ match }) => (
                            <React.Fragment>
                              {this.activeNavLink === undefined &&
                                !showcaseSingleResource &&
                                this.setActiveNavLink("/")}
                              <Resource
                                allItemsPath={this.activeNavLink}
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
                              />
                            </React.Fragment>
                          )}
                        />

                        <Route
                          exact
                          path="/modules/:module"
                          render={({ match }) => (
                            <React.Fragment>
                              {this.setActiveNavLink("/")}
                              <ModulesList
                                getTextByPath={this.getTextByPath}
                                associatedContentAssignmentHrefsSet={
                                  this.state.associatedContentAssignmentHrefsSet
                                }
                                moduleItems={this.state.moduleItems}
                                modules={this.state.modules}
                                match={match}
                              />
                            </React.Fragment>
                          )}
                        />

                        <Route
                          exact
                          path="/quizzes"
                          render={({ match }) => (
                            <React.Fragment>
                              {this.setActiveNavLink("/quizzes")}
                              <AssessmentList
                                getTextByPath={this.getTextByPath}
                                moduleItems={this.state.moduleItems}
                                resourceMap={this.state.resourceMap}
                                resources={this.state.assessmentResources}
                              />
                            </React.Fragment>
                          )}
                        />

                        <Route
                          exact
                          path="/pages"
                          render={({ match }) => (
                            <React.Fragment>
                              {this.setActiveNavLink("/pages")}
                              <WikiContentList
                                getTextByPath={this.getTextByPath}
                                moduleItems={this.state.moduleItems}
                                resourceMap={this.state.resourceMap}
                                resources={this.state.pageResources}
                              />
                            </React.Fragment>
                          )}
                        />

                        <Route
                          exact
                          path="/discussions"
                          render={({ match }) => (
                            <React.Fragment>
                              {this.setActiveNavLink("/discussions")}
                              <DiscussionList
                                getTextByPath={this.getTextByPath}
                                moduleItems={this.state.moduleItems}
                                resourceMap={this.state.resourceMap}
                                resources={this.state.discussionResources}
                              />
                            </React.Fragment>
                          )}
                        />

                        <Route
                          exact
                          path="/files"
                          render={({ match }) => (
                            <React.Fragment>
                              {this.setActiveNavLink("/files")}
                              <FileList
                                resources={this.state.fileResources}
                                moduleItems={this.state.moduleItems}
                                resourceMap={this.state.resourceMap}
                              />
                            </React.Fragment>
                          )}
                        />

                        <Route
                          exact
                          path="/assignments"
                          render={({ match }) => (
                            <React.Fragment>
                              {this.setActiveNavLink("/assignments")}
                              <AssignmentList
                                getTextByPath={this.getTextByPath}
                                moduleItems={this.state.moduleItems}
                                resourceMap={this.state.resourceMap}
                                resources={this.state.assignmentResources}
                              />
                              <AssociatedContentAssignmentList
                                resources={
                                  this.state
                                    .associatedContentAssignmentResources
                                }
                                getTextByPath={this.getTextByPath}
                                moduleItems={this.state.moduleItems}
                                resourceMap={this.state.resourceMap}
                              />
                            </React.Fragment>
                          )}
                        />

                        <Route
                          exact
                          path="/course/navigation"
                          render={({ match }) => (
                            <CourseNavigationUnavailable />
                          )}
                        />

                        <Route
                          exact
                          path="/external/tool"
                          render={({ match }) => <PreviewUnavailable />}
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
        )}
      </I18n>
    );
  }
}
