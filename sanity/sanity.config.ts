import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { muxInput } from "sanity-plugin-mux-input";

import { apiVersion, dataset, projectId } from "./env";
import { schema } from "./schemaTypes";
import { structure } from "./structure";

export default defineConfig({
  name: "wasl_academy",
  title: "Wasl Academy",

  projectId,
  dataset,

  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
    muxInput({
      defaultSigned: true,
      video_quality: "plus",
      defaultPublic: false,
    }),
  ],

  schema,
});
