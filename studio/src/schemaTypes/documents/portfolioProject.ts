import { defineField, defineType } from "sanity";

export const portfolioProject = defineType({
  name: "portfolioProject",
  title: "Portfolio project",
  type: "document",
  fields: [
    defineField({ name: "progressOnly", title: "Construction progress project", type: "boolean", initialValue: false }),
    defineField({ name: "imageCount", title: "Imported photo count", type: "number", readOnly: true, description: "Preview recalculates the actual active photo count." }),
    defineField({ name: "title", title: "Project name", type: "string", validation: (rule) => rule.required().max(100) }),
    defineField({
      name: "slug",
      title: "Permanent project URL",
      description: "Set this once. Changing it after publication requires a redirect.",
      type: "slug",
      options: { source: "title", maxLength: 100 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "portfolioCategory" }], options: { disableNew: false } }],
      validation: (rule) => rule.required().min(1).unique(),
    }),
    defineField({ name: "primaryCategory", title: "Primary category label", type: "string", validation: (rule) => rule.required().max(60) }),
    defineField({ name: "statusLabel", title: "Status shown on the card", type: "string", initialValue: "Finished", validation: (rule) => rule.required().max(60) }),
    defineField({ name: "detail", title: "Short card description", type: "string", validation: (rule) => rule.required().max(120) }),
    defineField({ name: "intro", title: "Project introduction", type: "text", rows: 3, validation: (rule) => rule.required().max(360) }),
    defineField({ name: "featured", title: "Featured in All Projects", type: "boolean", initialValue: false }),
    defineField({
      name: "order",
      title: "Display order",
      description: "Lower numbers appear first. This lets you rearrange projects without changing the website design.",
      type: "number",
      initialValue: 100,
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({ name: "archived", title: "Archived (hidden from the website)", type: "boolean", initialValue: false }),
    defineField({
      name: "sequences",
      title: "Project photos",
      type: "array",
      of: [{ type: "gallerySequence" }],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  validation: (rule) => rule.custom((project) => {
    const images = project?.sequences?.flatMap((sequence: { images?: Array<{ role?: string }> }) => sequence.images || []) || [];
    const covers = images.filter((image: { role?: string; archived?: boolean }) => image.role === "cover" && !image.archived);
    if (covers.length !== 1) return "Choose exactly one project cover photo.";
    return true;
  }),
  preview: {
    select: { title: "title", subtitle: "primaryCategory", archived: "archived", order: "order", media: "sequences.0.images.0.asset" },
    prepare: ({ title, subtitle, archived, order, media }) => ({
      title: archived ? `ARCHIVED — ${title}` : title,
      subtitle: `${subtitle || "Uncategorized"} · Order ${order ?? "—"}`,
      media,
    }),
  },
});
