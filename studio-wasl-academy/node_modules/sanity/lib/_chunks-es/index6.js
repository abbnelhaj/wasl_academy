import { jsx, jsxs } from "react/jsx-runtime";
import { c } from "react/compiler-runtime";
import { hues } from "@sanity/color";
import { Stack, useClickOutsideEvent, Text, Flex, Button as Button$1, useBoundaryElement } from "@sanity/ui";
import * as PathUtils from "@sanity/util/paths";
import { uuid } from "@sanity/uuid";
import { AnimatePresence, motion } from "motion/react";
import { useContext, useRef, useState } from "react";
import { styled, css } from "styled-components";
import { useTranslation, commentsLocaleNamespace, useAddonDataset, hasCommentMessageValue, Translate, CommentInput, useCommentsEnabled, useCurrentUser, useComments, useCommentsSelectedPath, useCommentsScroll, applyCommentsFieldAttr, isTextSelectionComment, getSchemaTypeTitle, COMMENTS_HIGHLIGHT_HUE_KEY } from "./index2.js";
import "./createAgentBundlesStore.js";
import "react-i18next";
import { CommentsAuthoringPathContext } from "sanity/_singletons";
import "history";
import "rxjs";
import "rxjs/operators";
import "react-rx";
import "@sanity/client/csm";
import "quick-lru";
import "lodash-es/throttle.js";
import "lodash-es/isEqual.js";
import { AddCommentIcon, CommentIcon } from "@sanity/icons";
import "color2k";
import "lodash-es/isString.js";
import "@sanity/types";
import "use-sync-external-store/with-selector";
import "lodash-es/escapeRegExp.js";
import "@sanity/telemetry/react";
import "@portabletext/editor";
import { Popover, Tooltip, Button } from "./index.js";
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
import { useCommentsUpsell } from "./useCommentsUpsell.js";
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
import "lodash-es/isEmpty.js";
import "react-dom/server";
import "lodash-es/capitalize.js";
import "lodash-es/last.js";
import "react-dom/client";
import "date-fns/addWeeks";
import "date-fns/isAfter";
import "semver";
import "lodash-es/isObject.js";
function useCommentsAuthoringPath() {
  const value = useContext(CommentsAuthoringPathContext);
  if (!value)
    throw new Error("useCommentsAuthoringPath: missing context value");
  return value;
}
const ContentStack = styled(Stack).withConfig({
  displayName: "ContentStack",
  componentId: "sc-1pykjeg-0"
})`width:320px;`;
function CommentsFieldButton(props) {
  const $ = c(69), {
    count,
    currentUser,
    fieldTitle,
    isCreatingDataset,
    mentionOptions,
    onChange,
    onClick,
    onClose,
    onCommentAdd,
    onDiscard,
    onInputKeyDown,
    open,
    value
  } = props, {
    t
  } = useTranslation(commentsLocaleNamespace), {
    error: addonDatasetError
  } = useAddonDataset(), popoverRef = useRef(null), [addCommentButtonElement, setAddCommentButtonElement] = useState(null), commentInputHandle = useRef(null), hasComments = count > 0;
  let t0;
  $[0] !== addCommentButtonElement || $[1] !== onClose || $[2] !== open ? (t0 = () => {
    open && (onClose(), addCommentButtonElement?.focus());
  }, $[0] = addCommentButtonElement, $[1] = onClose, $[2] = open, $[3] = t0) : t0 = $[3];
  const closePopover = t0;
  let t1;
  $[4] !== closePopover || $[5] !== onCommentAdd ? (t1 = (nextValue) => {
    onCommentAdd(nextValue), closePopover();
  }, $[4] = closePopover, $[5] = onCommentAdd, $[6] = t1) : t1 = $[6];
  const handleSubmit = t1;
  let t2;
  $[7] !== value ? (t2 = hasCommentMessageValue(value), $[7] = value, $[8] = t2) : t2 = $[8];
  const hasValue = t2;
  let t3;
  $[9] !== closePopover || $[10] !== hasValue ? (t3 = () => {
    if (!hasValue) {
      closePopover();
      return;
    }
    commentInputHandle.current?.discardDialogController.open();
  }, $[9] = closePopover, $[10] = hasValue, $[11] = t3) : t3 = $[11];
  const startDiscard = t3;
  let t4;
  $[12] !== onInputKeyDown ? (t4 = (event) => {
    event.isDefaultPrevented() || onInputKeyDown && onInputKeyDown(event);
  }, $[12] = onInputKeyDown, $[13] = t4) : t4 = $[13];
  const handleInputKeyDown = t4;
  let t5;
  $[14] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (t5 = () => {
    commentInputHandle.current?.discardDialogController.close();
  }, $[14] = t5) : t5 = $[14];
  const handleDiscardCancel = t5;
  let t6;
  $[15] !== closePopover || $[16] !== onDiscard ? (t6 = () => {
    commentInputHandle.current?.discardDialogController.close(), closePopover(), onDiscard();
  }, $[15] = closePopover, $[16] = onDiscard, $[17] = t6) : t6 = $[17];
  const handleDiscardConfirm = t6;
  let t7;
  $[18] !== startDiscard ? (t7 = (event_0) => {
    event_0.key === "Escape" && (event_0.preventDefault(), event_0.stopPropagation(), startDiscard());
  }, $[18] = startDiscard, $[19] = t7) : t7 = $[19];
  const handlePopoverKeyDown = t7;
  let t8;
  if ($[20] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (t8 = () => [popoverRef.current], $[20] = t8) : t8 = $[20], useClickOutsideEvent(!open && startDiscard, t8), !hasComments) {
    let t92;
    $[21] !== fieldTitle ? (t92 = {
      field: fieldTitle
    }, $[21] = fieldTitle, $[22] = t92) : t92 = $[22];
    let t102;
    $[23] !== t || $[24] !== t92 ? (t102 = /* @__PURE__ */ jsx(Translate, { t, i18nKey: "compose.add-comment-input-placeholder", values: t92 }), $[23] = t, $[24] = t92, $[25] = t102) : t102 = $[25];
    const placeholder = t102;
    let t112;
    $[26] !== currentUser || $[27] !== handleDiscardConfirm || $[28] !== handleInputKeyDown || $[29] !== handleSubmit || $[30] !== isCreatingDataset || $[31] !== mentionOptions || $[32] !== onChange || $[33] !== placeholder || $[34] !== value ? (t112 = /* @__PURE__ */ jsx(ContentStack, { padding: 2, space: 4, children: /* @__PURE__ */ jsx(CommentInput, { currentUser, focusLock: !0, focusOnMount: !0, mentionOptions, onChange, onDiscardCancel: handleDiscardCancel, onDiscardConfirm: handleDiscardConfirm, onKeyDown: handleInputKeyDown, onSubmit: handleSubmit, placeholder, readOnly: isCreatingDataset, ref: commentInputHandle, value }) }), $[26] = currentUser, $[27] = handleDiscardConfirm, $[28] = handleInputKeyDown, $[29] = handleSubmit, $[30] = isCreatingDataset, $[31] = mentionOptions, $[32] = onChange, $[33] = placeholder, $[34] = value, $[35] = t112) : t112 = $[35];
    const content = t112;
    let t122;
    $[36] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (t122 = ["bottom-end"], $[36] = t122) : t122 = $[36];
    let t132;
    $[37] !== t ? (t132 = t("field-button.aria-label-add"), $[37] = t, $[38] = t132) : t132 = $[38];
    const t142 = isCreatingDataset || !!addonDatasetError;
    let t152;
    $[39] !== t ? (t152 = t("field-button.title"), $[39] = t, $[40] = t152) : t152 = $[40];
    let t16;
    $[41] !== t152 ? (t16 = {
      content: t152,
      placement: "top"
    }, $[41] = t152, $[42] = t16) : t16 = $[42];
    let t17;
    $[43] !== onClick || $[44] !== open || $[45] !== t132 || $[46] !== t142 || $[47] !== t16 ? (t17 = /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Button, { "aria-label": t132, disabled: t142, icon: AddCommentIcon, mode: "bleed", onClick, ref: setAddCommentButtonElement, selected: open, tooltipProps: t16 }) }), $[43] = onClick, $[44] = open, $[45] = t132, $[46] = t142, $[47] = t16, $[48] = t17) : t17 = $[48];
    let t18;
    return $[49] !== content || $[50] !== handlePopoverKeyDown || $[51] !== open || $[52] !== t17 ? (t18 = /* @__PURE__ */ jsx(Popover, { constrainSize: !0, content, fallbackPlacements: t122, open, placement: "right-start", portal: !0, ref: popoverRef, onKeyDown: handlePopoverKeyDown, children: t17 }), $[49] = content, $[50] = handlePopoverKeyDown, $[51] = open, $[52] = t17, $[53] = t18) : t18 = $[53], t18;
  }
  let t9;
  $[54] !== count || $[55] !== t ? (t9 = t("field-button.content", {
    count
  }), $[54] = count, $[55] = t, $[56] = t9) : t9 = $[56];
  let t10;
  $[57] !== t ? (t10 = t("field-button.aria-label-open"), $[57] = t, $[58] = t10) : t10 = $[58];
  let t11;
  $[59] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (t11 = /* @__PURE__ */ jsx(Text, { size: 1, children: /* @__PURE__ */ jsx(CommentIcon, {}) }), $[59] = t11) : t11 = $[59];
  const t12 = count > 9 ? "9+" : count;
  let t13;
  $[60] !== t12 ? (t13 = /* @__PURE__ */ jsxs(Flex, { align: "center", gap: 2, children: [
    t11,
    /* @__PURE__ */ jsx(Text, { size: 0, children: t12 })
  ] }), $[60] = t12, $[61] = t13) : t13 = $[61];
  let t14;
  $[62] !== onClick || $[63] !== t10 || $[64] !== t13 ? (t14 = /* @__PURE__ */ jsx(Button$1, { "aria-label": t10, mode: "bleed", onClick, padding: 2, space: 2, children: t13 }), $[62] = onClick, $[63] = t10, $[64] = t13, $[65] = t14) : t14 = $[65];
  let t15;
  return $[66] !== t14 || $[67] !== t9 ? (t15 = /* @__PURE__ */ jsx(Tooltip, { portal: !0, placement: "top", content: t9, children: t14 }), $[66] = t14, $[67] = t9, $[68] = t15) : t15 = $[68], t15;
}
const messageCache = /* @__PURE__ */ new Map(), EMPTY_ARRAY = [], HIGHLIGHT_BLOCK_VARIANTS = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1
  },
  exit: {
    opacity: 0
  }
};
function CommentsField(props) {
  const $ = c(5), {
    enabled,
    mode
  } = useCommentsEnabled();
  if (!enabled) {
    let t02;
    return $[0] !== props ? (t02 = props.renderDefault(props), $[0] = props, $[1] = t02) : t02 = $[1], t02;
  }
  let t0;
  return $[2] !== mode || $[3] !== props ? (t0 = /* @__PURE__ */ jsx(CommentFieldInner, { ...props, mode }), $[2] = mode, $[3] = props, $[4] = t0) : t0 = $[4], t0;
}
const HighlightDiv = /* @__PURE__ */ styled(motion.div).withConfig({
  displayName: "HighlightDiv",
  componentId: "sc-xeguza-0"
})(({
  theme
}) => {
  const {
    radius,
    space,
    color
  } = theme.sanity, bg = hues[COMMENTS_HIGHLIGHT_HUE_KEY][color.dark ? 900 : 50].hex;
  return css`
    mix-blend-mode: ${color.dark ? "screen" : "multiply"};
    border-radius: ${radius[3]}px;
    top: -${space[2]}px;
    left: -${space[2]}px;
    bottom: -${space[2]}px;
    right: -${space[2]}px;
    pointer-events: none;
    position: absolute;
    z-index: 1;
    width: calc(100% + ${space[2] * 2}px);
    height: calc(100% + ${space[2] * 2}px);
    background-color: ${bg};
  `;
}), FieldStack = styled(Stack).withConfig({
  displayName: "FieldStack",
  componentId: "sc-xeguza-1"
})`position:relative;&:empty:not([hidden]){display:none;}`;
function CommentFieldInner(props) {
  const $ = c(84), {
    mode
  } = props, currentUser = useCurrentUser(), {
    element: boundaryElement
  } = useBoundaryElement(), rootRef = useRef(null), {
    comments,
    isCommentsOpen,
    isCreatingDataset,
    mentionOptions,
    onCommentsOpen,
    operation,
    setStatus,
    status
  } = useComments(), {
    upsellData,
    handleOpenDialog
  } = useCommentsUpsell(), {
    selectedPath,
    setSelectedPath
  } = useCommentsSelectedPath(), {
    authoringPath,
    setAuthoringPath
  } = useCommentsAuthoringPath();
  let t0;
  $[0] !== boundaryElement ? (t0 = {
    boundaryElement
  }, $[0] = boundaryElement, $[1] = t0) : t0 = $[1];
  const {
    scrollToGroup
  } = useCommentsScroll(t0);
  let t1;
  $[2] !== props.schemaType ? (t1 = getSchemaTypeTitle(props.schemaType), $[2] = props.schemaType, $[3] = t1) : t1 = $[3];
  const fieldTitle = t1;
  let t2;
  $[4] !== props.path ? (t2 = PathUtils.toString(props.path), $[4] = props.path, $[5] = t2) : t2 = $[5];
  const stringPath = t2;
  let t3;
  $[6] !== stringPath ? (t3 = messageCache.get(stringPath) || null, $[6] = stringPath, $[7] = t3) : t3 = $[7];
  const cachedValue = t3, [value, setValue] = useState(cachedValue), isOpen = authoringPath === stringPath;
  let t4;
  $[8] !== isCommentsOpen || $[9] !== selectedPath?.fieldPath || $[10] !== selectedPath?.origin || $[11] !== stringPath ? (t4 = () => !isCommentsOpen || selectedPath?.origin === "form" || selectedPath?.origin === "url" ? !1 : selectedPath?.fieldPath === stringPath, $[8] = isCommentsOpen, $[9] = selectedPath?.fieldPath, $[10] = selectedPath?.origin, $[11] = stringPath, $[12] = t4) : t4 = $[12];
  const isSelected = t4();
  let t5;
  if ($[13] !== comments.data.open || $[14] !== selectedPath?.threadId) {
    let t62;
    $[16] !== selectedPath?.threadId ? (t62 = (c2) => c2.threadId === selectedPath?.threadId, $[16] = selectedPath?.threadId, $[17] = t62) : t62 = $[17], t5 = comments.data.open.filter(t62).some(_temp), $[13] = comments.data.open, $[14] = selectedPath?.threadId, $[15] = t5;
  } else
    t5 = $[15];
  const isInlineCommentThread = t5;
  let t6;
  if ($[18] !== comments.data.open || $[19] !== stringPath) {
    let t72;
    $[21] !== stringPath ? (t72 = (c_0) => c_0.fieldPath === stringPath ? c_0.commentsCount : 0, $[21] = stringPath, $[22] = t72) : t72 = $[22], t6 = comments.data.open.map(t72).reduce(_temp2, 0), $[18] = comments.data.open, $[19] = stringPath, $[20] = t6;
  } else
    t6 = $[20];
  const count = t6 || 0, hasComments = count > 0;
  let t7;
  $[23] !== stringPath ? (t7 = () => {
    setValue(null), messageCache.delete(stringPath);
  }, $[23] = stringPath, $[24] = t7) : t7 = $[24];
  const resetMessageValue = t7;
  let t8;
  $[25] !== comments.data.open || $[26] !== handleOpenDialog || $[27] !== hasComments || $[28] !== isOpen || $[29] !== mode || $[30] !== onCommentsOpen || $[31] !== props.path || $[32] !== scrollToGroup || $[33] !== setAuthoringPath || $[34] !== setSelectedPath || $[35] !== setStatus || $[36] !== status || $[37] !== stringPath || $[38] !== upsellData ? (t8 = () => {
    if (hasComments) {
      status === "resolved" && setStatus("open"), setAuthoringPath(null), onCommentsOpen?.();
      const scrollToThreadId = comments.data.open.find((c_1) => c_1.fieldPath === PathUtils.toString(props.path))?.threadId;
      scrollToThreadId && (setSelectedPath({
        threadId: scrollToThreadId,
        origin: "form",
        fieldPath: PathUtils.toString(props.path)
      }), scrollToGroup(scrollToThreadId));
      return;
    }
    if (mode === "upsell") {
      upsellData ? handleOpenDialog("field_action") : onCommentsOpen?.();
      return;
    }
    setAuthoringPath(isOpen ? null : stringPath);
  }, $[25] = comments.data.open, $[26] = handleOpenDialog, $[27] = hasComments, $[28] = isOpen, $[29] = mode, $[30] = onCommentsOpen, $[31] = props.path, $[32] = scrollToGroup, $[33] = setAuthoringPath, $[34] = setSelectedPath, $[35] = setStatus, $[36] = status, $[37] = stringPath, $[38] = upsellData, $[39] = t8) : t8 = $[39];
  const handleClick = t8;
  let t9;
  $[40] !== onCommentsOpen || $[41] !== operation || $[42] !== props.path || $[43] !== resetMessageValue || $[44] !== scrollToGroup || $[45] !== setSelectedPath || $[46] !== setStatus || $[47] !== status ? (t9 = (nextValue) => {
    if (nextValue) {
      const newThreadId = uuid(), nextComment = {
        type: "field",
        fieldPath: PathUtils.toString(props.path),
        message: nextValue,
        parentCommentId: void 0,
        status: "open",
        threadId: newThreadId,
        reactions: EMPTY_ARRAY
      };
      operation.create(nextComment), onCommentsOpen?.(), status === "resolved" && setStatus("open"), resetMessageValue(), setSelectedPath({
        threadId: newThreadId,
        origin: "form",
        fieldPath: PathUtils.toString(props.path)
      }), scrollToGroup(newThreadId);
    }
  }, $[40] = onCommentsOpen, $[41] = operation, $[42] = props.path, $[43] = resetMessageValue, $[44] = scrollToGroup, $[45] = setSelectedPath, $[46] = setStatus, $[47] = status, $[48] = t9) : t9 = $[48];
  const handleCommentAdd = t9;
  let t10;
  $[49] !== setAuthoringPath ? (t10 = () => setAuthoringPath(null), $[49] = setAuthoringPath, $[50] = t10) : t10 = $[50];
  const handleClose = t10;
  let t11;
  $[51] !== stringPath ? (t11 = (nextValue_0) => {
    setValue(nextValue_0), messageCache.set(stringPath, nextValue_0);
  }, $[51] = stringPath, $[52] = t11) : t11 = $[52];
  const handleOnChange = t11;
  let t12;
  $[53] !== count || $[54] !== currentUser || $[55] !== fieldTitle || $[56] !== handleClick || $[57] !== handleClose || $[58] !== handleCommentAdd || $[59] !== handleOnChange || $[60] !== isCreatingDataset || $[61] !== isOpen || $[62] !== mentionOptions || $[63] !== resetMessageValue || $[64] !== value ? (t12 = currentUser && /* @__PURE__ */ jsx(CommentsFieldButton, { count: Number(count), currentUser, fieldTitle, isCreatingDataset, mentionOptions, onChange: handleOnChange, onClick: handleClick, onClose: handleClose, onCommentAdd: handleCommentAdd, onDiscard: resetMessageValue, open: isOpen, value }), $[53] = count, $[54] = currentUser, $[55] = fieldTitle, $[56] = handleClick, $[57] = handleClose, $[58] = handleCommentAdd, $[59] = handleOnChange, $[60] = isCreatingDataset, $[61] = isOpen, $[62] = mentionOptions, $[63] = resetMessageValue, $[64] = value, $[65] = t12) : t12 = $[65];
  let t13;
  $[66] !== hasComments || $[67] !== isOpen || $[68] !== t12 ? (t13 = {
    button: t12,
    hasComments,
    isAddingComment: isOpen
  }, $[66] = hasComments, $[67] = isOpen, $[68] = t12, $[69] = t13) : t13 = $[69];
  const internalComments = t13;
  let t14;
  $[70] !== props.path ? (t14 = applyCommentsFieldAttr(PathUtils.toString(props.path)), $[70] = props.path, $[71] = t14) : t14 = $[71];
  let t15;
  $[72] !== internalComments || $[73] !== props ? (t15 = props.renderDefault({
    ...props,
    __internal_comments: internalComments
  }), $[72] = internalComments, $[73] = props, $[74] = t15) : t15 = $[74];
  let t16;
  $[75] !== isInlineCommentThread || $[76] !== isSelected ? (t16 = isSelected && !isInlineCommentThread && /* @__PURE__ */ jsx(HighlightDiv, { animate: "animate", exit: "exit", initial: "initial", variants: HIGHLIGHT_BLOCK_VARIANTS }), $[75] = isInlineCommentThread, $[76] = isSelected, $[77] = t16) : t16 = $[77];
  let t17;
  $[78] !== t16 ? (t17 = /* @__PURE__ */ jsx(AnimatePresence, { children: t16 }), $[78] = t16, $[79] = t17) : t17 = $[79];
  let t18;
  return $[80] !== t14 || $[81] !== t15 || $[82] !== t17 ? (t18 = /* @__PURE__ */ jsxs(FieldStack, { ...t14, ref: rootRef, children: [
    t15,
    t17
  ] }), $[80] = t14, $[81] = t15, $[82] = t17, $[83] = t18) : t18 = $[83], t18;
}
function _temp2(acc, val) {
  return acc + val;
}
function _temp(x) {
  return isTextSelectionComment(x.parentComment);
}
export {
  CommentsField
};
//# sourceMappingURL=index6.js.map
