import { defineCliConfig } from "sanity/cli"

import { dataset, projectId } from "./env"

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  typegen: {
    enabled: true,
    generates: "../sanity.types.ts",
    overloadClientMethods: true,
    path: "../{app,components,lib,sanity/lib}/**/*.{ts,tsx}",
    schema: "schema.json",
  },
  vite: {
    server: {
      watch: {
        ignored: ["**/.git/**", "**/dist/**", "**/node_modules/**"],
      },
    },
  },
})
