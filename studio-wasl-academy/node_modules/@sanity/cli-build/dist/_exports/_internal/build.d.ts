import { CliConfig } from "@sanity/cli-core";
import { ConfigEnv } from "vite";
import { Debugger } from "debug";
import { DefineAppInput } from "@sanity/workbench-cli";
import { DefinedTelemetryTrace } from "@sanity/telemetry";
import { FSWatcher } from "chokidar";
import { InlineConfig } from "vite";
import { Output } from "@sanity/cli-core";
import { Plugin as Plugin_2 } from "vite";
import { PluginOptions } from "babel-plugin-react-compiler";
import { UserViteConfig } from "@sanity/cli-core";

export declare const AppBuildTrace: DefinedTelemetryTrace<
  {
    outputSize: number;
  },
  void
>;

/**
 * Everything the production build needs to produce an auto-updating studio/app.
 *
 * Auto-updating deployments load `sanity` (and friends) from Sanity's module
 * CDN via an import map, and load `react`/`react-dom`/`styled-components` from
 * hashed vendor chunks emitted by the build itself. These concerns always come
 * together: when auto-updates are disabled none of this applies and everything
 * is bundled as usual.
 *
 * @internal
 */
declare interface AutoUpdatesBuildConfig {
  /** Import map entries for the packages served from Sanity's module CDN. */
  imports: Record<string, string>;
  /** Vendor packages to emit as hashed browser-loadable ESM chunks. */
  vendor: VendorBuildConfig;
  /** Stylesheets served from the module CDN, loaded via `<link>` tags. */
  cssUrls?: string[];
}

export declare const buildDebug: Debugger;

/**
 * Builds static files
 *
 * @internal
 */
export declare function buildStaticFiles(options: StaticBuildOptions): Promise<{
  chunks: ChunkStats[];
}>;

/**
 * Checks that the studio has declared and installed the required dependencies
 * needed by the Sanity modules. While we generally use regular, explicit
 * dependencies in modules, there are certain dependencies that are better
 * served being peer dependencies, such as react and styled-components.
 *
 * If these dependencies are not installed/declared, we report an error
 * and instruct the user to install them manually.
 *
 * Additionally, returns the version of the 'sanity' dependency from the package.json.
 */
export declare function checkRequiredDependencies(
  options: CheckRequiredDependenciesOptions,
): Promise<CheckResult>;

declare interface CheckRequiredDependenciesOptions {
  isApp: boolean;
  output: Output;
  workDir: string;
}

declare interface CheckResult {
  installedSanityVersion: string;
}

export declare function checkStudioDependencyVersions(
  workDir: string,
  output: Output,
  {
    packages,
  }?: {
    packages?: TrackedPackage[];
  },
): Promise<void>;

declare interface ChunkModule {
  name: string;
  renderedLength: number;
}

declare interface ChunkStats {
  modules: ChunkModule[];
  name: string;
}

/**
 * Merge user-provided Vite configuration object or function
 *
 * @param defaultConfig - Default configuration object
 * @param userConfig - User-provided configuration object or function
 * @returns Merged configuration
 * @internal
 */
export declare function extendViteConfigWithUserConfig(
  env: ConfigEnv,
  defaultConfig: InlineConfig,
  userConfig: UserViteConfig,
): Promise<InlineConfig>;

export declare function formatModuleSizes(modules: ChunkModule[]): string;

/**
 * Generate CDN CSS URLs for auto-updated packages.
 * Uses the same URL pattern as JS module URLs so the module server
 * resolves CSS and JS to the same version.
 *
 * @internal
 */
export declare function getAutoUpdatesCssUrls<const Pkg extends PackageWithCss>(
  packages: Pkg[],
  options?: {
    appId?: string;
    baseUrl?: string;
    timestamp?: number;
  },
): string[];

/**
 * @internal
 */
export declare function getAutoUpdatesImportMap<const Pkg extends Package>(
  packages: Pkg[],
  options?: {
    appId?: string;
    baseUrl?: string;
    timestamp?: number;
  },
): { [K in `${Pkg["name"]}/` | Pkg["name"]]: string };

/**
 * @internal
 */
export declare function getModuleUrl(
  pkg: Package,
  options?: {
    appId?: string;
    baseUrl?: string;
    timestamp?: number;
  },
): string;

/**
 * Get a configuration object for Vite based on the passed options
 *
 * @internal Only meant for consumption inside of Sanity modules, do not depend on this externally
 */
export declare function getViteConfig(
  options: ViteOptions,
): Promise<InlineConfig>;

declare type Package = {
  name: string;
  version: string;
};

declare type PackageWithCss = Package & {
  cssFile?: string;
};

/**
 * Resolves vendor package entry points and metadata for a combined studio/app build.
 * Does not run a build — callers add `entries` to the main Vite/Rolldown input and
 * derive the import map from emitted vendor chunks after the single `vite.build`.
 *
 * @internal
 */
