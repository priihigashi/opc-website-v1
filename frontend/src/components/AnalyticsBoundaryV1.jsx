import useAnalytics from "@/lib/useAnalytics";

/**
 * Mounts the analytics hook inside BrowserRouter, which useLocation requires.
 * Renders nothing and is completely inert without REACT_APP_GA4_ID.
 */
export default function AnalyticsBoundaryV1() {
  useAnalytics();
  return null;
}
