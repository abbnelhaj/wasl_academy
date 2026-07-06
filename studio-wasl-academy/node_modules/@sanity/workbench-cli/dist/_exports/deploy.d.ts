import { CliConfig } from "@sanity/cli-core";
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

declare interface DeployableWorkbenchApp extends ResolvedWorkbenchApp {
  /**
   * Throws when the app declares nothing the build can expose — no entry, view
   * or service. A federated app with none would ship a remote with nothing to
   * load, so deploy gates on this before any prompts or API calls.
   */
  assertDeployable(): void;
  /**
   * Throws unless `sourceDir` is a directory holding a federation build.
   * Workbench builds emit a module-federation remote instead of a static SPA,
   * so the usual `index.html` contract doesn't apply — `mf-manifest.json` is the
   * marker that `sanity build` produced a federation build.
   */
  checkBuiltOutput(sourceDir: string): Promise<void>;
}

export declare function getWorkbench(
  cliConfig: CliConfig | null | undefined,
): DeployableWorkbenchApp | null;

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

export {};
