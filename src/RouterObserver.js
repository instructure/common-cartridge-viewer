import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function RouterObserver({ onHistoryChange }) {
  const location = useLocation();
  const url = useRef("/");

  useEffect(() => {
    if (url.current !== location.pathname) {
      url.current = location.pathname;
      if (onHistoryChange) {
        onHistoryChange({ location });
      }
    }
  });

  return null;
}
