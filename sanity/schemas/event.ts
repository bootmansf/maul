import { defineField, defineType } from "sanity";

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Event Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "dateTime",
      title: "Date & Time",
      type: "datetime",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "locationVenue",
      title: "Location / Venue",
      type: "string",
    }),
    defineField({
      name: "venueAddress",
      title: "Venue Address",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "eventPicture",
      title: "Event Picture",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "infoLink",
      title: "Info Link",
      type: "url",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "dateTime", media: "eventPicture" },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle
          ? new Date(subtitle).toLocaleDateString()
          : undefined,
        media,
      };
    },
  },
});
