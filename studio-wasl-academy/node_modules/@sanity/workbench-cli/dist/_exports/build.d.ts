import { CliConfig } from "@sanity/cli-core";
import { PluginOption } from "vite";
import { z } from "zod/mini";

/**
 * User-facing input for `unstable_defineApp`. Excludes the internal
 * `applicationType` — that field is validated by the schema but is not part of
 * the public surface (Sanity-owned apps set it via `@ts-expect-error`).
 * @public
 */
declare type DefineAppInput = Omit<
  z.output<typeof DefineAppInputSchema>,
  "applicationType"
>;

/**
 * Runtime-validation schema for `unstable_defineApp`. Validates the full shape
 * including the internal `applicationType`; the user-facing `DefineAppInput`
 * type below omits that field.
 * @internal
 */
declare const DefineAppInputSchema: z.ZodMiniObject<
  {
    applicationType: z.ZodMiniOptional<
      z.ZodMiniEnum<{
        coreApp: "coreApp";
        studio: "studio";
        canvas: "canvas";
        dashboard: "dashboard";
        "media-library": "media-library";
      }>
    >;
    entry: z.ZodMiniOptional<z.ZodMiniString<string>>;
    group: z.ZodMiniOptional<
      z.ZodMiniEnum<{
        "dock.system": "dock.system";
        "dock.applications": "dock.applications";
        "dock.user": "dock.user";
      }>
    >;
    icon: z.ZodMiniOptional<z.ZodMiniString<string>>;
    name: z.ZodMiniString<string>;
    organizationId: z.ZodMiniString<string>;
    priority: z.ZodMiniOptional<z.ZodMiniNumber<number>>;
    services: z.ZodMiniOptional<
      z.ZodMiniArray<
        z.ZodMiniDiscriminatedUnion<
          [
            z.ZodMiniObject<
              {
                name: z.ZodMiniString<string>;
                src: z.ZodMiniString<string>;
                type: z.ZodMiniLiteral<"worker">;
              },
              z.core.$strip
            >,
          ],
          "type"
        >
      >
    >;
    title: z.ZodMiniString<string>;
    views: z.ZodMiniOptional<
      z.ZodMiniArray<
        z.ZodMiniDiscriminatedUnion<
          [
            z.ZodMiniObject<
              {
                name: z.ZodMiniString<string>;
                src: z.ZodMiniString<string>;
                type: z.ZodMiniLiteral<"panel">;
              },
              z.core.$strip
            >,
          ],
          "type"
        >
      >
    >;
  },
  z.core.$strip
>;

/** @public */
declare interface ResolvedWorkbenchApp {
  /** Background worker services the app declares. */
  readonly services: NonNullable<DefineAppInput["services"]>;
  /** Dock panel views the app declares. */
  readonly views: NonNullable<DefineAppInput["views"]>;
  /** Resolved app kind — `studio` or one of the SDK app types. */
  readonly applicationType?: string;
  /** SDK app-view entrypoint, when declared. */
  readonly entry?: string;
}

/**
 * Resolve the workbench app for a CLI config, or `null` for a plain project.
 * @public
 */
export declare function resolveWorkbenchApp(
  cliConfig: CliConfig | null | undefined,
): ResolvedWorkbenchApp | null;

declare interface WorkbenchViteOptions {
  /** Project root — read for the federation remote name, and the plugin workDir. */
  cwd: string;
  /**
   * Build entry paths relative to the federation runtime dir. `relativeEntry` is
   * the app's `entry` (null for a dock-only app with no app view);
   * `relativeConfigLocation` is the studio's `sanity.config.*` (null when absent).
   */
  entries: {
    relativeConfigLocation: string | null;
    relativeEntry: string | null;
  };
  /** App (vs studio) build — selects the discriminated federation option shape. */
  isApp?: boolean;
  /** Declared background services. */
  services?: DefineAppInput["services"];
  /** Declared dock views. */
  views?: DefineAppInput["views"];
}

/** Build the Vite plugins for a workbench app's module-federation remote. */
export declare function workbenchVitePlugins(
  options: WorkbenchViteOptions,
): Promise<PluginOption>;

export {};
