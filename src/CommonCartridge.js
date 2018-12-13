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
  getResourcesFromXml,
  getTextFromEntry
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
      this.getEntriesFromFile();
    } else if (this.props.src != null) {
      this.getEntriesFromSrc();
    } else if (this.props.manifest != null) {
      this.getEntriesFromManifest();
    }
  }

  getEntriesFromManifest = () => {
    fetch(this.props.manifest)
      .then(response => response.text())
      .then(xml => {
        const {
          assessmentResources,
          assignmentResources,
          associatedContentAssignmentResources,
          associatedContentAssignmentHrefsSet,
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
        } = getResourcesFromXml(xml);
        this.setState({
          assessmentResources,
          assignmentResources,
          associatedContentAssignmentResources,
          associatedContentAssignmentHrefsSet,
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
      });
  };

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
      const xml = await getTextFromEntry(manifestEntry);
      this.loadResources(xml);
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
      : getTextFromEntry(this.state.entryMap.get(path));

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

  loadResources(xml) {
    const {
      assessmentResources,
      assignmentResources,
      associatedContentAssignmentResources,
      associatedContentAssignmentHrefsSet,
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
    } = getResourcesFromXml(xml);
    this.setState({
      assessmentResources,
      assignmentResources,
      associatedContentAssignmentResources,
      associatedContentAssignmentHrefsSet,
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

  render() {
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
                              Discussions (
                              {this.state.discussionResources.length})
                            </Trans>
                          </NavLink>
                        )}
                        {this.state.assessmentResources.length > 0 && (
                          <NavLink className="MenuItem" to="/assessments">
                            <Trans>
                              Assessments (
                              {this.state.assessmentResources.length})
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
                              {this.setActiveNavLink("/")}
                              {showcaseSingleResource !== null ? (
                                <Resource
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
                                  src={this.props.src}
                                  allItemsPath={this.activeNavLink}
                                />
                              ) : this.state.showcaseResources.length === 1 ? (
                                <Resource
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
                                  src={this.props.src}
                                  allItemsPath={this.activeNavLink}
                                />
                              ) : (
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
                              )}
                            </React.Fragment>
                          )}
                        />

                        <Route
                          exact
                          path="/resources/:identifier"
                          render={({ match }) => (
                            <Resource
                              allItemsPath={this.activeNavLink}
                              basepath={this.state.basepath}
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
                              src={this.props.src}
                            />
                          )}
                        />

                        <Route
                          exact
                          path="/modules/:module"
                          render={({ match }) => (
                            <ModulesList
                              getTextByPath={this.getTextByPath}
                              associatedContentAssignmentHrefsSet={
                                this.state.associatedContentAssignmentHrefsSet
                              }
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
                              {this.setActiveNavLink("/assignments")}
                              <AssessmentList
                                getTextByPath={this.getTextByPath}
                                moduleItems={this.state.moduleItems}
                                resourceMap={this.state.resourceMap}
                                resources={this.state.assessmentResources}
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
                              {this.setActiveNavLink("/pages")}
                              <WikiContentList
                                getTextByPath={this.getTextByPath}
                                moduleItems={this.state.moduleItems}
                                resourceMap={this.state.resourceMap}
                                resources={this.state.pageResources}
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
                              {this.setActiveNavLink("/discussions")}
                              <DiscussionList
                                getTextByPath={this.getTextByPath}
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
                              {this.setActiveNavLink("/files")}
                              <FileList
                                resources={this.state.fileResources}
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
                                src={this.props.src}
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
