import { spawn } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const scriptDir = dirname(fileURLToPath(import.meta.url))
const rootEnvPath = resolve(scriptDir, "../../.env.local")

function parseEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return {}
  }

  const env = {}

  for (const rawLine of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim()

    if (!line || line.startsWith("#")) {
      continue
    }

    const normalizedLine = line.startsWith("export ")
      ? line.slice("export ".length).trim()
      : line
    const separatorIndex = normalizedLine.indexOf("=")

    if (separatorIndex === -1) {
      continue
    }

    const key = normalizedLine.slice(0, separatorIndex).trim()
    let value = normalizedLine.slice(separatorIndex + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    env[key] = value
  }

  return env
}

function addSanityStudioAliases(env) {
  const aliases = {
    NEXT_PUBLIC_SANITY_API_VERSION: "SANITY_STUDIO_API_VERSION",
    NEXT_PUBLIC_SANITY_DATASET: "SANITY_STUDIO_DATASET",
    NEXT_PUBLIC_SANITY_PROJECT_ID: "SANITY_STUDIO_PROJECT_ID",
  }

  for (const [sourceKey, targetKey] of Object.entries(aliases)) {
    if (env[sourceKey] && !env[targetKey]) {
      env[targetKey] = env[sourceKey]
    }
  }
}

const [command, ...args] = process.argv.slice(2)

if (!command) {
  console.error("Missing command. Example: node scripts/with-root-env.mjs sanity dev")
  process.exit(1)
}

const env = {
  ...parseEnvFile(rootEnvPath),
  ...process.env,
}

addSanityStudioAliases(env)

const child = spawn(command, args, {
  env,
  shell: process.platform === "win32",
  stdio: "inherit",
})

child.on("error", (error) => {
  console.error(`Failed to start command "${command}":`, error)
  process.exit(1)
})

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 1)
})
