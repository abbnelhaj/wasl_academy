// Package-internal shared resolver: turn a CLI config's branded
// `unstable_defineApp` app into its declared interfaces, or `null` for a plain
// project. The build and deploy accessors (actions/build, actions/deploy) each
// build their command-specific view on top of this one brand-check +
// extraction, so the discrimination lives in exactly one place.
import { isWorkbenchApp } from '@sanity/cli-core';
/**
 * Resolve the workbench app for a CLI config, or `null` for a plain project.
 * @public
 */ export function resolveWorkbenchApp(cliConfig) {
    const app = cliConfig?.app;
    if (!isWorkbenchApp(app)) return null;
    return {
        applicationType: app.applicationType,
        entry: app.entry,
        services: app.services ?? [],
        views: app.views ?? []
    };
}

//# sourceMappingURL=resolveWorkbenchApp.js.map