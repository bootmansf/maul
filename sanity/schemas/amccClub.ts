import { defineField, defineType } from "sanity";

export const amccClub = defineType({
  name: "amccClub",
  title: "AMCC Club",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "websiteLink",
      title: "Website Link",
      type: "url",
    }),
    defineField({
      name: "location",
      title: "Location (City, State)",
      type: "string",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "location", media: "logo" },
  },
});
