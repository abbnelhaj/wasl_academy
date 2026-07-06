import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"

import { schemaTypes } from "./schemaTypes"

export default defineConfig({
  name: "wasl_academy",
  title: "Wasl Academy",

  projectId: "2w77c28z",
  dataset: "production",

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
