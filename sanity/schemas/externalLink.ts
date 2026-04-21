import { defineField, defineType } from "sanity";

// Collection used for both /resources/other-clubs and /resources/gear-vendors.
// The `kind` field splits them; `category` groups entries within each page.
export const externalLink = defineType({
  name: "externalLink",
  title: "External link",
  type: "document",
  fields: [
    defineField({
      name: "kind",
      title: "Kind",
      type: "string",
      options: {
        list: [
          { title: "Club (appears on /resources/other-clubs)", value: "club" },
          { title: "Gear vendor (appears on /resources/gear-vendors)", value: "vendor" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category heading",
      type: "string",
      description: "Entries are grouped under this heading on the page",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "url",
      title: "Website",
      type: "url",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "location",
      title: "Location (clubs only)",
      type: "string",
    }),
    defineField({
      name: "order",
      title: "Sort order (lower shows first)",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "category", media: "kind" },
    prepare: ({ title, subtitle }) => ({
      title,
      subtitle,
    }),
  },
});
