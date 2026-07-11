"use client";

import {
  type DocumentHandle,
  deleteDocument,
  discardDocument,
  publishDocument,
  unpublishDocument,
  useApplyDocumentActions,
  useDocument,
  useQuery,
} from "@sanity/sdk-react";
import { Download, RotateCcw, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { defineQuery } from "next-sanity";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface DocumentActionsProps extends DocumentHandle {}

const PUBLISHED_DOCUMENT_QUERY = defineQuery(`*[_id == $id][0]{ _id }`);

function DocumentActionsFallback() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-8 w-20 rounded-md" />
      <Skeleton className="h-8 w-8 rounded-md" />
    </div>
  );
}

function DocumentActionsContent({
  documentId,
  documentType,
  projectId,
  dataset,
}: DocumentActionsProps) {
  const router = useRouter();
  const apply = useApplyDocumentActions();

  const baseId = documentId.replace("drafts.", "");

  // حالة المستند الحالية من Sanity بشكل مباشر.
  const { data: doc } = useDocument({
    documentId,
    documentType,
    projectId,
    dataset,
  });

  const { data: publishedDoc } = useQuery<{
    _id: string;
  } | null>({
    query: PUBLISHED_DOCUMENT_QUERY,
    params: { id: baseId },
    projectId,
    dataset,
    perspective: "published",
  });

  const isDraft = doc?._id.startsWith("drafts.");
  const hasPublishedVersion = !!publishedDoc;

  const getListUrl = () => {
    if (documentType === "category") return "/admin/categories";
    return `/admin/${documentType}s`;
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2" dir="rtl">
      {isDraft && (
        <span className="rounded-md border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          مسودة
        </span>
      )}

      {isDraft && hasPublishedVersion && (
        <button
          type="button"
          onClick={() => {
            const confirmed = window.confirm(
              "هل تريد تجاهل كل التعديلات والرجوع إلى النسخة المنشورة؟",
            );
            if (!confirmed) return;
            apply(
              discardDocument({
                documentId: baseId,
                documentType,
              }),
            );
          }}
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border bg-card px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" />
          تجاهل
        </button>
      )}

      {!isDraft && (
        <button
          type="button"
          onClick={() =>
            apply(
              unpublishDocument({
                documentId: baseId,
                documentType,
              }),
            )
          }
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border bg-card px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Download className="h-4 w-4" />
          إلغاء النشر
        </button>
      )}

      {isDraft && (
        <button
          type="button"
          onClick={() =>
            apply(
              publishDocument({
                documentId: baseId,
                documentType,
              }),
            )
          }
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          <Upload className="h-4 w-4" />
          نشر
        </button>
      )}

      <button
        type="button"
        onClick={async () => {
          const confirmed = window.confirm(
            "هل تريد حذف هذا المحتوى نهائيًا؟ لا يمكن التراجع عن هذه العملية.",
          );
          if (!confirmed) return;

          // المستندات المسودة فقط تُحذف بتجاهل المسودة، والمنشورة تُحذف كنسخة منشورة.
          if (isDraft && !hasPublishedVersion) {
            await apply(
              discardDocument({
                documentId: baseId,
                documentType,
              }),
            );
          } else {
            await apply(
              deleteDocument({
                documentId: baseId,
                documentType,
              }),
            );
          }
          router.push(getListUrl());
        }}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        title="حذف"
        aria-label="حذف المحتوى"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export function DocumentActions(props: DocumentActionsProps) {
  return (
    <Suspense fallback={<DocumentActionsFallback />}>
      <DocumentActionsContent {...props} />
    </Suspense>
  );
}
