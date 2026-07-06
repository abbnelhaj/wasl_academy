import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, watch, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { coreAppManifestSchema, getSanityDataDir, studioManifestSchema, subdebug } from '@sanity/cli-core';
import { z } from 'zod/mini';
import { canonicalizeWatchDir } from './canonicalizeWatchDir.js';
import { getProcessStartTime, isOurProcess } from './processLiveness.js';
const devDebug = subdebug('dev');
/** Bump when the manifest/lock shape changes in a breaking way. */ const REGISTRY_VERSION = 1;
/**
 * The current process's start time as reported by the OS, for the `startedAt`
 * that `isOurProcess` checks on re-read. Falls back to now when the OS time is
 * unavailable — `new Date()` alone records the write time, which drifts from
 * process start by enough to look stale and get pruned right after writing.
 */ function ownStartedAt() {
    return (getProcessStartTime(process.pid) ?? new Date()).toISOString();
}
const devServerManifestSchema = z.object({
    host: z.string(),
    id: z.optional(z.string()),
    /**
   * Interfaces the app exposes, mapped from the declared `views` (dock panels,
   * `interface_type: "panel"`) and `services` (background workers,
   * `interface_type: "worker"`). A service is just an interface, so both live
   * in this one list. Carried separately from the manifest — interfaces live in
   * the application service, not the manifest — so the workbench can render
   * local panels and run local workers without a deploy. `entry_point` is the
   * declared `src`. Lenient by design; the workbench is the authority on the
   * interface shape.
   */ interfaces: z.optional(z.array(z.object({
        entry_point: z.string(),
        interface_type: z.string(),
        name: z.string()
    }))),
    /**
   * Inlined manifest — either a {@link StudioManifest} or {@link CoreAppManifest},
   * validated against the shared cli-core schemas. The registry stores and
   * rebroadcasts it; the CLI is what extracts and writes it.
   */ manifest: z.optional(z.union([
        studioManifestSchema,
        coreAppManifestSchema
    ])),
    /**
   * ISO timestamp of the most recent successful manifest extraction. Bumped
   * on every regeneration so re-writing this registry entry triggers the
   * workbench `watchRegistry` watcher and forces a rebroadcast to clients.
   */ manifestUpdatedAt: z.optional(z.string()),
    pid: z.number(),
    port: z.number(),
    projectId: z.optional(z.string()),
    startedAt: z.string(),
    type: z.enum([
        'coreApp',
        'studio'
    ]),
    version: z.literal(REGISTRY_VERSION),
    workDir: z.string()
});
/**
 * Path to the dev server registry directory. Lives under the shared Sanity
 * config directory to stay consistent with other CLI paths.
 */ function getRegistryDir() {
    return join(getSanityDataDir(), 'dev-servers');
}
/**
 * Write a manifest file for the current process and return a handle with a
 * `release` function that removes it plus an `update` function for patching
 * fields post-registration. Uses synchronous I/O so the file exists before
 * any signal handler could fire.
 */ export function registerDevServer(manifest) {
    const registryDir = getRegistryDir();
    mkdirSync(registryDir, {
        recursive: true
    });
    let current = {
        ...manifest,
        pid: process.pid,
        startedAt: ownStartedAt(),
        version: REGISTRY_VERSION
    };
    const filePath = join(registryDir, `${process.pid}.json`);
    writeFileSync(filePath, JSON.stringify(current, null, 2));
    // Guard against late updates from background tasks (e.g. the initial
    // manifest extraction) landing after `release()` has deleted the file —
    // without this, the update would re-create the registry entry and leak.
    let released = false;
    return {
        release () {
            released = true;
            try {
                unlinkSync(filePath);
            } catch  {
            // ENOENT is fine — already cleaned up
            }
        },
        update (patch) {
            if (released) return;
            current = {
                ...current,
                ...patch
            };
            writeFileSync(filePath, JSON.stringify(current, null, 2));
        }
    };
}
/**
 * Read all manifest files from the registry, prune stale entries (dead PIDs),
 * and return the live ones.
 */ export function getRegisteredServers() {
    const registryDir = getRegistryDir();
    if (!existsSync(registryDir)) {
        return [];
    }
    const files = readdirSync(registryDir).filter((f)=>f.endsWith('.json'));
    const servers = [];
    for (const file of files){
        const filePath = join(registryDir, file);
        let raw;
        try {
            raw = JSON.parse(readFileSync(filePath, 'utf8'));
        } catch  {
            continue;
        }
        const { data, success } = devServerManifestSchema.safeParse(raw);
        if (!success) continue;
        if (isOurProcess(data.pid, data.startedAt)) {
            servers.push(data);
        } else {
            try {
                unlinkSync(filePath);
            } catch  {
            // Ignore — another process may have already cleaned it up
            }
        }
    }
    return servers;
}
/**
 * Watch the registry directory for changes and invoke the callback with the
 * current list of live servers whenever a change is detected.
 *
 * Uses `fs.watch` with a debounce to coalesce rapid file changes (e.g. a
 * server starting and writing its manifest triggers multiple FS events).
 */ export function watchRegistry(callback) {
    const registryDir = getRegistryDir();
    mkdirSync(registryDir, {
        recursive: true
    });
    // Canonicalize to the real long path so `fs.watch` doesn't abort on Windows
    // short-path dirs. See `canonicalizeWatchDir`.
    const watchDir = canonicalizeWatchDir(registryDir);
    let debounceTimer;
    const notify = ()=>{
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(()=>{
            callback(getRegisteredServers());
        }, 50);
    };
    const watcher = watch(watchDir, notify);
    return {
        close () {
            clearTimeout(debounceTimer);
            watcher.close();
        }
    };
}
// The workbench singleton lock — "one workbench per machine". Lives in the same
// registry dir and shares the liveness/prune model: a stale lock left by a
// crashed process is pruned on read so the next acquire isn't blocked forever.
const workbenchLockSchema = z.object({
    host: z.string(),
    pid: z.number(),
    port: z.number(),
    startedAt: z.string(),
    version: z.literal(REGISTRY_VERSION)
});
/**
 * Read the workbench lock file and return its contents if the holding
 * process is still alive. Prunes stale locks from crashed processes.
 */ export function readWorkbenchLock() {
    const lockPath = join(getRegistryDir(), 'workbench.lock');
    let contents;
    try {
        contents = readFileSync(lockPath, 'utf8');
    } catch  {
        // File doesn't exist — nothing to prune, nothing to return
        return undefined;
    }
    // Past this point the file exists. Anything that isn't a live, valid lock
    // (unparsable JSON, schema mismatch, dead/reused PID) is stale and must be
    // pruned — otherwise the next `acquireWorkbenchLock` call is blocked by
    // EEXIST forever and `sanity dev` silently no-ops the workbench server.
    const data = parseLockContents(contents);
    devDebug('Read workbench lock: %o', data);
    if (data && isOurProcess(data.pid, data.startedAt)) {
        devDebug('Workbench process is alive at pid %d on port %d', data.pid, data.port);
        return data;
    }
    pruneWorkbenchLock(lockPath);
    return undefined;
}
function parseLockContents(contents) {
    try {
        const { data, success } = workbenchLockSchema.safeParse(JSON.parse(contents));
        return success ? data : undefined;
    } catch  {
        return undefined;
    }
}
function pruneWorkbenchLock(lockPath) {
    try {
        devDebug('Removing stale workbench lock');
        unlinkSync(lockPath);
        devDebug('Stale workbench lock removed');
    } catch  {
    // Another process may have already cleaned it up
    }
}
/**
 * Attempt to acquire an exclusive lock for the workbench process.
 * Uses `O_EXCL` (the `wx` flag) which is atomic at the OS level — only one
 * process can create the file.
 *
 * The lock stores `{pid, host, port}` so other processes can find the
 * running workbench. Call `updatePort` after the Vite server starts to
 * write the actual port (Vite may pick a different one).
 *
 * @returns A {@link WorkbenchLock} if acquired, or `undefined` if another
 *          live process already holds it.
 */ export function acquireWorkbenchLock(info, retries = 1) {
    const registryDir = getRegistryDir();
    mkdirSync(registryDir, {
        recursive: true
    });
    const lockPath = join(registryDir, 'workbench.lock');
    const startedAt = ownStartedAt();
    const lockData = {
        host: info.host,
        pid: process.pid,
        port: info.port,
        startedAt,
        version: REGISTRY_VERSION
    };
    devDebug('Acquiring workbench lock at %s', lockPath);
    try {
        writeFileSync(lockPath, JSON.stringify(lockData), {
            flag: 'wx'
        });
        devDebug('Workbench lock acquired');
        return {
            release () {
                try {
                    unlinkSync(lockPath);
                } catch  {
                // Already cleaned up
                }
            },
            updatePort (port) {
                writeFileSync(lockPath, JSON.stringify({
                    ...lockData,
                    port
                }));
            }
        };
    } catch (err) {
        devDebug('Failed to acquire workbench lock: %s', err instanceof Error ? err.message : String(err));
        if (!isNodeError(err) || err.code !== 'EEXIST') return undefined;
        // Lock exists — check if the holder is still alive
        const existing = readWorkbenchLock();
        if (existing) return undefined;
        // Stale lock was pruned by readWorkbenchLock — retry (with guard against infinite recursion)
        if (retries <= 0) return undefined;
        return acquireWorkbenchLock(info, retries - 1);
    }
}
function isNodeError(err) {
    return err instanceof Error && 'code' in err;
}

//# sourceMappingURL=registry.js.map