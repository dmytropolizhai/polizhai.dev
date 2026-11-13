import { defineField, defineType } from "sanity";

export const testimonialType = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "id", title: "ID", type: "string", validation: (r) => r.required() }),
    defineField({ name: "order", title: "Display Order", type: "number", initialValue: 0 }),
    defineField({ name: "name", title: "Author Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", title: "Role", type: "string", validation: (r) => r.required() }),
    defineField({ name: "company", title: "Company", type: "string", validation: (r) => r.required() }),
    defineField({ name: "project", title: "Project ID", type: "string" }),
    defineField({
      name: "kind",
      title: "Kind",
      type: "string",
      options: {
        list: [
          { title: "Client", value: "client" },
          { title: "Venture", value: "venture" },
        ],
        layout: "radio",
      },
      initialValue: "client",
    }),
    defineField({ name: "quote", title: "Quote", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "context", title: "Context", type: "string" }),
    defineField({ name: "photo", title: "Photo", type: "image", options: { hotspot: true } }),
    defineField({ name: "photoFallback", title: "Local Photo Path (Fallback)", type: "string" }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "company", media: "photo" },
  },
});
