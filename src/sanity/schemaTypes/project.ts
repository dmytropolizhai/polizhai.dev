import { defineArrayMember, defineField, defineType } from "sanity";

export const projectType = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "id",
      title: "Project ID",
      type: "string",
      description: "Stable identifier matching layout keys (e.g. prolifts, stundio, curio, numerologgi, zinly).",
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
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Live", value: "live" },
          { title: "Repo only", value: "repo-only" },
          { title: "Hidden", value: "hidden" },
        ],
        layout: "radio",
      },
      initialValue: "live",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "kind",
      title: "Kind",
      type: "string",
      options: {
        list: [
          { title: "Client", value: "client" },
          { title: "Own product", value: "own" },
          { title: "Code", value: "code" },
          { title: "Side project", value: "side" },
        ],
        layout: "radio",
      },
      initialValue: "client",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "kindLabel",
      title: "Kind Label",
      type: "string",
      description: "Human-readable label shown on the card/dialog (e.g. Client site, Open source).",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "display",
      title: "Display Host",
      type: "string",
      description: "Host shown on the project card (e.g. pro-lifts.lv).",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "oneLiner",
      title: "One-Liner",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "text",
      rows: 2,
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
      name: "note",
      title: "Note",
      type: "string",
    }),
    defineField({
      name: "stack",
      title: "Tech Stack",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "stats",
      title: "Stats",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "id", title: "Stat ID", type: "string", validation: (r) => r.required() }),
            defineField({ name: "value", title: "Value", type: "number", validation: (r) => r.required() }),
            defineField({
              name: "suffix",
              title: "Suffix",
              type: "string",
              options: { list: ["", "+", "%"] },
              initialValue: "",
            }),
            defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
          ],
          preview: {
            select: { value: "value", suffix: "suffix", label: "label" },
            prepare: ({ value, suffix, label }) => ({
              title: `${value ?? ""}${suffix ?? ""}`,
              subtitle: label,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "kind",
              title: "Kind",
              type: "string",
              options: {
                list: [
                  { title: "Visit live site", value: "visit" },
                  { title: "Open app", value: "app" },
                  { title: "Project site", value: "site" },
                  { title: "Case study", value: "caseStudy" },
                  { title: "Source on GitHub", value: "source" },
                  { title: "Contact", value: "contact" },
                ],
              },
              validation: (r) => r.required(),
            }),
            defineField({ name: "href", title: "URL or Path", type: "string", validation: (r) => r.required() }),
          ],
          preview: {
            select: { kind: "kind", href: "href" },
            prepare: ({ kind, href }) => ({ title: kind, subtitle: href }),
          },
        }),
      ],
    }),
    defineField({
      name: "caseStudySlug",
      title: "Case Study Slug",
      type: "string",
    }),
    defineField({
      name: "screenshot",
      title: "Screenshot",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "screenshotFallback",
      title: "Local Screenshot Base Path (Fallback)",
      type: "string",
      description: "Optional fallback base path in /public (e.g. /shots/prolifts).",
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
    select: { title: "name", subtitle: "display", status: "status", media: "screenshot" },
    prepare: ({ title, subtitle, status, media }) => ({
      title: `${title ?? "Untitled"} (${status ?? "unknown"})`,
      subtitle,
      media,
    }),
  },
});
