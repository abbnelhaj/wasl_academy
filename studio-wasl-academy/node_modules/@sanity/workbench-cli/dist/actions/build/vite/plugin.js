import path from 'node:path';
import { artifactExposes, workbenchArtifacts } from '../artifact.js';
import { FEDERATION_FILE_NAME, RUNTIME_DIR } from './constants.js';
import { sanityModuleFederation } from './plugins/plugin-module-federation.js';
import { sanityEnvironmentPlugin } from './plugins/plugin-sanity-environment.js';
import { sanityExtensionArtifacts } from './plugins/plugin-sanity-extension-artifacts.js';
import { sanityFederationRuntime } from './plugins/plugin-sanity-federation-runtime.js';
/**
 * @internal
 */ export const federation = (options)=>{
    const { exposes: defaultExposes = {}, name: defaultName, pkgJson, services = [], views = [], workDir = process.cwd() } = options;
    let name = defaultName;
    if (!name) {
        name = pkgJson?.name;
    }
    if (!name) {
        throw new Error('"name" option is required but could not be inferred from package.json');
    }
    const generatedEntry = `./${RUNTIME_DIR}/${FEDERATION_FILE_NAME}.jsx`;
    function resolveEntryPath(entry) {
        const resolvedPath = path.resolve(workDir, entry);
        if (!resolvedPath) {
            throw new Error(`Could not resolve path for entry "${entry}". Please check that the file exists and the path is correct.`);
        }
        return resolvedPath;
    }
    const entryPath = resolveEntryPath(generatedEntry);
    const resolvedExposes = {};
    for (const [key, exposePath] of Object.entries(defaultExposes)){
        resolvedExposes[key] = resolveEntryPath(exposePath) ?? exposePath;
    }
    // Each view component (`./views/<view>/<component>`) and each service loader
    // (`./services/<name>`) is exposed straight to the host, pointing at the file
    // the extension-artifacts plugin generates under RUNTIME_DIR. A service's
    // worker bundle carries no expose — the host reaches it through its loader.
    const artifacts = workbenchArtifacts({
        services,
        views
    });
    const interfaceExposes = artifactExposes(artifacts, (artifactPath)=>resolveEntryPath(`./${RUNTIME_DIR}/${artifactPath}`));
    // A dock-only app (`isApp` with no `appEntry`) has no navigable full-page
    // view, so it exposes no `./App` — only its views. Studios and apps with an
    // entry expose `./App` (the generated render entry).
    const exposesApp = !options.isApp || options.appEntry !== undefined;
    const exposes = {
        ...exposesApp ? {
            './App': entryPath
        } : {},
        ...resolvedExposes,
        ...interfaceExposes
    };
    const runtimeOptions = options.isApp ? {
        appEntry: options.appEntry,
        isApp: true
    } : {
        isApp: false,
        studioConfigPath: options.studioConfigPath
    };
    return [
        sanityEnvironmentPlugin({
            input: entryPath
        }),
        sanityFederationRuntime(runtimeOptions),
        sanityExtensionArtifacts({
            artifacts
        }),
        sanityModuleFederation({
            exposes,
            name
        })
    ];
};

//# sourceMappingURL=plugin.js.map