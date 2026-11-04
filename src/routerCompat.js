import React from "react";
import { matchPath, useLocation } from "react-router-dom";

const match = (path, exact, pathname) => {
  const result = matchPath({ path, end: !!exact }, pathname);
  return result && { params: result.params, url: result.pathname };
};

export function Route({ path, exact, render }) {
  const location = useLocation();
  const matched = match(path, exact, location.pathname);
  return matched ? render({ match: matched, location }) : null;
}

export function Switch({ children }) {
  const { pathname } = useLocation();
  const element = React.Children.toArray(children).find(
    (child) => child.props.path == null || match(child.props.path, child.props.exact, pathname),
  );
  return element || null;
}
