import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { c } from "react/compiler-runtime";
import { useContext, useEffect } from "react";
import "rxjs/operators";
import "react-rx";
import "rxjs";
import { isVersionId, getPublishedId } from "@sanity/client/csm";
import { useTasksEnabled, useTasks } from "./index2.js";
import "quick-lru";
import "lodash-es/throttle.js";
import "lodash-es/isEqual.js";
import { IsLastPaneContext } from "sanity/_singletons";
import "history";
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
function useIsLastPane() {
  return useContext(IsLastPaneContext);
}
function SetActiveDocumentInner(document) {
  const $ = c(6), {
    documentId,
    documentType
  } = document, isLast = useIsLastPane(), {
    setActiveDocument
  } = useTasks();
  let t0, t1;
  return $[0] !== documentId || $[1] !== documentType || $[2] !== isLast || $[3] !== setActiveDocument ? (t0 = () => (documentId && isLast && documentType && setActiveDocument?.({
    documentId: isVersionId(documentId) ? documentId : getPublishedId(documentId),
    documentType
  }), () => {
    isLast && setActiveDocument?.(null);
  }), t1 = [documentId, documentType, isLast, setActiveDocument], $[0] = documentId, $[1] = documentType, $[2] = isLast, $[3] = setActiveDocument, $[4] = t0, $[5] = t1) : (t0 = $[4], t1 = $[5]), useEffect(t0, t1), null;
}
function SetActiveDocument(document) {
  const $ = c(2), {
    enabled
  } = useTasksEnabled();
  if (!enabled)
    return null;
  let t0;
  return $[0] !== document ? (t0 = /* @__PURE__ */ jsx(SetActiveDocumentInner, { ...document }), $[0] = document, $[1] = t0) : t0 = $[1], t0;
}
function TasksDocumentInputLayout(props) {
  const $ = c(8), documentId = props.value?._id, documentType = props.value?._type;
  let t0;
  $[0] !== documentId || $[1] !== documentType ? (t0 = /* @__PURE__ */ jsx(SetActiveDocument, { documentId, documentType }), $[0] = documentId, $[1] = documentType, $[2] = t0) : t0 = $[2];
  let t1;
  $[3] !== props ? (t1 = props.renderDefault(props), $[3] = props, $[4] = t1) : t1 = $[4];
  let t2;
  return $[5] !== t0 || $[6] !== t1 ? (t2 = /* @__PURE__ */ jsxs(Fragment, { children: [
    t0,
    t1
  ] }), $[5] = t0, $[6] = t1, $[7] = t2) : t2 = $[7], t2;
}
export {
  TasksDocumentInputLayout
};
//# sourceMappingURL=TasksDocumentInputLayout.js.map
