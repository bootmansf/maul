import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemas";
import { structure } from "./sanity/structure";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  name: "maul-content",
  title: "Mid-Atlantic Uniform League",
  schema: {
    types: schemaTypes,
    // Hide singletons from the "+ Create" menu — editors always land on
    // the existing document via the sidebar, not a new copy.
    templates: (prev) =>
      prev.filter(
        (t) =>
          ![
            "homepage",
            "simplePage",
            "howToJoinPage",
            "anniversaryPage",
          ].includes(t.schemaType)
      ),
  },
  document: {
    actions: (prev, { schemaType }) =>
      ["homepage", "simplePage", "howToJoinPage", "anniversaryPage"].includes(
        schemaType
      )
        ? prev.filter(
            (a) => !["duplicate", "unpublish", "delete"].includes(a.action ?? "")
          )
        : prev,
  },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
