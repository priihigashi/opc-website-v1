import { defineField, defineType } from "sanity";

export const portfolioCategory = defineType({
  name: "portfolioCategory",
  title: "Portfolio category",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Category name", type: "string", validation: (rule) => rule.required().max(60) }),
    defineField({
      name: "slug",
      title: "Permanent URL name",
      type: "slug",
      options: { source: "title", maxLength: 80 },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "order", title: "Display order", type: "number", initialValue: 100, validation: (rule) => rule.required().integer().min(0) }),
    defineField({ name: "archived", title: "Archived (hidden from the website)", type: "boolean", initialValue: false }),
  ],
  preview: {
    select: { title: "title", archived: "archived", order: "order" },
    prepare: ({ title, archived, order }) => ({ title: archived ? `ARCHIVED — ${title}` : title, subtitle: `Order ${order ?? "—"}` }),
  },
});
