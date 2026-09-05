import { defineField } from "sanity";

// These fields are attached to a native image array member in gallerySequence.
// Keeping the member type native is what lets Sanity accept one file or a batch drop.
export const galleryImageFields = [
  defineField({ name: "sourceMetadata", title: "Verified website image dimensions", type: "object", readOnly: true,
    description: "Migration metadata. New uploads require image preparation before website preview.",
    fields: [
      defineField({ name: "id", type: "string" }),
      defineField({ name: "w", type: "number" }), defineField({ name: "h", type: "number" }),
      defineField({ name: "widths", type: "array", of: [{ type: "number" }] }),
      defineField({ name: "formats", type: "array", of: [{ type: "string" }] }),
      defineField({ name: "seq", type: "number" }), defineField({ name: "orientation", type: "string" }),
      defineField({ name: "originalRole", type: "string" }),
    ],
  }),
  defineField({
    name: "archived",
    title: "Archived (hidden, but restorable)",
    description: "Use this instead of permanently removing a photo.",
    type: "boolean",
    initialValue: false,
  }),
  defineField({
    name: "legacyPath",
    title: "Existing approved website image",
    description: "Migration-only fallback. New and imported Studio images use the asset above.",
    type: "string",
    readOnly: ({ parent }) => Boolean(parent?.asset),
  }),
  defineField({
    name: "alt",
    title: "What is visible in this photo?",
    description: "A short factual description for visitors who cannot see the image.",
    type: "string",
    validation: (rule) => rule.custom((value, context) => {
      if (context.parent?.archived) return true;
      if (!value || value.length < 8) return "Add a factual description of at least 8 characters.";
      if (value.length > 180) return "Keep the description under 180 characters.";
      return true;
    }),
  }),
  defineField({
    name: "phase",
    title: "Project phase",
    type: "string",
    options: {
      layout: "radio",
      list: [
        { title: "Before", value: "BEFORE" },
        { title: "During construction", value: "DURING" },
        { title: "Finished", value: "AFTER" },
      ],
    },
    validation: (rule) => rule.custom((value, context) => context.parent?.archived || Boolean(value) || "Choose the project phase."),
  }),
  defineField({
    name: "role",
    title: "Use",
    type: "string",
    initialValue: "gallery",
    options: {
      list: [
        { title: "Gallery photo", value: "gallery" },
        { title: "Project cover", value: "cover" },
      ],
    },
    validation: (rule) => rule.custom((value, context) => context.parent?.archived || Boolean(value) || "Choose how this photo is used."),
  }),
  defineField({
    name: "approvedForPublicUse",
    title: "Approved for public use",
    description: "Confirm ownership/permission and that no private address, document, plate, or person should be removed.",
    type: "boolean",
    initialValue: false,
    validation: (rule) => rule.custom((value, context) => context.parent?.archived || value === true || "Confirm public-use approval before publishing."),
  }),
];

export const validateGalleryImage = (value) => {
  if (value?.archived) return true;
  if (!value?.asset && !value?.legacyPath) return "Choose an uploaded image or an existing approved image.";
  if (value?.asset && value?.legacyPath) return "Use only one image source.";
  return true;
};
