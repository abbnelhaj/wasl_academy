"use client";

import { type DocumentHandle, useDocumentProjection } from "@sanity/sdk-react";

export function LessonOptionLabel({
  documentId,
  projectId,
  dataset,
}: DocumentHandle) {
  const { data } = useDocumentProjection({
    documentId,
    documentType: "lesson",
    projectId,
    dataset,
    projection: "{ title }",
  });

  return <>{(data as { title?: string })?.title || "بدون عنوان"}</>;
}

export function ModuleOptionLabel({
  documentId,
  projectId,
  dataset,
}: DocumentHandle) {
  const { data } = useDocumentProjection({
    documentId,
    documentType: "module",
    projectId,
    dataset,
    projection: "{ title }",
  });

  return <>{(data as { title?: string })?.title || "بدون عنوان"}</>;
}
