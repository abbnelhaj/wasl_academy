export { createCliConfig } from '../config/createCliConfig.js';
export { defineCliConfig } from '../config/defineCliConfig.js';
export { getCliClient } from '../util/cliClient.js';
export { loadEnv } from '../util/loadEnv.js';
// Module-federation application extension API (config-time). Canonical
// implementation lives in `@sanity/workbench-cli`; re-exported here so
// `sanity/cli` can surface it to app authors via
// `import {unstable_defineApp} from 'sanity/cli'`. The runtime helpers
// `unstable_defineView`/`unstable_defineService` are NOT here — they bundle to
// the browser, so they live on the browser-safe `@sanity/cli/runtime` entry to
// keep Node-only deps out of the frontend bundle.
export { unstable_defineApp } from '@sanity/workbench-cli';

//# sourceMappingURL=index.js.map