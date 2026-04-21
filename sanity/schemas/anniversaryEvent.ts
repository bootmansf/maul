import { defineField, defineType } from "sanity";

export const anniversaryEvent = defineType({
  name: "anniversaryEvent",
  title: "20th Anniversary Event",
  type: "document",
  fields: [
    defineField({
      name: "event",
      title: "Event",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "event", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "startTime",
      title: "Event Start Time",
      type: "string",
      description: "e.g. 6:00 PM",
    }),
    defineField({
      name: "endTime",
      title: "Event End Time",
      type: "string",
      description: "e.g. 10:00 PM",
    }),
    defineField({
      name: "venue",
      title: "Venue",
      type: "string",
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
  preview: {
    select: { title: "event", subtitle: "date" },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle
          ? new Date(subtitle).toLocaleDateString()
          : undefined,
      };
    },
  },
});
