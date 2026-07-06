import { jsxs, jsx } from "react/jsx-runtime";
import { c } from "react/compiler-runtime";
import { TaskIcon } from "@sanity/icons";
import { useMediaIndex, Badge } from "@sanity/ui";
import { styled } from "styled-components";
import { Button } from "./index.js";
import "react";
import "react-i18next";
import "sanity/_singletons";
import { useTasks, useTasksNavigation, useTranslation, tasksLocaleNamespace } from "./index2.js";
import "history";
import "rxjs";
import "rxjs/operators";
import "react-rx";
import "@sanity/client/csm";
import "quick-lru";
import "lodash-es/throttle.js";
import "lodash-es/isEqual.js";
import "@sanity/uuid";
import "@sanity/color";
import "color2k";
import "lodash-es/isString.js";
import "./createAgentBundlesStore.js";
import "@sanity/telemetry/react";
import "@portabletext/editor";
import "@sanity/util/paths";
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
const ButtonContainer = styled.div.withConfig({
  displayName: "ButtonContainer",
  componentId: "sc-s9haa-0"
})`position:relative;[data-ui='Badge']{position:absolute;top:-2px;right:-2px;}`;
function TasksFooterOpenTasks() {
  const $ = c(31), {
    data,
    activeDocument
  } = useTasks(), {
    handleOpenTasks,
    setActiveTab
  } = useTasksNavigation(), mediaIndex = useMediaIndex();
  let t0;
  $[0] !== activeDocument || $[1] !== data ? (t0 = activeDocument?.documentId ? data.filter((item) => item.target?.document._ref === activeDocument.documentId && item.status === "open" && item.createdByUser) : [], $[0] = activeDocument, $[1] = data, $[2] = t0) : t0 = $[2];
  const pendingTasks = t0;
  let t1;
  $[3] !== handleOpenTasks || $[4] !== setActiveTab ? (t1 = () => {
    handleOpenTasks(), setActiveTab("document");
  }, $[3] = handleOpenTasks, $[4] = setActiveTab, $[5] = t1) : t1 = $[5];
  const handleOnClick = t1, {
    t
  } = useTranslation(tasksLocaleNamespace);
  if (pendingTasks.length === 0)
    return null;
  if (mediaIndex < 3) {
    let t22;
    $[6] !== pendingTasks.length || $[7] !== t ? (t22 = t("document.footer.open-tasks.placeholder", {
      count: pendingTasks.length
    }), $[6] = pendingTasks.length, $[7] = t, $[8] = t22) : t22 = $[8];
    let t32;
    $[9] !== t22 ? (t32 = {
      content: t22
    }, $[9] = t22, $[10] = t32) : t32 = $[10];
    let t42;
    $[11] !== handleOnClick || $[12] !== t32 ? (t42 = /* @__PURE__ */ jsx(Button, { mode: "bleed", icon: TaskIcon, size: "large", onClick: handleOnClick, tooltipProps: t32 }), $[11] = handleOnClick, $[12] = t32, $[13] = t42) : t42 = $[13];
    let t52;
    $[14] !== pendingTasks.length ? (t52 = /* @__PURE__ */ jsx(Badge, { "data-testid": "tasks-badge", tone: "primary", fontSize: 0, children: pendingTasks.length }), $[14] = pendingTasks.length, $[15] = t52) : t52 = $[15];
    let t6;
    return $[16] !== t42 || $[17] !== t52 ? (t6 = /* @__PURE__ */ jsxs(ButtonContainer, { children: [
      t42,
      t52
    ] }), $[16] = t42, $[17] = t52, $[18] = t6) : t6 = $[18], t6;
  }
  let t2;
  $[19] !== pendingTasks.length || $[20] !== t ? (t2 = t("document.footer.open-tasks.placeholder", {
    count: pendingTasks.length
  }), $[19] = pendingTasks.length, $[20] = t, $[21] = t2) : t2 = $[21];
  let t3;
  $[22] !== t2 ? (t3 = {
    content: t2
  }, $[22] = t2, $[23] = t3) : t3 = $[23];
  let t4;
  $[24] !== pendingTasks.length || $[25] !== t ? (t4 = t("document.footer.open-tasks.text", {
    count: pendingTasks.length
  }), $[24] = pendingTasks.length, $[25] = t, $[26] = t4) : t4 = $[26];
  let t5;
  return $[27] !== handleOnClick || $[28] !== t3 || $[29] !== t4 ? (t5 = /* @__PURE__ */ jsx(Button, { mode: "bleed", tooltipProps: t3, text: t4, onClick: handleOnClick }), $[27] = handleOnClick, $[28] = t3, $[29] = t4, $[30] = t5) : t5 = $[30], t5;
}
export {
  TasksFooterOpenTasks
};
//# sourceMappingURL=TasksFooterOpenTasks.js.map
