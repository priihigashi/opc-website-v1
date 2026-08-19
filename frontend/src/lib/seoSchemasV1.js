import { PORTFOLIO_PROJECTS, getPortfolioProject } from "@/data/portfolioProjectsV3";

export const SITE_ORIGIN = "https://oakpark-construction.com";
export const BUSINESS_ID = `${SITE_ORIGIN}/#business`;

const countyAreas = [
  { "@type": "AdministrativeArea", name: "Broward County, Florida" },
  { "@type": "AdministrativeArea", name: "Palm Beach County, Florida" },
  { "@type": "AdministrativeArea", name: "Miami-Dade County, Florida" },
];

const businessReference = {
  "@type": "GeneralContractor",
  "@id": BUSINESS_ID,
  name: "Oak Park Construction",
  url: `${SITE_ORIGIN}/`,
};

export const buildBusinessSchemaV1 = () => ({
  "@context": "https://schema.org",
  "@type": ["GeneralContractor", "HomeAndConstructionBusiness"],
  "@id": BUSINESS_ID,
  name: "Oak Park Construction",
  url: `${SITE_ORIGIN}/`,
  telephone: "+1-954-258-6769",
  email: "contact@oakpark-construction.com",
  logo: `${SITE_ORIGIN}/images/opc/logo-white-tight-v1.png`,
  image: `${SITE_ORIGIN}/video/portfolio-hero-poster-v2.jpg`,
  areaServed: countyAreas,
  sameAs: [
    "https://www.google.com/maps/place/Oak+Park+Construction/@26.274191,-80.1013505,17z/data=!4m8!3m7!1s0x8d5912b6498d4d2d:0xff621d01ac4d539d!8m2!3d26.274191!4d-80.1013505!9m1!1b1!16s%2Fg%2F11xzjcs8hj"
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Residential construction services",
    itemListElement: [
      "Full home renovations",
      "Kitchen remodeling",
      "Bathroom remodeling",
      "Residential new construction",
      "Home additions",
      "Shell construction",
      "Outdoor living construction",
      "Concrete and pavers"
    ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
  },
});

export const buildWebsiteSchemaV1 = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_ORIGIN}/#website`,
  url: `${SITE_ORIGIN}/`,
  name: "Oak Park Construction",
  publisher: { "@id": BUSINESS_ID },
});

const buildBreadcrumbSchemaV1 = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${SITE_ORIGIN}${item.path}`,
  })),
});

export const buildArticleSchemaV1 = ({ headline, description, path, image, datePublished, dateModified, authorName }) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline,
  description,
  mainEntityOfPage: `${SITE_ORIGIN}${path}`,
  image: image ? [`${SITE_ORIGIN}${image}`] : undefined,
  datePublished,
  dateModified: dateModified || datePublished,
  author: authorName ? { "@type": "Person", name: authorName } : { "@id": BUSINESS_ID },
  publisher: { "@id": BUSINESS_ID },
});

const allProjectImages = (project) => project.rows.flatMap((row) => row.images.map(([src, alt]) => ({ src, alt })));

export const buildRouteSchemasV1 = (path, route) => {
  if (!route) return [];

  if (route.type === "home") {
    return [buildBusinessSchemaV1(), buildWebsiteSchemaV1()];
  }

  if (route.type === "services") {
    return [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${SITE_ORIGIN}${path}#page`,
        name: route.title,
        description: route.description,
        url: `${SITE_ORIGIN}${path}`,
        about: { "@id": BUSINESS_ID },
      },
      buildBreadcrumbSchemaV1([{ name: "Home", path: "/" }, { name: "Services", path }]),
    ];
  }

  if (route.type === "service") {
    return [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${SITE_ORIGIN}${path}#service`,
        name: route.serviceName,
        description: route.description,
        url: `${SITE_ORIGIN}${path}`,
        image: `${SITE_ORIGIN}${route.image}`,
        provider: businessReference,
        areaServed: countyAreas,
        serviceType: route.serviceName,
      },
      buildBreadcrumbSchemaV1([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
        { name: route.serviceName, path },
      ]),
    ];
  }

  if (route.type === "portfolio") {
    return [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${SITE_ORIGIN}${path}#page`,
        name: route.title,
        description: route.description,
        url: `${SITE_ORIGIN}${path}`,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: PORTFOLIO_PROJECTS.map((project, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: project.title,
            url: `${SITE_ORIGIN}/portfolio/${project.id}`,
          })),
        },
      },
      buildBreadcrumbSchemaV1([{ name: "Home", path: "/" }, { name: "Portfolio", path }]),
    ];
  }

  if (route.type === "project") {
    const project = getPortfolioProject(route.projectId);
    if (!project) return [];
    const images = allProjectImages(project);
    return [
      {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "@id": `${SITE_ORIGIN}${path}#project`,
        name: project.title,
        description: project.intro,
        url: `${SITE_ORIGIN}${path}`,
        creator: businessReference,
        about: project.detail,
        image: images.map(({ src, alt }) => ({
          "@type": "ImageObject",
          contentUrl: `${SITE_ORIGIN}${src}`,
          caption: alt,
        })),
      },
      buildBreadcrumbSchemaV1([
        { name: "Home", path: "/" },
        { name: "Portfolio", path: "/portfolio" },
        { name: project.title, path },
      ]),
    ];
  }

  if (route.type === "areas") {
    return [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${SITE_ORIGIN}${path}#page`,
        name: route.title,
        description: route.description,
        url: `${SITE_ORIGIN}${path}`,
        about: countyAreas,
        provider: businessReference,
      },
      buildBreadcrumbSchemaV1([{ name: "Home", path: "/" }, { name: "Service Areas", path }]),
    ];
  }

  return [];
};
