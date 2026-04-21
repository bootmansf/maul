import { defineField, defineType } from "sanity";

export const anniversaryPage = defineType({
  name: "anniversaryPage",
  title: "20th Anniversary page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "tickets", title: "Tickets card" },
    { name: "hotel", title: "Hotel card" },
    { name: "schedule", title: "Schedule intro" },
  ],
  fields: [
    // Hero
    defineField({
      name: "heroHeading",
      title: "Heading",
      type: "string",
      group: "hero",
      description: "Line breaks render as actual breaks",
    }),
    defineField({
      name: "heroDates",
      title: "Dates line",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroLocation",
      title: "Location line",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroBody",
      title: "Body copy",
      type: "text",
      rows: 3,
      group: "hero",
    }),
    defineField({
      name: "countdownTarget",
      title: "Countdown target (ISO datetime)",
      type: "string",
      description: "Example: 2026-09-17T21:00:00 — drives the live countdown",
      group: "hero",
    }),
    defineField({
      name: "heroImage",
      title: "Hero background photo",
      type: "image",
      options: { hotspot: true },
      group: "hero",
    }),

    // Tickets card
    defineField({ name: "ticketsHeading", title: "Heading", type: "string", group: "tickets" }),
    defineField({ name: "ticketsBody", title: "Body", type: "string", group: "tickets" }),
    defineField({ name: "ticketsCtaLabel", title: "Button label", type: "string", group: "tickets" }),
    defineField({ name: "ticketsUrl", title: "Button URL", type: "url", group: "tickets" }),

    // Hotel card
    defineField({ name: "hotelHeading", title: "Heading", type: "string", group: "hotel" }),
    defineField({ name: "hotelName", title: "Hotel name", type: "string", group: "hotel" }),
    defineField({
      name: "hotelAddress",
      title: "Hotel address",
      type: "text",
      rows: 3,
      group: "hotel",
    }),
    defineField({ name: "hotelCtaLabel", title: "Button label", type: "string", group: "hotel" }),
    defineField({ name: "hotelUrl", title: "Button URL", type: "url", group: "hotel" }),

    // Schedule
    defineField({
      name: "scheduleHeading",
      title: "Schedule section heading",
      type: "string",
      group: "schedule",
    }),
  ],
  preview: { prepare: () => ({ title: "20th Anniversary page" }) },
});
