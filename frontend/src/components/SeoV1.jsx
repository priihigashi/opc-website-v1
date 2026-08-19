import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import seoRoutes from "@/data/seoRoutesV1.json";
import { buildRouteSchemasV1, SITE_ORIGIN } from "@/lib/seoSchemasV1";

const upsertMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
};

const normalizePath = (pathname) => {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "");
};

const getSeoState = (pathname) => {
  const path = normalizePath(pathname);
  const route = seoRoutes[path];
  const knownRoute = Boolean(route);
  const resolvedRoute = route || {};
  const canonicalPath = knownRoute ? path : "/";

  return {
    path,
    route,
    title: resolvedRoute.title || "Page Not Found | Oak Park Construction",
    description: resolvedRoute.description || "Oak Park Construction residential construction services and project portfolio.",
    robots: resolvedRoute.robots || (knownRoute ? "index,follow" : "noindex,follow"),
    canonical: `${SITE_ORIGIN}${canonicalPath}`,
    image: `${SITE_ORIGIN}${resolvedRoute.image || "/video/portfolio-hero-poster-v2.jpg"}`,
    imageAlt: resolvedRoute.imageAlt || "Oak Park Construction residential project",
  };
};

const applyMetadata = ({ route, title, description, robots, canonical, image, imageAlt }) => {
  document.title = title;
  document.documentElement.lang = "en";
  upsertMeta('meta[name="description"]', { name: "description", content: description });
  upsertMeta('meta[name="robots"]', { name: "robots", content: robots });
  upsertMeta('meta[property="og:type"]', { property: "og:type", content: route?.type === "project" ? "article" : "website" });
  upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: "Oak Park Construction" });
  upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
  upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
  upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
  upsertMeta('meta[property="og:image"]', { property: "og:image", content: image });
  upsertMeta('meta[property="og:image:alt"]', { property: "og:image:alt", content: imageAlt });
  upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
  upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
  upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
  upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: image });
  upsertMeta('meta[name="twitter:image:alt"]', { name: "twitter:image:alt", content: imageAlt });
};

const applyCanonical = (canonical) => {
  let canonicalLink = document.head.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement("link");
    canonicalLink.setAttribute("rel", "canonical");
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute("href", canonical);
};

const applySchemas = (path, route) => {
  document.head.querySelectorAll('script[data-opc-seo="v1"]').forEach((script) => script.remove());
  buildRouteSchemasV1(path, route).forEach((schema, index) => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.opcSeo = "v1";
    script.dataset.schemaIndex = String(index);
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  });
};

const applySearchConsoleVerification = () => {
  const verification = process.env.REACT_APP_GOOGLE_SITE_VERIFICATION;
  const existingVerification = document.head.querySelector('meta[name="google-site-verification"]');
  if (verification) {
    upsertMeta('meta[name="google-site-verification"]', { name: "google-site-verification", content: verification });
  } else if (existingVerification) {
    existingVerification.remove();
  }
};

export default function SeoV1() {
  const { pathname } = useLocation();

  useEffect(() => {
    const state = getSeoState(pathname);
    applyMetadata(state);
    applyCanonical(state.canonical);
    applySchemas(state.path, state.route);
    applySearchConsoleVerification();
  }, [pathname]);

  return null;
}
