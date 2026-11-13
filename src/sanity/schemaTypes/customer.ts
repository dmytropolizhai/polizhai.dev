import { defineField, defineType } from "sanity";

export const customerType = defineType({
  name: "customer",
  title: "Customer",
  type: "document",
  fields: [
    defineField({ name: "order", title: "Display Order", type: "number", initialValue: 0 }),
    defineField({ name: "name", title: "Customer Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "href", title: "Website URL", type: "url" }),
    defineField({ name: "logo", title: "Logo", type: "image" }),
    defineField({ name: "logoFallback", title: "Local Logo Path (Fallback)", type: "string" }),
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
    select: { title: "name", subtitle: "href", media: "logo" },
  },
});
