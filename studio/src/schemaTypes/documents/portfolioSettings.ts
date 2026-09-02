import { defineField, defineType } from "sanity";

export const portfolioSettings = defineType({
  name: "portfolioSettings",
  title: "Portfolio page text",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", title: "Small heading", type: "string", initialValue: "Portfolio · South Florida", validation: (rule) => rule.required().max(80) }),
    defineField({ name: "headline", title: "Main heading", type: "string", initialValue: "Our Projects", validation: (rule) => rule.required().max(80) }),
    defineField({ name: "headlineAccent", title: "Script heading", type: "string", initialValue: "See the Work", validation: (rule) => rule.required().max(80) }),
    defineField({ name: "intro", title: "Portfolio introduction", type: "text", rows: 4, validation: (rule) => rule.required().max(360) }),
    defineField({ name: "ctaLabel", title: "Bottom button", type: "string", initialValue: "Start a Project", validation: (rule) => rule.required().max(60) }),
  ],
});
