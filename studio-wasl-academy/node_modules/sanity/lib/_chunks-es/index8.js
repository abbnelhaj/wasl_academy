import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { c } from "react/compiler-runtime";
import { isPortableTextTextBlock, isArrayOfBlocksSchemaType } from "@sanity/types";
import { PortableTextEditor } from "@portabletext/editor";
import { useClickOutsideEvent, Stack, usePortal, BoundaryElementProvider } from "@sanity/ui";
import * as PathUtils from "@sanity/util/paths";
import { uuid } from "@sanity/uuid";
import debounce from "lodash-es/debounce.js";
import isEqual from "lodash-es/isEqual.js";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef, memo, startTransition } from "react";
import { Popover, Button } from "./index.js";
import "react-i18next";
import "sanity/_singletons";
import { useTranslation, commentsLocaleNamespace, CommentDisabledIcon, hasCommentMessageValue, CommentInput, useCommentsEnabled, useFieldActions, useCurrentUser, useComments, useAddonDataset, useCommentsSelectedPath, useCommentsScroll, isTextSelectionComment, buildTextSelectionFromFragment, buildRangeDecorationSelectionsFromComments, buildCommentRangeDecorations, CommentInlineHighlightSpan } from "./index2.js";
import "history";
import "rxjs";
import "rxjs/operators";
import "react-rx";
import "@sanity/client/csm";
import "quick-lru";
import "lodash-es/throttle.js";
import { AddCommentIcon } from "@sanity/icons";
import "@sanity/color";
import "color2k";
import { styled } from "styled-components";
import "lodash-es/isString.js";
import "./createAgentBundlesStore.js";
import "@sanity/telemetry/react";
import "@sanity/diff-match-patch";
import "lodash-es/flatten.js";
import "lodash-es/orderBy.js";
import "lodash-es/uniq.js";
import "lodash-es/xor.js";
import "@sanity/diff-patch";
import "./version.js";
import "@sanity/ui/theme";
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
import "@sanity/id-utils";
import "sanity/router";
import "date-fns/addHours";
import "date-fns/startOfHour";
import "date-fns/format";
import "date-fns/isValid";
import "date-fns/parse";
import "@sanity/util/legacyDateFormat";
import "observable-callback";
import "@sanity/util/content";
import "lodash-es/isPlainObject.js";
import "@sanity/insert-menu";
import "@tanstack/react-virtual";
import "lodash-es/startCase.js";
import "speakingurl";
import "@portabletext/react";
import "lodash-es/findIndex.js";
import { useCommentsUpsell } from "./useCommentsUpsell.js";
import "@xstate/react";
import "xstate";
import "@sentry/react";
import "rxjs-mergemap-array";
import "@sanity/schema";
import "@sanity/util/client";
import "@sanity/util/concurrency-limiter";
import "lodash-es/uniqBy.js";
import "json-reduce";
import "rxjs-exhaustmap-with-trailing";
import "date-fns/isBefore";
import "date-fns/startOfMinute";
import "@portabletext/toolkit";
import "react-focus-lock";
import "@sanity/asset-utils";
import "@sanity/image-url";
import "polished";
import "@sanity/client";
import "react-is";
import "exif-component";
import "lodash-es/pickBy.js";
import "swr";
import "lodash-es/castArray.js";
import "nanoid";
import "use-hot-module-reload";
import "lodash-es/memoize.js";
import "lodash-es/sortedIndex.js";
import "lodash-es/difference.js";
import "lodash-es/identity.js";
import "lodash-es/values.js";
import "@sanity/comlink";
import "@sanity/mutator";
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
function createDomRectFromElements(elements) {
  if (!elements || !elements.length) return null;
  const rects = elements.map((el) => el.getBoundingClientRect()), minX = Math.min(...rects.map((r) => r.x)) || 0, minY = Math.min(...rects.map((r) => r.y)) || 0, maxRight = Math.max(...rects.map((r) => r.right)) || 0, maxBottom = Math.max(...rects.map((r) => r.bottom)) || 0;
  return {
    x: minX,
    y: minY,
    width: maxRight - minX,
    height: maxBottom - minY,
    top: minY,
    right: maxRight,
    bottom: maxBottom,
    left: minX
  };
}
function useRectFromElements(props) {
  const $ = c(5), {
    scrollElement,
    disabled,
    selector
  } = props, [rect, setRect] = useState(null);
  let t0, t1;
  return $[0] !== disabled || $[1] !== scrollElement || $[2] !== selector ? (t0 = () => {
    if (disabled)
      return;
    const handleSetRect = () => {
      const elements = document?.querySelectorAll(selector);
      if (!elements)
        return;
      const nextRect = createDomRectFromElements(Array.from(elements));
      setRect(nextRect);
    };
    if (handleSetRect(), !!scrollElement)
      return scrollElement.addEventListener("wheel", handleSetRect), () => {
        scrollElement.removeEventListener("wheel", handleSetRect);
      };
  }, t1 = [scrollElement, disabled, selector], $[0] = disabled, $[1] = scrollElement, $[2] = selector, $[3] = t0, $[4] = t1) : (t0 = $[3], t1 = $[4]), useEffect(t0, t1), rect;
}
function useAuthoringReferenceElement(props) {
  const $ = c(6), {
    scrollElement,
    disabled,
    selector
  } = props;
  let t0;
  $[0] !== disabled || $[1] !== scrollElement || $[2] !== selector ? (t0 = {
    scrollElement,
    disabled,
    selector
  }, $[0] = disabled, $[1] = scrollElement, $[2] = selector, $[3] = t0) : t0 = $[3];
  const rect = useRectFromElements(t0);
  let t1;
  bb0: {
    if (!rect) {
      t1 = null;
      break bb0;
    }
    let t2;
    $[4] !== rect ? (t2 = {
      getBoundingClientRect: () => rect
    }, $[4] = rect, $[5] = t2) : t2 = $[5], t1 = t2;
  }
  return t1;
}
function getSelectionBoundingRect() {
  const selection = window.getSelection();
  let range = null;
  return selection && selection.rangeCount > 0 && (range = selection.getRangeAt(0)), range?.getBoundingClientRect() || null;
}
const MotionPopover = styled(motion.create(Popover)).withConfig({
  displayName: "MotionPopover",
  componentId: "sc-wmroq-0"
})`user-select:none;`, POPOVER_FALLBACK_PLACEMENTS$1 = ["bottom", "top"], VARIANTS = {
  hidden: {
    opacity: 0,
    y: -4
  },
  visible: {
    opacity: 1,
    y: 0
  }
};
function FloatingButtonPopover(props) {
  const $ = c(13), {
    disabled,
    onClick,
    onClickOutside,
    referenceElement
  } = props, buttonRef = useRef(null), {
    t
  } = useTranslation(commentsLocaleNamespace);
  let t0;
  $[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (t0 = () => [buttonRef.current], $[0] = t0) : t0 = $[0], useClickOutsideEvent(onClickOutside, t0);
  let t1;
  $[1] !== t ? (t1 = t("inline-add-comment-button.disabled-overlap-title"), $[1] = t, $[2] = t1) : t1 = $[2];
  const disabledText = t1;
  let t2;
  $[3] !== t ? (t2 = t("inline-add-comment-button.title"), $[3] = t, $[4] = t2) : t2 = $[4];
  const text = disabled ? disabledText : t2, t3 = disabled ? CommentDisabledIcon : AddCommentIcon;
  let t4;
  $[5] !== disabled || $[6] !== onClick || $[7] !== t3 || $[8] !== text ? (t4 = /* @__PURE__ */ jsx(Button, { "data-testid": "inline-comment-button", disabled, icon: t3, mode: "bleed", onClick, ref: buttonRef, text }), $[5] = disabled, $[6] = onClick, $[7] = t3, $[8] = text, $[9] = t4) : t4 = $[9];
  const content = t4;
  let t5;
  return $[10] !== content || $[11] !== referenceElement ? (t5 = /* @__PURE__ */ jsx(MotionPopover, { animate: "visible", content, contentEditable: !1, fallbackPlacements: POPOVER_FALLBACK_PLACEMENTS$1, initial: "hidden", open: !0, padding: 1, placement: "bottom", portal: !0, referenceElement, variants: VARIANTS }), $[10] = content, $[11] = referenceElement, $[12] = t5) : t5 = $[12], t5;
}
const POPOVER_FALLBACK_PLACEMENTS = ["bottom", "top"], RootStack = styled(Stack).withConfig({
  displayName: "RootStack",
  componentId: "sc-w2wgl6-0"
})`width:250px;`;
function InlineCommentInputPopover(props) {
  const $ = c(17), {
    currentUser,
    mentionOptions,
    onChange,
    onClickOutside,
    onDiscardConfirm,
    onSubmit,
    referenceElement,
    value
  } = props, commentInputRef = useRef(null), contentElementRef = useRef(null);
  let t0;
  $[0] !== onDiscardConfirm ? (t0 = () => {
    commentInputRef.current?.discardDialogController.close(), onDiscardConfirm();
  }, $[0] = onDiscardConfirm, $[1] = t0) : t0 = $[1];
  const handleDiscardConfirm = t0;
  let t1;
  $[2] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (t1 = () => {
    commentInputRef.current?.discardDialogController.close();
  }, $[2] = t1) : t1 = $[2];
  const handleDiscardCancel = t1;
  let t2;
  $[3] !== onClickOutside || $[4] !== value ? (t2 = () => {
    if (hasCommentMessageValue(value)) {
      commentInputRef.current?.discardDialogController.open();
      return;
    }
    onClickOutside();
  }, $[3] = onClickOutside, $[4] = value, $[5] = t2) : t2 = $[5];
  let t3;
  $[6] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (t3 = () => [contentElementRef.current], $[6] = t3) : t3 = $[6], useClickOutsideEvent(t2, t3);
  let t4;
  $[7] !== currentUser || $[8] !== handleDiscardConfirm || $[9] !== mentionOptions || $[10] !== onChange || $[11] !== onSubmit || $[12] !== value ? (t4 = /* @__PURE__ */ jsx(RootStack, { padding: 2, ref: contentElementRef, children: /* @__PURE__ */ jsx(CommentInput, { currentUser, focusLock: !0, focusOnMount: !0, mentionOptions, onChange, onDiscardCancel: handleDiscardCancel, onDiscardConfirm: handleDiscardConfirm, onSubmit, ref: commentInputRef, value }) }), $[7] = currentUser, $[8] = handleDiscardConfirm, $[9] = mentionOptions, $[10] = onChange, $[11] = onSubmit, $[12] = value, $[13] = t4) : t4 = $[13];
  const content = t4;
  let t5;
  return $[14] !== content || $[15] !== referenceElement ? (t5 = /* @__PURE__ */ jsx(Popover, { content, "data-ui": "InlineCommentInputPopover", fallbackPlacements: POPOVER_FALLBACK_PLACEMENTS, open: !0, placement: "bottom", portal: !0, referenceElement }), $[14] = content, $[15] = referenceElement, $[16] = t5) : t5 = $[16], t5;
}
const EMPTY_ARRAY = [], AI_ASSIST_TYPE = "sanity.assist.instruction.prompt";
function CommentsPortableTextInput(props) {
  const $ = c(5), {
    enabled,
    mode
  } = useCommentsEnabled(), fieldActions = useFieldActions(), isAiAssist = props.schemaType.name === AI_ASSIST_TYPE, isCommentsEnabledInField = !!fieldActions.__internal_comments;
  if (!enabled || isAiAssist || !isCommentsEnabledInField) {
    let t02;
    return $[0] !== props ? (t02 = props.renderDefault(props), $[0] = props, $[1] = t02) : t02 = $[1], t02;
  }
  let t0;
  return $[2] !== mode || $[3] !== props ? (t0 = /* @__PURE__ */ jsx(CommentsPortableTextInputInner, { ...props, mode }), $[2] = mode, $[3] = props, $[4] = t0) : t0 = $[4], t0;
}
const CommentsPortableTextInputInner = memo(function(props) {
  const $ = c(97), {
    mode
  } = props, currentUser = useCurrentUser(), portal = usePortal(), {
    comments,
    getComment,
    mentionOptions,
    onCommentsOpen,
    operation,
    setStatus,
    status
  } = useComments(), {
    error: addonDatasetError
  } = useAddonDataset(), {
    setSelectedPath,
    selectedPath
  } = useCommentsSelectedPath(), {
    scrollToComment,
    scrollToGroup
  } = useCommentsScroll(), {
    handleOpenDialog
  } = useCommentsUpsell(), [mousePressed, setMousePressed] = useState(!1), editorRef = useRef(null), [authoringDecorationElement, setAuthoringDecorationElement] = useState(null), [nextCommentValue, setNextCommentValue] = useState(null), [nextCommentSelection, setNextCommentSelection] = useState(null), [currentSelection, setCurrentSelection] = useState(null), [currentSelectionRect, setCurrenSelectionRect] = useState(null), [currentHoveredCommentId, setCurrentHoveredCommentId] = useState(null), [canSubmit, setCanSubmit] = useState(!1), [rootElement, setRootElement] = useState(null), [isFullScreen, setIsFullScreen] = useState(!1), [addedCommentsDecorations, setAddedCommentsDecorations] = useState(EMPTY_ARRAY);
  let t0;
  $[0] !== props.path ? (t0 = PathUtils.toString(props.path), $[0] = props.path, $[1] = t0) : t0 = $[1];
  const stringFieldPath = t0, [fragment, setFragment] = useState(null);
  let t1;
  $[2] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (t1 = () => editorRef.current ? PortableTextEditor.getFragment(editorRef.current) : EMPTY_ARRAY, $[2] = t1) : t1 = $[2];
  const getFragment = t1;
  let t2;
  $[3] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (t2 = () => {
    const rect = getSelectionBoundingRect();
    setCurrenSelectionRect(rect);
  }, $[3] = t2) : t2 = $[3];
  const handleSetCurrentSelectionRect = t2;
  let t3;
  $[4] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (t3 = () => {
    setCurrentSelection(null), setCurrenSelectionRect(null), setNextCommentSelection(null), setNextCommentValue(null), setCanSubmit(!1), setAuthoringDecorationElement(null), setFragment(null);
  }, $[4] = t3) : t3 = $[4];
  const resetStates = t3;
  let t4;
  $[5] !== currentSelection || $[6] !== handleOpenDialog || $[7] !== mode ? (t4 = () => {
    if (mode === "upsell") {
      handleOpenDialog("pte");
      return;
    }
    const currentFragment = getFragment() || null;
    setFragment(currentFragment), setNextCommentSelection(currentSelection);
  }, $[5] = currentSelection, $[6] = handleOpenDialog, $[7] = mode, $[8] = t4) : t4 = $[8];
  const handleSelectCurrentSelection = t4;
  let t5;
  $[9] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (t5 = () => {
    resetStates();
  }, $[9] = t5) : t5 = $[9];
  const handleCommentDiscardConfirm = t5;
  let t6;
  if ($[10] !== comments.data.open || $[11] !== stringFieldPath) {
    let t72;
    $[13] !== stringFieldPath ? (t72 = (comment) => comment.fieldPath === stringFieldPath, $[13] = stringFieldPath, $[14] = t72) : t72 = $[14], t6 = comments.data.open.filter(t72).filter(_temp).map(_temp2), $[10] = comments.data.open, $[11] = stringFieldPath, $[12] = t6;
  } else
    t6 = $[12];
  const textComments = t6;
  let t7;
  $[15] !== fragment || $[16] !== nextCommentSelection || $[17] !== onCommentsOpen || $[18] !== operation || $[19] !== scrollToGroup || $[20] !== setSelectedPath || $[21] !== setStatus || $[22] !== status || $[23] !== stringFieldPath ? (t7 = (nextValue) => {
    if (!nextCommentSelection || !editorRef.current)
      return;
    const editorValue = PortableTextEditor.getValue(editorRef.current);
    if (!editorValue)
      return;
    const textSelection = buildTextSelectionFromFragment({
      fragment: fragment || EMPTY_ARRAY,
      selection: nextCommentSelection,
      value: editorValue
    }), threadId = uuid();
    operation.create({
      type: "field",
      contentSnapshot: fragment,
      fieldPath: stringFieldPath,
      message: nextValue,
      parentCommentId: void 0,
      reactions: EMPTY_ARRAY,
      selection: textSelection,
      status: "open",
      threadId
    }), onCommentsOpen?.(), status === "resolved" && setStatus("open"), setSelectedPath({
      fieldPath: stringFieldPath,
      threadId,
      origin: "form"
    }), scrollToGroup(threadId), resetStates();
  }, $[15] = fragment, $[16] = nextCommentSelection, $[17] = onCommentsOpen, $[18] = operation, $[19] = scrollToGroup, $[20] = setSelectedPath, $[21] = setStatus, $[22] = status, $[23] = stringFieldPath, $[24] = t7) : t7 = $[24];
  const handleSubmit = t7;
  let t8;
  $[25] !== getComment || $[26] !== onCommentsOpen || $[27] !== scrollToComment || $[28] !== setSelectedPath ? (t8 = (commentId) => {
    const comment_0 = getComment(commentId);
    comment_0 && (setSelectedPath({
      fieldPath: comment_0.target.path?.field || "",
      threadId: comment_0.threadId,
      origin: "form"
    }), onCommentsOpen?.(), scrollToComment(comment_0._id));
  }, $[25] = getComment, $[26] = onCommentsOpen, $[27] = scrollToComment, $[28] = setSelectedPath, $[29] = t8) : t8 = $[29];
  const handleDecoratorClick = t8, blurred = useRef(!1);
  let t9;
  $[30] !== mousePressed ? (t9 = (selection) => {
    const isRangeSelected = selection?.anchor.offset !== selection?.focus.offset;
    if (!getFragment()?.every(isPortableTextTextBlock) || !isRangeSelected) {
      setCanSubmit(!1);
      return;
    }
    if (blurred.current) {
      blurred.current = !1;
      return;
    }
    mousePressed || handleSetCurrentSelectionRect(), setCurrentSelection(selection), setCanSubmit(!0);
  }, $[30] = mousePressed, $[31] = t9) : t9 = $[31];
  const debounceSelectionChange = useDebounceSelectionChange(t9);
  let t10;
  $[32] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (t10 = () => {
    startTransition(() => setMousePressed(!0));
  }, $[32] = t10) : t10 = $[32];
  const handleMouseDown = t10;
  let t11;
  $[33] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (t11 = () => {
    startTransition(() => setMousePressed(!1)), handleSetCurrentSelectionRect();
  }, $[33] = t11) : t11 = $[33];
  const handleMouseUp = t11;
  let t12;
  $[34] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (t12 = (details) => {
    const {
      rangeDecoration,
      newSelection
    } = details, commentId_0 = rangeDecoration.payload?.commentId;
    setAddedCommentsDecorations((prev) => prev.map((p) => p.payload?.commentId === commentId_0 ? {
      ...rangeDecoration,
      selection: newSelection,
      payload: {
        ...rangeDecoration.payload,
        dirty: !0
      }
    } : p));
  }, $[34] = t12) : t12 = $[34];
  const handleRangeDecorationMoved = t12;
  let t13;
  $[35] !== addedCommentsDecorations || $[36] !== getComment || $[37] !== operation ? (t13 = () => {
    const decoratorsToUpdate = addedCommentsDecorations.filter(_temp3);
    decoratorsToUpdate.length !== 0 && (decoratorsToUpdate.forEach((decorator_0) => {
      const commentId_1 = decorator_0.payload?.commentId, comment_1 = getComment(commentId_1 || "");
      if (!comment_1 || !editorRef.current)
        return;
      const editorValue_0 = PortableTextEditor.getValue(editorRef.current) || EMPTY_ARRAY, [updatedDecoration] = buildRangeDecorationSelectionsFromComments({
        comments: [comment_1],
        value: editorValue_0
      }), nextRange = updatedDecoration?.range ? [updatedDecoration.range] : EMPTY_ARRAY, nextValue_0 = updatedDecoration ? [...comment_1.target.path?.selection?.value.filter((r) => r._key !== nextRange[0]?._key).concat(nextRange).flat().sort(_temp4) || EMPTY_ARRAY] : EMPTY_ARRAY, nextComment = {
        target: {
          ...comment_1.target,
          path: {
            ...comment_1.target?.path,
            field: comment_1.target.path?.field || "",
            selection: {
              type: "text",
              value: nextValue_0
            }
          }
        }
      };
      !isEqual(comment_1.target, nextComment.target) && operation.update(comment_1._id, nextComment);
    }), setAddedCommentsDecorations((prev_0) => prev_0.map((p_0) => decoratorsToUpdate.find((d) => d.payload?.commentId === p_0.payload?.commentId)?.payload?.dirty ? {
      ...p_0,
      payload: {
        ...p_0.payload,
        dirty: !1
      }
    } : p_0).filter(_temp5)));
  }, $[35] = addedCommentsDecorations, $[36] = getComment, $[37] = operation, $[38] = t13) : t13 = $[38];
  const updateCommentRange = t13;
  let t14;
  $[39] !== currentHoveredCommentId || $[40] !== handleDecoratorClick || $[41] !== selectedPath?.threadId ? (t14 = (commentsToDecorate) => {
    if (!editorRef.current)
      return EMPTY_ARRAY;
    const editorValue_1 = PortableTextEditor.getValue(editorRef.current) || EMPTY_ARRAY;
    return buildCommentRangeDecorations({
      comments: commentsToDecorate,
      currentHoveredCommentId,
      onDecorationClick: handleDecoratorClick,
      onDecorationHoverEnd: setCurrentHoveredCommentId,
      onDecorationHoverStart: setCurrentHoveredCommentId,
      onDecorationMoved: handleRangeDecorationMoved,
      selectedThreadId: selectedPath?.threadId || null,
      value: editorValue_1
    });
  }, $[39] = currentHoveredCommentId, $[40] = handleDecoratorClick, $[41] = selectedPath?.threadId, $[42] = t14) : t14 = $[42];
  const handleBuildRangeDecorations = t14;
  let t15;
  $[43] !== debounceSelectionChange || $[44] !== updateCommentRange ? (t15 = (change) => {
    change.type === "mutation" && updateCommentRange(), change.type === "blur" && (blurred.current = !0), change.type === "selection" && debounceSelectionChange(change.selection);
  }, $[43] = debounceSelectionChange, $[44] = updateCommentRange, $[45] = t15) : t15 = $[45];
  const onEditorChange = t15;
  let t16;
  bb0: {
    if (!nextCommentSelection) {
      t16 = null;
      break bb0;
    }
    let t172;
    $[46] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (t172 = (t183) => {
      const {
        children
      } = t183;
      return /* @__PURE__ */ jsx(CommentInlineHighlightSpan, { isAuthoring: !0, ref: setAuthoringDecorationElement, children });
    }, $[46] = t172) : t172 = $[46];
    let t182;
    $[47] !== nextCommentSelection ? (t182 = {
      component: t172,
      selection: nextCommentSelection
    }, $[47] = nextCommentSelection, $[48] = t182) : t182 = $[48], t16 = t182;
  }
  const authoringDecoration = t16, t17 = props?.rangeDecorations || EMPTY_ARRAY;
  let t18;
  $[49] !== addedCommentsDecorations || $[50] !== authoringDecoration || $[51] !== t17 ? (t18 = [...t17, ...authoringDecoration ? [authoringDecoration] : EMPTY_ARRAY, ...addedCommentsDecorations], $[49] = addedCommentsDecorations, $[50] = authoringDecoration, $[51] = t17, $[52] = t18) : t18 = $[52];
  const rangeDecorations = t18, [currentSelectionIsOverlapping, setCurrentSelectionIsOverlapping] = useState(!1);
  let t19, t20;
  $[53] !== addedCommentsDecorations || $[54] !== currentSelection ? (t19 = () => {
    startTransition(() => setCurrentSelectionIsOverlapping(() => !currentSelection || addedCommentsDecorations.length === 0 ? !1 : addedCommentsDecorations.some((d_0) => {
      if (!editorRef.current)
        return !1;
      const testA = PortableTextEditor.isSelectionsOverlapping(editorRef.current, currentSelection, d_0.selection), testB = PortableTextEditor.isSelectionsOverlapping(editorRef.current, d_0.selection, currentSelection);
      return testA || testB;
    })));
  }, t20 = [addedCommentsDecorations, currentSelection], $[53] = addedCommentsDecorations, $[54] = currentSelection, $[55] = t19, $[56] = t20) : (t19 = $[55], t20 = $[56]), useEffect(t19, t20);
  const scrollElement = isFullScreen ? document.body : portal.elements?.documentScrollElement || document.body, boundaryElement = isFullScreen ? portal.elements?.documentScrollElement || document.body : rootElement, t21 = !nextCommentSelection || !authoringDecorationElement;
  let t22;
  $[57] !== scrollElement || $[58] !== t21 ? (t22 = {
    scrollElement,
    disabled: t21,
    selector: '[data-inline-comment-state="authoring"]'
  }, $[57] = scrollElement, $[58] = t21, $[59] = t22) : t22 = $[59];
  const popoverAuthoringReferenceElement = useAuthoringReferenceElement(t22);
  let t23;
  bb1: {
    if (!currentSelectionRect) {
      t23 = null;
      break bb1;
    }
    let t242;
    $[60] !== currentSelectionRect ? (t242 = {
      getBoundingClientRect: () => currentSelectionRect
    }, $[60] = currentSelectionRect, $[61] = t242) : t242 = $[61], t23 = t242;
  }
  const selectionReferenceElement = t23;
  let t24, t25;
  $[62] !== currentSelection || $[63] !== scrollElement ? (t24 = () => {
    if (currentSelection)
      return scrollElement?.addEventListener("wheel", handleSetCurrentSelectionRect), () => {
        scrollElement?.removeEventListener("wheel", handleSetCurrentSelectionRect);
      };
  }, t25 = [currentSelection, scrollElement, handleSetCurrentSelectionRect], $[62] = currentSelection, $[63] = scrollElement, $[64] = t24, $[65] = t25) : (t24 = $[64], t25 = $[65]), useEffect(t24, t25);
  let t26, t27;
  $[66] !== handleBuildRangeDecorations || $[67] !== textComments ? (t26 = () => {
    const nextDecorations = handleBuildRangeDecorations(textComments);
    startTransition(() => setAddedCommentsDecorations((current) => nextDecorations.map((nextDecoration_1) => {
      const prevDecoration = current.find((p_2) => p_2.payload?.commentId === nextDecoration_1.payload?.commentId);
      return prevDecoration?.payload?.dirty ? {
        ...nextDecoration_1,
        payload: {
          ...nextDecoration_1.payload,
          dirty: prevDecoration.payload.dirty
        }
      } : nextDecoration_1;
    })));
  }, t27 = [handleBuildRangeDecorations, textComments], $[66] = handleBuildRangeDecorations, $[67] = textComments, $[68] = t26, $[69] = t27) : (t26 = $[68], t27 = $[69]), useEffect(t26, t27);
  const showFloatingButton = !!(currentSelection && canSubmit && selectionReferenceElement && !mousePressed), showFloatingInput = !!(nextCommentSelection && popoverAuthoringReferenceElement);
  let t28;
  $[70] !== currentUser || $[71] !== handleSubmit || $[72] !== mentionOptions || $[73] !== nextCommentValue || $[74] !== popoverAuthoringReferenceElement || $[75] !== showFloatingInput ? (t28 = showFloatingInput && currentUser && /* @__PURE__ */ jsx(InlineCommentInputPopover, { currentUser, mentionOptions, onChange: setNextCommentValue, onClickOutside: resetStates, onDiscardConfirm: handleCommentDiscardConfirm, onSubmit: handleSubmit, referenceElement: popoverAuthoringReferenceElement, value: nextCommentValue }), $[70] = currentUser, $[71] = handleSubmit, $[72] = mentionOptions, $[73] = nextCommentValue, $[74] = popoverAuthoringReferenceElement, $[75] = showFloatingInput, $[76] = t28) : t28 = $[76];
  let t29;
  $[77] !== addonDatasetError || $[78] !== currentSelectionIsOverlapping || $[79] !== handleSelectCurrentSelection || $[80] !== selectionReferenceElement || $[81] !== showFloatingButton || $[82] !== showFloatingInput ? (t29 = showFloatingButton && !showFloatingInput && /* @__PURE__ */ jsx(FloatingButtonPopover, { disabled: currentSelectionIsOverlapping || !!addonDatasetError, onClick: handleSelectCurrentSelection, onClickOutside: resetStates, referenceElement: selectionReferenceElement }), $[77] = addonDatasetError, $[78] = currentSelectionIsOverlapping, $[79] = handleSelectCurrentSelection, $[80] = selectionReferenceElement, $[81] = showFloatingButton, $[82] = showFloatingInput, $[83] = t29) : t29 = $[83];
  let t30;
  $[84] !== t29 ? (t30 = /* @__PURE__ */ jsx(AnimatePresence, { children: t29 }), $[84] = t29, $[85] = t30) : t30 = $[85];
  let t31;
  $[86] !== boundaryElement || $[87] !== t28 || $[88] !== t30 ? (t31 = /* @__PURE__ */ jsxs(BoundaryElementProvider, { element: boundaryElement, children: [
    t28,
    t30
  ] }), $[86] = boundaryElement, $[87] = t28, $[88] = t30, $[89] = t31) : t31 = $[89];
  let t32;
  $[90] !== onEditorChange || $[91] !== props || $[92] !== rangeDecorations ? (t32 = /* @__PURE__ */ jsx(Stack, { ref: setRootElement, onMouseDown: handleMouseDown, onMouseUp: handleMouseUp, children: /* @__PURE__ */ jsx(RenderDefaultCommentsPortableTextInputInner, { ...props, onEditorChange, editorRef, rangeDecorations, onFullScreenChange: setIsFullScreen }) }), $[90] = onEditorChange, $[91] = props, $[92] = rangeDecorations, $[93] = t32) : t32 = $[93];
  let t33;
  return $[94] !== t31 || $[95] !== t32 ? (t33 = /* @__PURE__ */ jsxs(Fragment, { children: [
    t31,
    t32
  ] }), $[94] = t31, $[95] = t32, $[96] = t33) : t33 = $[96], t33;
});
function useDebounceSelectionChange(handleSelectionChange) {
  const $ = c(2);
  let t0;
  return $[0] !== handleSelectionChange ? (t0 = debounce(handleSelectionChange, 200), $[0] = handleSelectionChange, $[1] = t0) : t0 = $[1], t0;
}
function RenderDefaultCommentsPortableTextInputInner(props) {
  return props.renderDefault(props);
}
function _temp(c2) {
  return isTextSelectionComment(c2.parentComment);
}
function _temp2(c_0) {
  return c_0.parentComment;
}
function _temp3(decorator) {
  return decorator.payload?.dirty;
}
function _temp4(a, b) {
  return a._key.localeCompare(b._key);
}
function _temp5(p_1) {
  return p_1.selection !== null;
}
function isPortableTextInputProps(inputProps) {
  return isArrayOfBlocksSchemaType(inputProps.schemaType);
}
function CommentsInput(props) {
  const $ = c(4);
  if (isPortableTextInputProps(props)) {
    let t02;
    return $[0] !== props ? (t02 = /* @__PURE__ */ jsx(CommentsPortableTextInput, { ...props }), $[0] = props, $[1] = t02) : t02 = $[1], t02;
  }
  let t0;
  return $[2] !== props ? (t0 = props.renderDefault(props), $[2] = props, $[3] = t0) : t0 = $[3], t0;
}
export {
  CommentsInput
};
//# sourceMappingURL=index8.js.map
