import type { StructureResolver } from "sanity/structure";

export const ownerStructure: StructureResolver = (S) =>
  S.list()
    .title("Oak Park Website")
    .items([
      S.listItem()
        .title("Projects")
        .child(
          S.documentTypeList("portfolioProject")
            .title("Projects")
            .defaultOrdering([{ field: "order", direction: "asc" }])
            .initialValueTemplates([S.initialValueTemplateItem("portfolio-project-blank")]),
        ),
      S.listItem().title("Categories").child(S.documentTypeList("portfolioCategory").title("Categories")),
      S.divider(),
      S.listItem()
        .title("Portfolio page text")
        .child(S.document().schemaType("portfolioSettings").documentId("portfolioSettings")),
      S.divider(),
      S.listItem().title("Release history").child(S.documentTypeList("releaseSnapshot").title("Release history")),
    ]);
