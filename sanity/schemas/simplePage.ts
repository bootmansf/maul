import { defineField, defineType } from "sanity";

// Shared schema for simple text+image pages: /about, /about/our-mission,
// /about/letter-from-the-chief, /about/letter-from-the-colonel.
// Each page is one Sanity document identified by a known _id.
export const simplePage = defineType({
  name: "simplePage",
  title: "Simple page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page heading",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle (small line under the heading)",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Superscript", value: "sup" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    title: "URL",
                    type: "string",
                    description: "Use /path for internal or https:// for external",
                  },
                ],
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: "image",
      title: "Side image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "signatureName",
      title: "Signature — name",
      type: "string",
      description: "Only used on letter pages",
    }),
    defineField({
      name: "signatureTitle",
      title: "Signature — title/role",
      type: "string",
      description: "Optional, e.g. 'Chief'",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "subtitle" },
  },
});
