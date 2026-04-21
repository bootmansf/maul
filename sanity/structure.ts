import type { StructureResolver } from "sanity/structure";

// Known _ids for simplePage singletons. Listed explicitly in the Studio
// sidebar so editors see one link per URL, not a generic document list.
const SIMPLE_PAGES: { id: string; title: string }[] = [
  { id: "aboutPage", title: "About" },
  { id: "missionPage", title: "Our Mission" },
  { id: "letterChiefPage", title: "Letter from the Chief" },
  { id: "letterColonelPage", title: "Letter from the Colonel" },
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Homepage")
        .id("homepage")
        .child(S.document().schemaType("homepage").documentId("homepage")),

      S.listItem()
        .title("Pages")
        .id("pages")
        .child(
          S.list()
            .title("Pages")
            .items([
              ...SIMPLE_PAGES.map((p) =>
                S.listItem()
                  .title(p.title)
                  .id(p.id)
                  .child(
                    S.document().schemaType("simplePage").documentId(p.id)
                  )
              ),
              S.listItem()
                .title("How to Join")
                .id("howToJoinPage")
                .child(
                  S.document()
                    .schemaType("howToJoinPage")
                    .documentId("howToJoinPage")
                ),
              S.listItem()
                .title("20th Anniversary page")
                .id("anniversaryPage")
                .child(
                  S.document()
                    .schemaType("anniversaryPage")
                    .documentId("anniversaryPage")
                ),
            ])
        ),

      S.divider(),

      S.documentTypeListItem("event").title("Events"),
      S.documentTypeListItem("anniversaryEvent").title(
        "20th Anniversary Events"
      ),
      S.documentTypeListItem("amccClub").title("AMCC Clubs"),
      S.documentTypeListItem("gallery").title("Galleries"),
      S.documentTypeListItem("leadership").title("Leadership"),
      S.documentTypeListItem("externalLink").title(
        "External Links (clubs & vendors)"
      ),
    ]);
