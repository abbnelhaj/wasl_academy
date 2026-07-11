"use client";

import { type DocumentHandle, useDocumentProjection } from "@sanity/sdk-react";
import { getUntitledDocumentLabel } from "./types";

export function AvailableDocumentOption({
  documentId,
  documentType,
  projectId,
  dataset,
}: DocumentHandle) {
  const { data } = useDocumentProjection({
    documentId,
    documentType,
    projectId,
    dataset,
    projection: "{ title }",
  });

  return (
    <>
      {(data as { title?: string })?.title ||
        getUntitledDocumentLabel(documentType)}
    </>
  );
}