export declare function resolveVendorBuildConfig({
  cwd,
  isApp,
}: ResolveVendorBuildConfigOptions): Promise<VendorBuildConfig>;

declare interface ResolveVendorBuildConfigOptions {
  cwd: string;
  isApp: boolean;
}

declare interface RuntimeOptions {
  cwd: string;
  reactStrictMode: boolean | undefined;
  watch: boolean;
  appTitle?: string;
  basePath?: string;
  entry?: string;
  isApp?: boolean;
  isWorkbenchApp?: boolean;
}

/**
 * Root directory (relative to the project) used by Sanity tooling for
 * build-time artifacts and caches — Vite's `cacheDir` and the dev-time
 * manifest output. Lives under `node_modules/` so it's out of `dist` and
 * ignored by default in typical `.gitignore` files.
 */
export declare const SANITY_CACHE_DIR = "node_modules/.sanity";

export declare function sortModulesBySize(chunks: ChunkStats[]): ChunkModule[];

declare interface StaticBuildOptions {
  basePath: string;
  cwd: string;
  outputDir: string;
  appTitle?: string;
  autoUpdates?: AutoUpdatesBuildConfig;
  entry?: string;
  isApp?: boolean;
  /** Workbench app (opted in via `unstable_defineApp`) — drives the federation build. */
  isWorkbenchApp?: boolean;
  minify?: boolean;
  profile?: boolean;
  reactCompiler?: PluginOptions;
  schemaExtraction?: CliConfig["schemaExtraction"];
  services?: DefineAppInput["services"];
  sourceMap?: boolean;
  views?: DefineAppInput["views"];
  vite?: UserViteConfig;
}

export declare const StudioBuildTrace: DefinedTelemetryTrace<
  {
    outputSize: number;
  },
  void
>;

declare interface TrackedPackage {
  deprecatedBelow: string | null;
  name: string;
  supported: string[];
}

declare interface VendorBuildConfig {
  /** Rolldown entry name -\> absolute path to the package entry file. */
  entries: Record<string, string>;
  /** Named exports each CommonJS entry must re-expose as ESM, keyed by chunk name. */
  namesByChunkName: Record<string, readonly string[]>;
  /** Rolldown entry chunk name -\> bare import specifier (e.g. `react`, `react-dom/client`). */
  specifiersByChunkName: Record<string, string>;
}

declare interface ViteOptions {
  /**
   * Root path of the studio/sanity app
   */
  cwd: string;
  entries: {
    relativeConfigLocation: string | null;
    relativeEntry: string | null;
  };
  /**
   * Returns the environment variables to be injected into the config.
   */
  getEnvironmentVariables(): Record<string, string>;
  /**
   * Mode to run vite in - eg development or production
   */
  mode: "development" | "production";
  reactCompiler: PluginOptions | undefined;
  /**
   * Additional plugins when configured, eg. typegen
   */
  additionalPlugins?: Plugin_2[];
  /**
   * Auto-updates configuration (production builds only). When set, vendor
   * packages are emitted as hashed ESM chunks by this build and the import map
   * in `index.html` is derived from the build output.
   */
  autoUpdates?: AutoUpdatesBuildConfig;
  /**
   * Base path (eg under where to serve the app - `/studio` or similar)
   * Will be normalized to ensure it starts and ends with a `/`
   */
  basePath?: string;
  isApp?: boolean;
  /**
   * Whether this is a workbench app (opted in via `unstable_defineApp`). Drives
   * the module-federation build.
   */
  isWorkbenchApp?: boolean;
  /**
   * Whether or not to minify the output (only used in `mode: 'production'`)
   */
  minify?: boolean;
  /**
   * Output directory (eg where to place the built files, if any)
   */
  outputDir?: string;
  /**
   * Schema extraction configuration
   */
  schemaExtraction?: CliConfig["schemaExtraction"];
  /**
   * HTTP development server configuration
   */
  server?: {
    host?: string;
    port?: number;
  };
  /**
   * Background services the workbench app declares. Built into self-contained
   * worker bundles and exposed through module federation as `./services/<name>`.
   */
  services?: DefineAppInput["services"];
  /**
   * Whether or not to enable source maps
   */
  sourceMap?: boolean;
  /**
   * Views the workbench app declares. Built into render-contract artifacts and
   * exposed through module federation as `./views/<name>`.
   */
  views?: DefineAppInput["views"];
}

/**
 * Generates the `.sanity/runtime` directory, and optionally watches for custom
 * document files, rebuilding when they change
 *
 * @param options - Current working directory (Sanity root dir), and whether or not to watch
 * @returns A watcher instance if watch is enabled, undefined otherwise
 * @internal
 */
export declare function writeSanityRuntime(options: RuntimeOptions): Promise<{
  entries: {
    relativeConfigLocation: string | null;
    relativeEntry: string | null;
  };
  watcher: FSWatcher | undefined;
}>;

export {};
