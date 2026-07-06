// Public, browser-safe entry for `@sanity/workbench-cli` — the authoring API app
// authors call from `sanity.cli.ts` (re-exported by `sanity/cli` and the
// `sanity` runtime entry). Calling `unstable_defineApp` is the *sole* workbench
// opt-in: it stamps the global brand `Symbol.for('sanity.workbench.defineApp')`,
// which the CLI discriminates on (see `isWorkbenchApp` in `@sanity/cli-core`).
//
// This module graph must stay browser-safe: zod-only, no `node:*`, no vite, no
// `@sanity/cli-core`. View/service `src` files bundle to the browser, so anything
// reachable from here ships in the frontend bundle. The Node-only build glue
// lives behind the separate `./vite` entry and never leaks in.
export { unstable_defineApp } from '../defineApp.js';
export { unstable_defineService } from '../defineService.js';
export { unstable_defineView } from '../defineView.js';

//# sourceMappingURL=index.js.map