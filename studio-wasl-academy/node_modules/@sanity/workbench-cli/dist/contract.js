import { z } from 'zod/mini';
// The shared kernel of the module-federation extension contract: the supported
// view/service types, the contract versions the helpers stamp, and the
// declaration schemas an app author writes in `unstable_defineApp({views, services})`.
//
// Lives in `@sanity/workbench-cli` (alongside the vite plugin that consumes the
// same contract) so there is a single source of truth. `zod/mini` is used
// throughout workbench-cli to keep bundles small.
/**
 * Contract version stamped on every defined view — lets the host and the
 * generated artifact evolve the contract without breaking deployed views.
 * @internal
 */ export const VIEW_CONTRACT_VERSION = 1;
/**
 * Contract version stamped on every defined service. Lets the workbench host
 * and the generated worker artifact evolve the service contract without
 * breaking already-deployed services; bumped only on a breaking change.
 * @internal
 */ export const SERVICE_CONTRACT_VERSION = 1;
/**
 * Component slots each interface type exposes, in render order — the source of
 * truth for {@link InterfaceType} and for the build (the vite plugin expands a
 * view into one render artifact per component). Add a type by registering it here.
 * @internal
 */ export const VIEW_COMPONENTS = {
    panel: [
        'title',
        'panel'
    ]
};
/**
 * Fields every extension declaration shares — a view or a service. The shape is
 * identical (`name` + `src`); `kind` only tailors the validation message. Each
 * declaration adds its `type` discriminator on top.
 */ function extensionDeclarationFields(kind) {
    const pattern = /^[a-zA-Z0-9_-]+$/;
    return {
        name: z.string().check(z.regex(pattern, `${kind} \`name\` must match ${pattern}`)),
        src: z.string()
    };
}
/** What an author writes for a `panel` in `unstable_defineApp({views})`. */ const PanelViewSchema = z.object({
    type: z.literal('panel'),
    ...extensionDeclarationFields('View')
});
/**
 * The `{type, name, src}` an app declares for a view, discriminated by `type`.
 * Persisted to the application service on deploy; never part of the app manifest.
 * @internal
 */ export const InterfaceDeclarationSchema = z.discriminatedUnion('type', [
    PanelViewSchema
]);
/** Declaration schema for a `worker` service — what a developer writes in `unstable_defineApp({services})`. */ const WorkerServiceSchema = z.object({
    type: z.literal('worker'),
    ...extensionDeclarationFields('Service')
});
/**
 * A service declared on an app, discriminated by `type`. Metadata only; built
 * into a worker artifact and persisted to the application service on deploy,
 * never part of the app manifest.
 * @internal
 */ export const ServiceDeclarationSchema = z.discriminatedUnion('type', [
    WorkerServiceSchema
]);

//# sourceMappingURL=contract.js.map