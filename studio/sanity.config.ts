import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/schemaTypes";
import { ownerStructure } from "./src/structure/ownerStructure";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;

if (!projectId) {
  throw new Error("SANITY_STUDIO_PROJECT_ID is required. The owner Studio will not start against an unknown project.");
}

export default defineConfig({
  name: "opc-owner-studio",
  title: "Oak Park Website Editor",
  projectId,
  dataset: process.env.SANITY_STUDIO_DATASET || "portfolio-test",
  basePath: "/studio",
  plugins: [structureTool({ structure: ownerStructure })],
  schema: {
    types: schemaTypes,
    templates: (previous) => [
      ...previous,
      {
        id: "portfolio-project-blank",
        title: "New portfolio project",
        description: "A clean project with one empty photo sequence. Existing projects and photos are never copied.",
        schemaType: "portfolioProject",
        value: {
          statusLabel: "Finished",
          featured: false,
          archived: false,
          order: 100,
          sequences: [{ _type: "gallerySequence", _key: "main", label: "Finished", images: [] }],
        },
      },
    ],
  },
  document: {
    actions: (previous, context) => {
      if (["portfolioCategory", "portfolioProject", "portfolioSettings", "releaseSnapshot"].includes(context.schemaType)) {
        return previous.filter((action) => action.action !== "delete");
      }
      return previous;
    },
  },
});
