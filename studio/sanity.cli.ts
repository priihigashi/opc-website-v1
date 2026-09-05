import { defineCliConfig } from "sanity/cli";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;

if (!projectId) {
  throw new Error("SANITY_STUDIO_PROJECT_ID is required. Create/select the OPC Sanity project before running Studio commands.");
}

export default defineCliConfig({
  api: {
    projectId,
    dataset: process.env.SANITY_STUDIO_DATASET || "portfolio-test",
  },
});
