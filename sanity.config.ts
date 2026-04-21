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
    // Hide "Homepage" from the "+ Create" menu and from the action bar —
    // it's a singleton; editors always edit the one existing document.
    templates: (prev) => prev.filter((t) => t.schemaType !== "homepage"),
  },
  document: {
    actions: (prev, { schemaType }) =>
      schemaType === "homepage"
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
