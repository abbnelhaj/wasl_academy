import type { DocumentHandle } from "@sanity/sdk-react";

const DEFAULT_LOCAL_STUDIO_URL = "http://localhost:3333";

function normalizeStudioUrl(url: string) {
  return url.trim().replace(/\/+$/, "");
}

const configuredStudioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL;

export const studioBaseUrl = normalizeStudioUrl(
  configuredStudioUrl || DEFAULT_LOCAL_STUDIO_URL,
);

export function getStudioDocumentUrl(handle: DocumentHandle) {
  const documentType = encodeURIComponent(handle.documentType);
  const documentId = encodeURIComponent(handle.documentId);

  return `${studioBaseUrl}/structure/${documentType};${documentId}`;
}
