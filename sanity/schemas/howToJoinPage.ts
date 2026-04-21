import { defineField, defineType } from "sanity";

export const howToJoinPage = defineType({
  name: "howToJoinPage",
  title: "How to Join page",
  type: "document",
  groups: [
    { name: "header", title: "Header", default: true },
    { name: "steps", title: "Accordion steps" },
    { name: "sidebar", title: "Sidebar" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Page heading",
      type: "string",
      group: "header",
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      group: "header",
    }),

    defineField({
      name: "steps",
      title: "Accordion steps",
      type: "array",
      group: "steps",
      of: [
        defineField({
          name: "step",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Step title (e.g. 'Step One: Come and meet us')",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "body",
              title: "Body",
              type: "array",
              of: [
                {
                  type: "block",
                  marks: {
                    decorators: [
                      { title: "Strong", value: "strong" },
                      { title: "Emphasis", value: "em" },
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
                          },
                        ],
                      },
                    ],
                  },
                },
              ],
            }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
    }),

    defineField({
      name: "infoCards",
      title: "Info cards below the steps",
      type: "array",
      group: "sidebar",
      of: [
        defineField({
          name: "card",
          type: "object",
          fields: [
            defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
            defineField({ name: "body", type: "text", rows: 4 }),
          ],
          preview: { select: { title: "heading" } },
        }),
      ],
    }),

    defineField({
      name: "sidebarImage",
      title: "Sidebar image",
      type: "image",
      options: { hotspot: true },
      group: "sidebar",
    }),
    defineField({
      name: "contactHeading",
      title: "Contact card heading",
      type: "string",
      group: "sidebar",
    }),
    defineField({
      name: "contactBody",
      title: "Contact card body",
      type: "array",
      of: [
        {
          type: "block",
          marks: {
            decorators: [{ title: "Strong", value: "strong" }],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [{ name: "href", title: "URL", type: "string" }],
              },
            ],
          },
        },
      ],
      group: "sidebar",
    }),
  ],
  preview: { prepare: () => ({ title: "How to Join page" }) },
});
