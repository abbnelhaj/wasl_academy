import { z } from "zod/mini";

/**
 * User-facing input for `unstable_defineApp`. Excludes the internal
 * `applicationType` — that field is validated by the schema but is not part of
 * the public surface (Sanity-owned apps set it via `@ts-expect-error`).
 * @public
 */
export declare type DefineAppInput = Omit<
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

/**
 * The branded result of `unstable_defineApp`. Carries the same fields as the
 * input plus the internal brand — users only ever see `DefineAppInput`.
 * @public
 */
export declare interface DefineAppResult extends DefineAppInput {
  readonly [WORKBENCH_APP]: true;
}

/**
 * The result of `unstable_defineService`: the author's callback, the service
 * type, and the internal contract version the worker artifact targets.
 * @public
 */
export declare interface DefinedService<
  TType extends ServiceType = ServiceType,
> {
  readonly run: ServiceCallbacksByType[TType];
  readonly type: TType;
  /** @internal */
  readonly version: typeof SERVICE_CONTRACT_VERSION;
}

/**
 * The result of `unstable_defineView`: the author's component(s), the view type,
 * and the internal contract version the build artifact targets.
 * @public
 */
export declare interface DefinedView<
  TType extends InterfaceType = InterfaceType,
> {
  readonly components: ViewComponentsByType[TType];
  readonly type: TType;
  /** @internal */
  readonly version: typeof VIEW_CONTRACT_VERSION;
}

/**
 * Dock group identifier. The API does not block a user app from declaring a
 * reserved group (e.g. `dock.system`); priority conventions keep Sanity-owned
 * apps ahead.
 * @public
 */
export declare type DockGroup = z.output<typeof DockGroupSchema>;

/** Dock groups an app can place itself into. */
declare const DockGroupSchema: z.ZodMiniEnum<{
  "dock.system": "dock.system";
  "dock.applications": "dock.applications";
  "dock.user": "dock.user";
}>;

/**
 * Every supported interface type — the first argument to `unstable_defineView`.
 * @public
 */
export declare type InterfaceType = keyof typeof VIEW_COMPONENTS;

/**
 * A panel's view-component slot — the module-federation expose for one island.
 * @public
 */
export declare type PanelComponent = keyof PanelViewComponents;

/**
 * The component slots a `panel` view exposes — each its own module-federation
 * island, typed with the panel props.
 * @public
 */
export declare interface PanelViewComponents {
  panel: ViewComponent<PanelViewProps>;
  title: ViewComponent<PanelViewProps>;
}

/**
 * Props a panel component receives: its interface record, minus the
 * service-assigned `id`/`deployment_id` a local dev server can't provide. Mirrors
 * the `panel` record the workbench host renders from (the wire format owned by
 * `@sanity/workbench`); drift is guarded by the stamped contract version.
 * @public
 */
export declare type PanelViewProps = ViewComponentBaseProps<{
  entry_point: string;
  interface_type: "panel";
  name: string;
}>;

/**
 * Contract version stamped on every defined service. Lets the workbench host
 * and the generated worker artifact evolve the service contract without
 * breaking already-deployed services; bumped only on a breaking change.
 * @internal
 */
declare const SERVICE_CONTRACT_VERSION = 1;

/**
 * A service callback. Runs once inside the worker on start; returns an optional
 * disposer the host calls before terminating the worker.
 * @public
 */
export declare type ServiceCallback = (
  context: ServiceContext,
) => (() => void) | void;

/** The callback shape each service type defines, keyed by type. */
declare interface ServiceCallbacksByType {
  worker: ServiceCallback;
}

/**
 * Context every service callback receives when its worker starts. Mirrors how a
 * view component receives its `view` — the service receives its own `service`.
 * @public
 */
export declare interface ServiceContext {
  readonly service: ServiceInfo;
}

/**
 * The service's own declaration, surfaced to the callback.
 * @public
 */
export declare interface ServiceInfo {
  readonly name: string;
  readonly type: string;
}

/**
 * Every supported service type — the first argument to `unstable_defineService`.
 * Add a service type by adding its declaration schema below and registering it
 * here.
 * @public
 */
export declare type ServiceType = "worker";

/**
 * Declare a Sanity Workbench application. Identity at runtime — returns the same
 * object reference, tagged with the workbench brand. Field validation (the
 * `name` pattern etc.) runs at build time in the CLI via `DefineAppInputSchema`;
 * this helper stays a thin, pure identity wrapper.
 * @public
 */
export declare function unstable_defineApp(
  input: DefineAppInput,
): DefineAppResult;

/**
 * Define a Sanity Workbench background service. The first argument narrows the
 * callback shape — `"worker"` runs the callback inside a Web Worker, where it
 * can emit dock-badge updates and return a disposer.
 *
 * Identity at runtime: returns the callback tagged with its type and the contract
 * version, for the CLI build to generate a worker artifact from. Used as the
 * default export of a service's `src` file.
 * @public
 */
export declare function unstable_defineService<TType extends ServiceType>(
  type: TType,
  run: ServiceCallbacksByType[TType],
): DefinedService<TType>;

/**
 * Define a Sanity Workbench view. The first argument narrows the component shape
 * and the props each component receives — `"panel"` yields a `{title, panel}`
 * record whose components are typed with the panel props.
 *
 * Returns the component(s) tagged with their type and the contract version, for
 * the CLI build to generate render artifacts from. Used as the default export of
 * a view's `src` file.
 * @public
 */
export declare function unstable_defineView<TType extends InterfaceType>(
  type: TType,
  components: ViewComponentsByType[TType],
): DefinedView<TType>;

/**
 * Component slots each interface type exposes, in render order — the source of
 * truth for {@link InterfaceType} and for the build (the vite plugin expands a
 * view into one render artifact per component). Add a type by registering it here.
 * @internal
 */
declare const VIEW_COMPONENTS: {
  readonly panel: readonly ["title", "panel"];
};

/**
 * Contract version stamped on every defined view — lets the host and the
 * generated artifact evolve the contract without breaking deployed views.
 * @internal
 */
declare const VIEW_CONTRACT_VERSION = 1;

/**
 * A view component. The return is opaque so the runtime helpers carry no React
 * dependency — the generated artifact renders it with the app's own React.
 * @public
 */
declare type ViewComponent<TProps> = (props: TProps) => unknown;

/**
 * Props every view component receives, whatever its type. Per-type props
 * compose from this, so a prop added here reaches every view.
 * @public
 */
declare interface ViewComponentBaseProps<TView> {
  view: TView;
}

/**
 * The components each interface type exposes, keyed by type.
 * @public
 */
export declare interface ViewComponentsByType {
  panel: PanelViewComponents;
}

/**
 * Nominal brand the CLI discriminates on to enable the workbench build/deploy
 * codepath. Registered via `Symbol.for` so the marker survives module-realm
 * boundaries — `@sanity/cli-core` re-derives the same global symbol with
 * `Symbol.for` rather than importing it, so it stays internal to this module.
 */
declare const WORKBENCH_APP: unique symbol;

export {};
