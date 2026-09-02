import { defineField, defineType } from "sanity";

export const releaseSnapshot = defineType({
  name: "releaseSnapshot",
  title: "Published release snapshot",
  type: "document",
  readOnly: true,
  fields: [
    defineField({ name: "releaseId", title: "Release ID", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "checksum", title: "Content checksum", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "previousReleaseId", title: "Previous release", type: "string" }),
    defineField({ name: "actor", title: "Published by", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "deploymentStatus", title: "Deployment status", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "snapshot", title: "Exact published content snapshot", type: "text", rows: 20, validation: (rule) => rule.required() }),
  ],
  preview: {
    select: { title: "releaseId", subtitle: "deploymentStatus" },
  },
});
