"use client";

import type { DocumentHandle } from "@sanity/sdk-react";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { getStudioDocumentUrl } from "@/components/admin/lib/studio-url";

interface OpenInStudioProps {
  handle: DocumentHandle;
}

export function OpenInStudio({ handle }: OpenInStudioProps) {
  const studioUrl = getStudioDocumentUrl(handle);

  return (
    <Link
      href={studioUrl}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-8 items-center justify-center gap-2 rounded-md border bg-card px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      dir="rtl"
    >
      <ExternalLink className="h-4 w-4" />
      فتح في Sanity Studio
    </Link>
  );
}
