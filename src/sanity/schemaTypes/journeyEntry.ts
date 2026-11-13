import { defineField, defineType } from "sanity";

export const journeyEntryType = defineType({
  name: "journeyEntry",
  title: "Journey Entry",
  type: "document",
  fields: [
    defineField({
      name: "id",
      title: "Entry ID",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 0,
      validation: (rule) => rule.required().integer(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "when",
      title: "When",
      type: "string",
      description: 'Year ("2025") or Year-Month ("2026-09"). Leave empty if unverified.',
    }),
    defineField({
      name: "status",
      title: "Visibility",
      type: "string",
      options: {
        list: [
          { title: "Visible", value: "visible" },
          { title: "Hidden", value: "hidden" },
        ],
        layout: "radio",
      },
      initialValue: "visible",
      validation: (rule) => rule.required(),
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
    select: { title: "title", when: "when", status: "status" },
    prepare: ({ title, when, status }) => ({
      title: title ?? "Untitled",
      subtitle: `${when || "No date"} · ${status ?? "visible"}`,
    }),
  },
});
