import { defineArrayMember, defineField, defineType } from "sanity";

export const servicesSettingsType = defineType({
  name: "servicesSettings",
  title: "Services Settings",
  type: "document",
  fields: [
    defineField({
      name: "show",
      title: "Show Services Section",
      type: "boolean",
      initialValue: true,
    }),
    defineField({ name: "heading", title: "Heading", type: "string", validation: (r) => r.required() }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 2, validation: (r) => r.required() }),
    defineField({ name: "pickPrompt", title: "Picker Prompt", type: "string", validation: (r) => r.required() }),
    defineField({ name: "cta", title: "CTA Label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "proofLabel", title: "Proof Label", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "priceFrom",
      title: "Price 'From' Template",
      type: "string",
      description: "Must contain {price}.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "priceCustom", title: "Custom Price Label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "priceMonthUnit", title: "Month Unit Label", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "priceTier",
      title: "Tier Price Template",
      type: "string",
      description: "Must contain {price}.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "supportFreeNote", title: "Support Free Note", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "supportTiers",
      title: "Support Tiers",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "id",
              title: "Tier ID",
              type: "string",
              options: { list: ["basic", "standard", "premium"] },
              validation: (r) => r.required(),
            }),
            defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "includes", title: "Includes", type: "string", validation: (r) => r.required() }),
            defineField({ name: "price", title: "Monthly Price (EUR)", type: "number", validation: (r) => r.required() }),
          ],
          preview: {
            select: { title: "name", price: "price" },
            prepare: ({ title, price }) => ({ title, subtitle: `${price ?? 0} € / month` }),
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Services Settings" }),
  },
});
