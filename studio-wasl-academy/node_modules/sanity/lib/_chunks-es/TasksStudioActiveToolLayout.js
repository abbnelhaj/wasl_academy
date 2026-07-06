import { jsx, jsxs } from "react/jsx-runtime";
import { c } from "react/compiler-runtime";
import { useMediaIndex, Flex, Box, Layer } from "@sanity/ui";
import { AnimatePresence } from "motion/react";
import { styled, css } from "styled-components";
import { useTasksEnabled, useTasksNavigation, TasksStudioSidebar } from "./index2.js";
import "@sanity/ui/theme";
import "react";
import "history";
import "sanity/_singletons";
import "rxjs";
import "rxjs/operators";
import "react-rx";
import "@sanity/client/csm";
import "quick-lru";
import "lodash-es/throttle.js";
import "lodash-es/isEqual.js";
import "@sanity/icons";
import "@sanity/uuid";
import "@sanity/color";
import "color2k";
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
import "@sanity/id-utils";
import "sanity/router";
import "date-fns/addHours";
import "date-fns/startOfHour";
import "date-fns/format";
import "date-fns/isValid";
import "date-fns/parse";
import "@sanity/util/legacyDateFormat";
import "react-fast-compare";
import "lodash-es/pick.js";
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
import "lodash-es/startCase.js";
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
import "lodash-es/debounce.js";
import "polished";
import "@sanity/client";
import "react-is";
import "exif-component";
import "lodash-es/pickBy.js";
import "swr";
import "use-hot-module-reload";
import "react-focus-lock";
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
const FULLSCREEN_MEDIA_INDEX = 1, POSITION_ABSOLUTE_MEDIA_INDEX = 3, RootFlex = /* @__PURE__ */ styled(Flex).withConfig({
  displayName: "RootFlex",
  componentId: "sc-1y8zfkj-0"
})(({
  theme
}) => {
  const media = theme.sanity.media;
  return css`
    min-height: 100%;

    @media (max-width: ${media[POSITION_ABSOLUTE_MEDIA_INDEX]}px) {
      position: relative;
    }
  `;
}), SidebarMotionLayer = /* @__PURE__ */ styled(Layer).withConfig({
  displayName: "SidebarMotionLayer",
  componentId: "sc-1y8zfkj-1"
})(({
  theme
}) => {
  const media = theme.sanity.media;
  return css`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 360px;
    border-left: 1px solid var(--card-border-color);
    box-sizing: border-box;
    overflow: hidden;

    box-shadow:
      0px 6px 8px -4px var(--card-shadow-umbra-color),
      0px 12px 17px -1px var(--card-shadow-penumbra-color);

    @media (max-width: ${media[POSITION_ABSOLUTE_MEDIA_INDEX]}px) {
      bottom: 0;
      position: absolute;
      right: 0;
      top: 0;
    }

    @media (max-width: ${media[FULLSCREEN_MEDIA_INDEX]}px) {
      border-left: 0;
      min-width: 100%;
      left: 0;
    }
  `;
});
function TasksStudioActiveToolLayoutInner(props) {
  const $ = c(12), mediaIndex = useMediaIndex(), {
    state: t0
  } = useTasksNavigation(), {
    isOpen
  } = t0, t1 = mediaIndex <= FULLSCREEN_MEDIA_INDEX && isOpen ? "hidden" : "auto";
  let t2;
  $[0] !== props ? (t2 = props.renderDefault(props), $[0] = props, $[1] = t2) : t2 = $[1];
  let t3;
  $[2] !== t1 || $[3] !== t2 ? (t3 = /* @__PURE__ */ jsx(Box, { flex: 1, height: "fill", overflow: t1, children: t2 }), $[2] = t1, $[3] = t2, $[4] = t3) : t3 = $[4];
  let t4;
  $[5] !== isOpen ? (t4 = isOpen && /* @__PURE__ */ jsx(SidebarMotionLayer, { zOffset: 100, height: "fill", children: /* @__PURE__ */ jsx(TasksStudioSidebar, {}) }), $[5] = isOpen, $[6] = t4) : t4 = $[6];
  let t5;
  $[7] !== t4 ? (t5 = /* @__PURE__ */ jsx(AnimatePresence, { initial: !1, children: t4 }), $[7] = t4, $[8] = t5) : t5 = $[8];
  let t6;
  return $[9] !== t3 || $[10] !== t5 ? (t6 = /* @__PURE__ */ jsxs(RootFlex, { sizing: "border", height: "fill", children: [
    t3,
    t5
  ] }), $[9] = t3, $[10] = t5, $[11] = t6) : t6 = $[11], t6;
}
function TasksStudioActiveToolLayout(props) {
  const $ = c(4), {
    enabled
  } = useTasksEnabled();
  if (!enabled) {
    let t02;
    return $[0] !== props ? (t02 = props.renderDefault(props), $[0] = props, $[1] = t02) : t02 = $[1], t02;
  }
  let t0;
  return $[2] !== props ? (t0 = /* @__PURE__ */ jsx(TasksStudioActiveToolLayoutInner, { ...props }), $[2] = props, $[3] = t0) : t0 = $[3], t0;
}
export {
  TasksStudioActiveToolLayout
};
//# sourceMappingURL=TasksStudioActiveToolLayout.js.map
