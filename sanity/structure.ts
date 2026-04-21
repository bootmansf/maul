import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.documentTypeListItem("event").title("Events"),
      S.documentTypeListItem("anniversaryEvent").title(
        "20th Anniversary Events"
      ),
      S.documentTypeListItem("amccClub").title("AMCC Clubs"),
      S.documentTypeListItem("gallery").title("Galleries"),
      S.documentTypeListItem("leadership").title("Leadership"),
    ]);
