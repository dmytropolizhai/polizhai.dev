import { defineArrayMember, defineField, defineType } from "sanity";

export const serviceType = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({
      name: "id",
      title: "Service ID",
      type: "string",
      options: {
        list: [
          { title: "Landing page", value: "landing" },
          { title: "Online shop", value: "ecommerce" },
          { title: "Web app", value: "webapp" },
          { title: "Monthly support", value: "support" },
        ],
      },
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
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "outcome",
      title: "Outcome",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price (EUR)",
      type: "number",
      description: "Leave empty for a custom quote.",
    }),
    defineField({
      name: "priceUnit",
      title: "Price Unit",
      type: "string",
      options: {
        list: [
          { title: "One-time", value: "once" },
          { title: "Monthly", value: "month" },
        ],
        layout: "radio",
      },
      initialValue: "once",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "proofIds",
      title: "Proof Project IDs",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: "Project IDs shown as 'See it live' (e.g. prolifts, curio).",
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
    select: { title: "name", price: "price", unit: "priceUnit" },
    prepare: ({ title, price, unit }) => ({
      title: title ?? "Untitled",
      subtitle: price != null ? `${price} € (${unit})` : "Custom quote",
    }),
  },
});
