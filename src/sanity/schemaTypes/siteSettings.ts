import { defineArrayMember, defineField, defineType } from "sanity";

const figureField = () =>
  defineArrayMember({
    type: "object",
    fields: [
      defineField({ name: "value", title: "Value", type: "string", validation: (r) => r.required() }),
      defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
    ],
    preview: {
      select: { title: "value", subtitle: "label" },
    },
  });

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "meta", title: "SEO & Meta" },
    { name: "identity", title: "Identity & About" },
    { name: "hero", title: "Hero & Work" },
    { name: "how", title: "How I Work" },
    { name: "contact", title: "Contact & Nav" },
  ],
  fields: [
    // SEO & Meta
    defineField({ name: "metaTitle", title: "Meta Title", type: "string", group: "meta" }),
    defineField({ name: "metaDescription", title: "Meta Description", type: "text", rows: 2, group: "meta" }),
    defineField({ name: "ogTitle", title: "Open Graph Title", type: "string", group: "meta" }),
    defineField({ name: "ogDescription", title: "Open Graph Description", type: "text", rows: 2, group: "meta" }),
    defineField({ name: "ogImageAlt", title: "Open Graph Image Alt", type: "string", group: "meta" }),
    defineField({ name: "ogImage", title: "Open Graph Image", type: "image", group: "meta" }),

    // Identity & About
    defineField({ name: "name", title: "Full Name", type: "string", group: "identity" }),
    defineField({ name: "givenName", title: "Given Name", type: "string", group: "identity" }),
    defineField({ name: "familyName", title: "Family Name", type: "string", group: "identity" }),
    defineField({ name: "ukrainian", title: "Ukrainian Name", type: "string", group: "identity" }),
    defineField({ name: "phonetic", title: "Phonetic Pronunciation", type: "string", group: "identity" }),
    defineField({ name: "phoneticStress", title: "Stressed Syllable", type: "string", group: "identity" }),
    defineField({ name: "jobTitle", title: "Job Title", type: "string", group: "identity" }),
    defineField({ name: "city", title: "City", type: "string", group: "identity" }),
    defineField({ name: "country", title: "Country Code", type: "string", group: "identity" }),
    defineField({ name: "email", title: "Primary Email", type: "string", group: "identity" }),
    defineField({ name: "copyrightYear", title: "Copyright Year", type: "number", group: "identity" }),
    defineField({ name: "portrait", title: "Portrait", type: "image", options: { hotspot: true }, group: "identity" }),
    defineField({ name: "portraitFallback", title: "Local Portrait Path (Fallback)", type: "string", group: "identity" }),
    defineField({ name: "aboutHeading", title: "About Heading", type: "string", group: "identity" }),
    defineField({ name: "nameLabel", title: "Pronunciation Label", type: "string", group: "identity" }),
    defineField({
      name: "bio",
      title: "Bio Paragraphs",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 3 })],
      group: "identity",
    }),
    defineField({ name: "originLine", title: "Origin Line", type: "text", rows: 2, group: "identity" }),
    defineField({ name: "schoolLine", title: "School Line", type: "string", group: "identity" }),
    defineField({ name: "languagesHeading", title: "Languages Heading", type: "string", group: "identity" }),
    defineField({ name: "nativeLabel", title: "Native Label", type: "string", group: "identity" }),
    defineField({
      name: "languages",
      title: "Spoken Languages",
      type: "array",
      group: "identity",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "code", title: "Code", type: "string", options: { list: ["uk", "ru", "lv", "en"] } }),
            defineField({ name: "name", title: "Display Name", type: "string" }),
            defineField({ name: "level", title: "Level", type: "string", options: { list: ["native", "B1"] } }),
          ],
          preview: {
            select: { title: "name", subtitle: "level" },
          },
        }),
      ],
    }),
    defineField({ name: "certificatesHeading", title: "Certificates Heading", type: "string", group: "identity" }),
    defineField({ name: "certificatesNote", title: "Certificates Note", type: "string", group: "identity" }),
    defineField({
      name: "certificates",
      title: "Certificates",
      type: "array",
      group: "identity",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "issuer", title: "Issuer", type: "string" }),
            defineField({ name: "href", title: "Share URL", type: "url" }),
          ],
          preview: {
            select: { title: "title", subtitle: "issuer" },
          },
        }),
      ],
    }),

    // Hero & Work
    defineField({ name: "heroHeadline", title: "Hero Headline (H1)", type: "string", group: "hero" }),
    defineField({ name: "heroIdentity", title: "Hero Identity Line", type: "string", group: "hero" }),
    defineField({ name: "heroSubline", title: "Hero Subline", type: "text", rows: 2, group: "hero" }),
    defineField({ name: "heroSeeWork", title: "See Work Button", type: "string", group: "hero" }),
    defineField({ name: "workHeading", title: "Work Heading", type: "string", group: "hero" }),
    defineField({ name: "workIntro", title: "Work Intro", type: "string", group: "hero" }),
    defineField({ name: "canvasTitle", title: "Canvas Accessible Title", type: "string", group: "hero" }),
    defineField({ name: "cursorDrag", title: "Cursor Pill (Drag)", type: "string", group: "hero" }),
    defineField({ name: "cursorView", title: "Cursor Pill (View)", type: "string", group: "hero" }),
    defineField({ name: "outcomeLabel", title: "Outcome Label", type: "string", group: "hero" }),
    defineField({ name: "showProjectOutcome", title: "Show Project Outcome in Dialog", type: "boolean", initialValue: true, group: "hero" }),

    // How I Work
    defineField({ name: "howHeading", title: "How Heading", type: "string", group: "how" }),
    defineField({ name: "howIntro", title: "How Intro", type: "string", group: "how" }),
    defineField({ name: "howLaunchTitle", title: "Launch Cell Title", type: "string", group: "how" }),
    defineField({ name: "howLaunchBody", title: "Launch Cell Body", type: "text", rows: 3, group: "how" }),
    defineField({ name: "howLaunchFigures", title: "Launch Figures", type: "array", of: [figureField()], group: "how" }),
    defineField({ name: "howLaunchStages", title: "Launch Stages", type: "array", of: [defineArrayMember({ type: "string" })], group: "how" }),
    defineField({ name: "howCmsTitle", title: "CMS Cell Title", type: "string", group: "how" }),
    defineField({ name: "howCmsBody", title: "CMS Cell Body", type: "text", rows: 3, group: "how" }),
    defineField({ name: "howCmsFigureValue", title: "CMS Figure Value", type: "string", group: "how" }),
    defineField({ name: "howCmsFigureLabel", title: "CMS Figure Label", type: "string", group: "how" }),
    defineField({ name: "howCmsTools", title: "CMS Tools", type: "array", of: [defineArrayMember({ type: "string" })], group: "how" }),
    defineField({ name: "howSpeedTitle", title: "Speed Cell Title", type: "string", group: "how" }),
    defineField({ name: "howSpeedBody", title: "Speed Cell Body", type: "text", rows: 3, group: "how" }),
    defineField({ name: "howSpeedStack", title: "Speed Stack", type: "array", of: [defineArrayMember({ type: "string" })], group: "how" }),
    defineField({ name: "showBudgetFigures", title: "Show Speed Budget Figures", type: "boolean", initialValue: true, group: "how" }),
    defineField({ name: "budgetFigures", title: "Speed Budget Figures", type: "array", of: [figureField()], group: "how" }),
    defineField({ name: "howSupportTitle", title: "Support Cell Title", type: "string", group: "how" }),
    defineField({ name: "howSupportBody", title: "Support Cell Body", type: "text", rows: 3, group: "how" }),
    defineField({ name: "howSupportPhases", title: "Support Phases", type: "array", of: [figureField()], group: "how" }),
    defineField({ name: "howSupportTags", title: "Support Tags", type: "array", of: [defineArrayMember({ type: "string" })], group: "how" }),
    defineField({ name: "howLanguagesTitle", title: "Languages Cell Title", type: "string", group: "how" }),
    defineField({ name: "howLanguagesBody", title: "Languages Cell Body", type: "text", rows: 3, group: "how" }),
    defineField({ name: "howLanguagesFigures", title: "Languages Figures", type: "array", of: [figureField()], group: "how" }),

    // Journey Section Header
    defineField({ name: "journeyHeading", title: "Journey Heading", type: "string", group: "contact" }),
    defineField({ name: "journeyIntro", title: "Journey Intro", type: "string", group: "contact" }),

    // Testimonials Section Header
    defineField({ name: "testimonialsHeading", title: "Testimonials Heading", type: "string", group: "contact" }),
    defineField({ name: "testimonialsSubheading", title: "Testimonials Subheading", type: "string", group: "contact" }),

    // Contact, Nav & Footer
    defineField({ name: "letsTalkEnabled", title: "Use 'Let's talk' Label", type: "boolean", initialValue: true, group: "contact" }),
    defineField({ name: "letsTalkText", title: "Let's Talk Label", type: "string", group: "contact" }),
    defineField({ name: "showAssistant", title: "Show AI Assistant", type: "boolean", initialValue: false, group: "contact" }),
    defineField({ name: "contactHeading", title: "Contact Heading", type: "string", group: "contact" }),
    defineField({ name: "contactBody", title: "Contact Body", type: "text", rows: 2, group: "contact" }),
    defineField({ name: "contactCallLabel", title: "Book Call Label", type: "string", group: "contact" }),
    defineField({ name: "contactCallDisplay", title: "Book Call Display URL", type: "string", group: "contact" }),
    defineField({ name: "contactCallHref", title: "Book Call Href", type: "url", group: "contact" }),
    defineField({ name: "localTimeLabel", title: "Local Time Label", type: "string", group: "contact" }),
    defineField({ name: "footerCredit", title: "Footer Credit", type: "string", group: "contact" }),
    defineField({ name: "backToTop", title: "Back to Top Label", type: "string", group: "contact" }),
    defineField({
      name: "profiles",
      title: "Social Profiles",
      type: "array",
      group: "contact",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "href", title: "URL", type: "url" }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
