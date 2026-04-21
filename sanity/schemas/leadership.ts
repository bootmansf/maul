import { defineField, defineType } from "sanity";

export const leadership = defineType({
  name: "leadership",
  title: "Leadership",
  type: "document",
  fields: [
    defineField({
      name: "position",
      title: "Position",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "position", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "fullName",
      title: "Full Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "picture",
      title: "Picture",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "instagram",
      title: "Instagram",
      type: "url",
    }),
    defineField({
      name: "facebook",
      title: "Facebook",
      type: "url",
    }),
    defineField({
      name: "bluesky",
      title: "Bluesky",
      type: "url",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first",
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "fullName", subtitle: "position", media: "picture" },
  },
});
