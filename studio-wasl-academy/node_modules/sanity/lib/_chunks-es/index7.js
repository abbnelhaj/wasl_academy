import { jsx, jsxs } from "react/jsx-runtime";
import { c } from "react/compiler-runtime";
import "history";
import { useState } from "react";
import { CommentsOnboardingContext, CommentsUpsellContext } from "sanity/_singletons";
import "rxjs";
import "rxjs/operators";
import "react-rx";
import "@sanity/client/csm";
import { useUpsellContext, getDialogPropsFromContext, UpsellDialog, useFeatureEnabled, FEATURES, AddonDatasetProvider } from "./index2.js";
import "quick-lru";
import "lodash-es/throttle.js";
import "lodash-es/isEqual.js";
import "@sanity/icons";
import "@sanity/uuid";
import "@sanity/ui";
import "@sanity/color";
import "color2k";
import "styled-components";
import "lodash-es/isString.js";
import "react-i18next";
import "./createAgentBundlesStore.js";
import "@sanity/telemetry/react";
import "@portabletext/editor";
import "@sanity/util/paths";
import "./index.js";
import "@sanity/types";
import "@sanity/diff-match-patch";
import "lodash-es/flatten.js";
import "lodash-es/orderBy.js";
import "lodash-es/uniq.js";
import "lodash-es/xor.js";
import "@sanity/diff-patch";
import "./version.js";
import "@sanity/id-utils";
import "sanity/router";
import "date-fns/addHours";
import "date-fns/startOfHour";
import "date-fns/format";
import "date-fns/isValid";
import "date-fns/parse";
import "@sanity/util/legacyDateFormat";
import "@sanity/ui/theme";
import "lodash-es/pick.js";
import "react-fast-compare";
import "lodash-es/startCase.js";
import "react-focus-lock";
import "lodash-es/debounce.js";
import "date-fns/differenceInDays";
import "date-fns/differenceInHours";
import "date-fns/differenceInMinutes";
import "date-fns/differenceInMonths";
import "date-fns/differenceInSeconds";
import "date-fns/differenceInWeeks";
import "date-fns/differenceInYears";
import "@sanity/diff";
import "mendoza";
import "@portabletext/sanity-bridge";
import "motion/react";
import "lodash-es/get.js";
import "@algorithm.ts/lcs";
import "lodash-es/intersection.js";
import "json-stable-stringify";
import "shallow-equals";
import "scroll-into-view-if-needed";
import "@sanity/schema/_internal";
import "lodash-es/groupBy.js";
import "lodash-es/sortBy.js";
import "lodash-es/compact.js";
import "lodash-es/keyBy.js";
import "lodash-es/partition.js";
import "lodash-es/toLower.js";
import "lodash-es/union.js";
import "lodash-es/words.js";
import "lodash-es/isFinite.js";
import "observable-callback";
import "@sanity/util/content";
import "lodash-es/isPlainObject.js";
import "@sanity/insert-menu";
import "@tanstack/react-virtual";
import "speakingurl";
import "@sanity/asset-utils";
import "@sanity/image-url";
import "nanoid";
import "lodash-es/castArray.js";
import "rxjs-mergemap-array";
import "@sanity/mutator";
import "@portabletext/react";
import "lodash-es/findIndex.js";
import "@xstate/react";
import "xstate";
import "@sentry/react";
import "@sanity/schema";
import "@sanity/util/client";
import "@sanity/util/concurrency-limiter";
import "lodash-es/uniqBy.js";
import "json-reduce";
import "rxjs-exhaustmap-with-trailing";
import "date-fns/isBefore";
import "date-fns/startOfMinute";
import "@portabletext/toolkit";
import "polished";
import "@sanity/client";
import "react-is";
import "exif-component";
import "lodash-es/pickBy.js";
import "swr";
import "use-hot-module-reload";
import "lodash-es/memoize.js";
import "lodash-es/sortedIndex.js";
import "lodash-es/difference.js";
import "lodash-es/identity.js";
import "lodash-es/values.js";
import "@sanity/comlink";
import "lodash-es/omit.js";
import "@isaacs/ttlcache";
import "dataloader";
import "raf";
import "groq-js";
import "use-sync-external-store/with-selector";
import "lodash-es/escapeRegExp.js";
import "lodash-es/isEmpty.js";
import "react-dom/server";
import "lodash-es/capitalize.js";
import "lodash-es/last.js";
import "react-dom/client";
import "date-fns/addWeeks";
import "date-fns/isAfter";
import "semver";
import "lodash-es/isObject.js";
const VERSION = 1, LOCAL_STORAGE_KEY = `sanityStudio:comments:inspector:onboarding:dismissed:v${VERSION}`, setLocalStorage = (value) => {
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
  } catch {
  }
}, getLocalStorage = () => {
  try {
    const value = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    return value ? JSON.parse(value) : !1;
  } catch {
    return !1;
  }
};
function CommentsOnboardingProvider(props) {
  const $ = c(7), {
    children
  } = props;
  let t0;
  $[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (t0 = getLocalStorage(), $[0] = t0) : t0 = $[0];
  const [dismissed, setDismissed] = useState(t0);
  let t1;
  $[1] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (t1 = () => {
    setDismissed(!0), setLocalStorage(!0);
  }, $[1] = t1) : t1 = $[1];
  const handleDismiss = t1;
  let t2;
  $[2] !== dismissed ? (t2 = {
    setDismissed: handleDismiss,
    isDismissed: dismissed
  }, $[2] = dismissed, $[3] = t2) : t2 = $[3];
  const ctxValue = t2;
  let t3;
  return $[4] !== children || $[5] !== ctxValue ? (t3 = /* @__PURE__ */ jsx(CommentsOnboardingContext.Provider, { value: ctxValue, children }), $[4] = children, $[5] = ctxValue, $[6] = t3) : t3 = $[6], t3;
}
function CommentsUpsellProvider(props) {
  const $ = c(9);
  let t0;
  $[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (t0 = {
    dataUri: "/journey/comments",
    feature: "comments"
  }, $[0] = t0) : t0 = $[0];
  const contextValue = useUpsellContext(t0), t1 = props.children;
  let t2;
  $[1] !== contextValue ? (t2 = getDialogPropsFromContext(contextValue), $[1] = contextValue, $[2] = t2) : t2 = $[2];
  let t3;
  $[3] !== t2 ? (t3 = /* @__PURE__ */ jsx(UpsellDialog, { ...t2 }), $[3] = t2, $[4] = t3) : t3 = $[4];
  let t4;
  return $[5] !== contextValue || $[6] !== props.children || $[7] !== t3 ? (t4 = /* @__PURE__ */ jsxs(CommentsUpsellContext.Provider, { value: contextValue, children: [
    t1,
    t3
  ] }), $[5] = contextValue, $[6] = props.children, $[7] = t3, $[8] = t4) : t4 = $[8], t4;
}
function CommentsStudioLayout(props) {
  const $ = c(8), {
    enabled,
    isLoading
  } = useFeatureEnabled(FEATURES.studioComments);
  let t0;
  $[0] !== props ? (t0 = props.renderDefault(props), $[0] = props, $[1] = t0) : t0 = $[1];
  const children = t0;
  let t1;
  $[2] !== children || $[3] !== enabled || $[4] !== isLoading ? (t1 = !enabled && !isLoading ? /* @__PURE__ */ jsx(CommentsUpsellProvider, { children }) : children, $[2] = children, $[3] = enabled, $[4] = isLoading, $[5] = t1) : t1 = $[5];
  let t2;
  return $[6] !== t1 ? (t2 = /* @__PURE__ */ jsx(AddonDatasetProvider, { children: /* @__PURE__ */ jsx(CommentsOnboardingProvider, { children: t1 }) }), $[6] = t1, $[7] = t2) : t2 = $[7], t2;
}
export {
  CommentsStudioLayout
};
//# sourceMappingURL=index7.js.map
