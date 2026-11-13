import type { StructureResolver } from "sanity/structure";

const SINGLETON_TYPES = new Set(["siteSettings", "servicesSettings", "clientQuote"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Portfolio Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem()
        .title("Services Settings")
        .id("servicesSettings")
        .child(S.document().schemaType("servicesSettings").documentId("servicesSettings")),
      S.listItem()
        .title("Featured Client Quote")
        .id("clientQuote")
        .child(S.document().schemaType("clientQuote").documentId("clientQuote")),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => !SINGLETON_TYPES.has(item.getId() ?? "")),
    ]);
