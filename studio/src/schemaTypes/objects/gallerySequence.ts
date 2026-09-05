import { defineField, defineType } from "sanity";
import { galleryImageFields, validateGalleryImage } from "./galleryImage";

export const gallerySequence = defineType({
  name: "gallerySequence",
  title: "Photo sequence",
  type: "object",
  fields: [
    defineField({ name: "phases", title: "Imported phase record", type: "array", of: [{ type: "string" }], readOnly: true, description: "Preview recomputes these from photo phases after editing." }),
    defineField({
      name: "label",
      title: "Sequence title",
      description: "Example: Kitchen + Bath · Before → During Construction → Finished",
      type: "string",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "images",
      title: "Photos",
      description: "Drop one image or many images here, then drag to reorder.",
      type: "array",
      of: [{
        type: "image",
        options: { hotspot: true, accept: "image/jpeg,image/png,image/webp,image/avif" },
        fields: galleryImageFields,
        validation: (rule) => rule.custom(validateGalleryImage),
      }],
      options: { layout: "grid" },
      validation: (rule) => rule.required().min(1).max(80),
    }),
  ],
  preview: {
    select: { title: "label", images: "images" },
    prepare: ({ title, images }) => ({ title, subtitle: `${images?.length || 0} photos` }),
  },
});
