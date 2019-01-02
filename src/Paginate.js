import React, { Component } from "react";
import { t } from "@lingui/macro";
import { I18n } from "@lingui/react";
import { Link as RouterLink } from "react-router-dom";
import Pagination, {
  PaginationButton
} from "@instructure/ui-pagination/es/components/Pagination";
const queryString = require("query-string");

const NUMBER_OF_ITEMS_TO_SHOW = 15;
const NUMBER_OF_PAGINATION_BUTTONS_TO_RENDER = 4;
export default class Paginate extends Component {
  componentDidMount() {
    const parsedQueryString = queryString.parse(this.props.location.search);
    this.setState({
      currentStartIndex:
        isNaN(parsedQueryString.startIndex) === false
          ? parseInt(parsedQueryString.startIndex)
          : 0
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // if the user used back or forward browser navigation we update the list to reflect the last or next page the user was on.
    const parsedQueryString = queryString.parse(this.props.location.search);
    const startIndexQueryParamDidChange =
      isNaN(parsedQueryString.startIndex) === false &&
      parseInt(parsedQueryString.startIndex) !== this.state.currentStartIndex;
    if (startIndexQueryParamDidChange) {
      this.setState({
        currentStartIndex: parseInt(parsedQueryString.startIndex)
      });
    }
  }

  renderPaginationButton = pageIndex => {
    const parsedQueryString = queryString.parse(this.props.location.search);
    parsedQueryString.startIndex = pageIndex * NUMBER_OF_ITEMS_TO_SHOW;
    const search = queryString.stringify(parsedQueryString);
    return (
      <PaginationButton
        key={pageIndex}
        as={RouterLink}
        to={{
          pathname: this.props.location.pathname,
          search
        }}
        // Adds a11y keyboard support for pagination navigation
        onClick={event => {
          if (event.persist) {
            event.persist();
          }
          const href =
            event && event.target && event.target.getAttribute("href");
          // No need to update the hash if the user is just clicking on an href
          // However, we do want to accept clicks on the Next and Previous buttons
          // that don't have an href.
          if (event.type === "click" && typeof href === "string") {
            return;
          }
          window.location.hash = `${this.props.location.pathname}?${search}`;
        }}
        current={
          pageIndex * NUMBER_OF_ITEMS_TO_SHOW === this.state.currentStartIndex
        }
      >
        {pageIndex + 1}
      </PaginationButton>
    );
  };

  render() {
    if (this.state == null) {
      return null;
    }
    const numberOfPages = Math.ceil(
      this.props.listItems.length / NUMBER_OF_ITEMS_TO_SHOW
    );
    if (numberOfPages === 1) {
      return this.props.listItems;
    }
    const currentPage = Math.ceil(
      this.state.currentStartIndex / NUMBER_OF_ITEMS_TO_SHOW
    );

    // https://instructure.design/#Pagination
    // Uses a sparse array for better perf when rendering pagination buttons for many pages.
    const pages = Array(numberOfPages);
    pages[0] = this.renderPaginationButton(0);
    pages[numberOfPages - 1] = this.renderPaginationButton(numberOfPages - 1);
    const visiblePageRangeStart = Math.max(currentPage - 1, 0);
    const visiblePageRangeEnd = Math.min(
      currentPage + NUMBER_OF_PAGINATION_BUTTONS_TO_RENDER,
      numberOfPages - 1
    );
    for (let i = visiblePageRangeStart; i < visiblePageRangeEnd; i++) {
      pages[i] = this.renderPaginationButton(i);
    }

    return (
      <React.Fragment>
        {this.props.listItems.slice(
          this.state.currentStartIndex,
          this.state.currentStartIndex + NUMBER_OF_ITEMS_TO_SHOW
        )}
        <I18n>
          {({ i18n }) => (
            <Pagination
              as="nav"
              margin="small"
              variant="compact"
              labelNext={i18n._(t`Next Page`)}
              labelPrev={i18n._(t`Previous Page`)}
            >
              {pages}
            </Pagination>
          )}
        </I18n>
      </React.Fragment>
    );
  }
}
