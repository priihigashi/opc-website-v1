import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initAnalytics, trackPageView } from "./analytics";

/**
 * Boots GA4 once and reports a pageview on every SPA route change.
 * Entirely inert when REACT_APP_GA4_ID is absent.
 */
export default function useAnalytics() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    initAnalytics();
  }, []);
  useEffect(() => {
    trackPageView(`${pathname}${search}`);
  }, [pathname, search]);
}
