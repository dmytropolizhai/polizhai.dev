import { defineField, defineType } from "sanity";

export const clientQuoteType = defineType({
  name: "clientQuote",
  title: "Featured Client Quote",
  type: "document",
  fields: [
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
    defineField({
      name: "approval",
      title: "Client Approval",
      type: "string",
      options: {
        list: [
          { title: "Approved", value: "approved" },
          { title: "Pending client sign-off", value: "pending-client-signoff" },
        ],
        layout: "radio",
      },
      initialValue: "pending-client-signoff",
    }),
    defineField({ name: "heading", title: "Section Heading", type: "string", validation: (r) => r.required() }),
    defineField({ name: "quote", title: "Quote", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "name", title: "Client Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", title: "Client Role", type: "string" }),
    defineField({ name: "company", title: "Company", type: "string", validation: (r) => r.required() }),
  ],
  preview: {
    select: { title: "name", subtitle: "company" },
    prepare: ({ title, subtitle }) => ({
      title: `Client Quote · ${title ?? ""}`,
      subtitle,
    }),
  },
});
