import { extendViteConfigWithUserConfig, getViteConfig, writeSanityRuntime } from '@sanity/cli-build/_internal/build';
import { getAppEnvironmentVariables, getStudioEnvironmentVariables } from '@sanity/cli-build/_internal/env';
import { getCliTelemetry } from '@sanity/cli-core';
import { createServer } from 'vite';
import { serverDebug } from './serverDebug.js';
import { sanityTypegenPlugin } from './vite/plugin-typegen.js';
const debug = serverDebug.extend('dev');
export async function startDevServer(options) {
    const { appTitle, basePath, cwd, entry, httpHost, httpPort, isApp, isWorkbenchApp, reactCompiler, reactStrictMode, schemaExtraction, services, typegen, views, vite: extendViteConfig } = options;
    debug('Writing Sanity runtime files');
    const { entries, watcher } = await writeSanityRuntime({
        appTitle,
        basePath,
        cwd,
        entry,
        isApp,
        isWorkbenchApp,
        reactStrictMode,
        watch: true
    });
    debug('Resolving vite config');
    const mode = 'development';
    function getEnvironmentVariables() {
        return isApp ? getAppEnvironmentVariables({
            jsonEncode: true,
            prefix: 'process.env.'
        }) : getStudioEnvironmentVariables({
            jsonEncode: true,
            prefix: 'process.env.'
        });
    }
    let viteConfig = await getViteConfig({
        additionalPlugins: [
            // Add typegen when enabled
            ...typegen?.enabled ? [
                sanityTypegenPlugin({
                    config: typegen,
                    telemetryLogger: getCliTelemetry(),
                    workDir: cwd
                })
            ] : []
        ],
        basePath,
        cwd,
        entries,
        getEnvironmentVariables,
        isApp,
        isWorkbenchApp,
        mode: 'development',
        reactCompiler,
        schemaExtraction,
        server: {
            host: httpHost,
            port: httpPort
        },
        services,
        views
    });
    // Extend Vite configuration with user-provided config
    if (extendViteConfig) {
        viteConfig = await extendViteConfigWithUserConfig({
            command: 'serve',
            mode
        }, viteConfig, extendViteConfig);
    }
    debug('Creating vite server');
    const server = await createServer(viteConfig);
    debug('Listening on specified port');
    await server.listen();
    return {
        close: async ()=>{
            if (watcher) {
                await watcher.close();
            }
            await server.close();
        },
        server,
        watcher
    };
}

//# sourceMappingURL=devServer.js.map