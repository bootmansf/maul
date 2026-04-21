import { defineField, defineType } from "sanity";

export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "about", title: "About block" },
    { name: "features", title: "Features" },
    { name: "events", title: "Events block" },
    { name: "contact", title: "Contact block" },
  ],
  fields: [
    // Hero
    defineField({
      name: "heroHeading",
      title: "Heading",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroBody",
      title: "Body copy",
      type: "text",
      rows: 4,
      group: "hero",
    }),
    defineField({
      name: "heroCtaLabel",
      title: "Button label",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroCtaLink",
      title: "Button link",
      type: "string",
      description: "Use a path like /about or a full https:// URL",
      group: "hero",
    }),

    // About block
    defineField({
      name: "aboutHeading",
      title: "Heading",
      type: "string",
      group: "about",
    }),
    defineField({
      name: "aboutBody",
      title: "Body copy",
      type: "text",
      rows: 4,
      group: "about",
    }),
    defineField({
      name: "aboutCtaLabel",
      title: "Button label",
      type: "string",
      group: "about",
    }),
    defineField({
      name: "aboutCtaLink",
      title: "Button link",
      type: "string",
      group: "about",
    }),
    defineField({
      name: "aboutImage",
      title: "Main photo",
      type: "image",
      options: { hotspot: true },
      group: "about",
    }),

    // Features
    defineField({
      name: "featuresHeading",
      title: "Section heading",
      type: "string",
      group: "features",
    }),
    defineField({
      name: "featureCards",
      title: "Cards",
      type: "array",
      group: "features",
      of: [
        defineField({
          name: "card",
          type: "object",
          fields: [
            defineField({
              name: "title",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({ name: "body", type: "text", rows: 3 }),
            defineField({
              name: "image",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({ name: "ctaLabel", title: "Button label", type: "string" }),
            defineField({ name: "ctaLink", title: "Button link", type: "string" }),
          ],
          preview: { select: { title: "title", media: "image" } },
        }),
      ],
      validation: (r) => r.max(3),
    }),

    // Events block (surrounding copy — the list itself stays wired to the event collection)
    defineField({
      name: "eventsHeading",
      title: "Heading",
      type: "string",
      group: "events",
    }),
    defineField({
      name: "eventsBody",
      title: "Body copy",
      type: "text",
      rows: 4,
      group: "events",
    }),
    defineField({
      name: "eventsPartnerHeading",
      title: "Partner card heading",
      type: "string",
      group: "events",
    }),
    defineField({
      name: "eventsPartnerBody",
      title: "Partner card body",
      type: "text",
      rows: 2,
      group: "events",
    }),

    // Contact
    defineField({
      name: "contactHeading",
      title: "Heading",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "contactBody",
      title: "Body copy",
      type: "text",
      rows: 3,
      group: "contact",
    }),
    defineField({
      name: "contactEmail",
      title: "Email address",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "contactMembershipHeading",
      title: "Membership card heading",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "contactMembershipBody",
      title: "Membership card body",
      type: "text",
      rows: 2,
      group: "contact",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Homepage" }),
  },
});
