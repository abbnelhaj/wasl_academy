"use client";

import {
  createDocument,
  createDocumentHandle,
  type DocumentHandle,
  useApplyDocumentActions,
  useDocumentProjection,
  useDocuments,
} from "@sanity/sdk-react";
import { ChevronLeft, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState, useTransition } from "react";
import {
  DocumentListSkeleton,
  EmptyState,
  ListPageHeader,
  SearchInput,
} from "@/components/admin/shared";
import { Skeleton } from "@/components/ui/skeleton";

interface DocumentListProps {
  documentType: string;
  title: string;
  description?: string;
  basePath: string;
  projectId: string;
  dataset: string;
  showCreateButton?: boolean;
}

const DOCUMENT_COPY: Record<
  string,
  {
    emptyMessage: string;
    emptyDescription: string;
    firstAction: string;
    newAction: string;
    searchPlaceholder: string;
  }
> = {
  category: {
    emptyMessage: "لا توجد تصنيفات بعد",
    emptyDescription: "ابدأ بتنظيم كورسات وصل حسب المسارات والموضوعات.",
    firstAction: "أنشئ أول تصنيف",
    newAction: "تصنيف جديد",
    searchPlaceholder: "ابحث باسم التصنيف أو وصفه...",
  },
};

function getDocumentCopy(documentType: string) {
  return (
    DOCUMENT_COPY[documentType] ?? {
      emptyMessage: "لا يوجد محتوى بعد",
      emptyDescription: "ابدأ بإضافة عنصر جديد ضمن محتوى منصة وصل.",
      firstAction: "أنشئ أول عنصر",
      newAction: "عنصر جديد",
      searchPlaceholder: "ابحث في المحتوى...",
    }
  );
}

function DocumentListFallback() {
  return <DocumentListSkeleton />;
}

function DocumentItem({
  documentId,
  documentType,
  projectId,
  dataset,
  basePath,
}: DocumentHandle & { basePath: string }) {
  const { data } = useDocumentProjection({
    documentId,
    documentType,
    projectId,
    dataset,
    projection: "{ title, description }",
  });

  const title = (data as { title?: string })?.title || "بدون عنوان";
  const description = (data as { description?: string })?.description;

  return (
    <Link href={`${basePath}/${documentId}`} className="group block">
      <div className="cursor-pointer rounded-md border bg-card p-4 transition-colors hover:border-primary/35 hover:bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="truncate font-medium text-foreground">{title}</h3>
            {description && (
              <p className="line-clamp-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          <ChevronLeft className="h-5 w-5 shrink-0 text-muted-foreground transition-all group-hover:-translate-x-1 group-hover:text-foreground ltr:ml-4 rtl:mr-4" />
        </div>
      </div>
    </Link>
  );
}

function DocumentListContent({
  documentType,
  basePath,
  projectId,
  dataset,
  onCreateDocument,
  isCreating,
  searchQuery,
  showCreateButton,
}: Omit<DocumentListProps, "title" | "description" | "showCreateButton"> & {
  onCreateDocument: () => void;
  isCreating: boolean;
  searchQuery: string;
  showCreateButton: boolean;
}) {
  const normalizedSearch = searchQuery.trim();
  const hasSearch = normalizedSearch.length > 0;

  const { data: documents } = useDocuments({
    documentType,
    projectId,
    dataset,
    search: normalizedSearch || undefined,
  });
  const copy = getDocumentCopy(documentType);

  if (!documents || documents.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        message={hasSearch ? "لا توجد نتائج مطابقة" : copy.emptyMessage}
        description={
          hasSearch
            ? "جرّب كلمة بحث مختلفة أو راجع عنوان المحتوى ووصفه."
            : copy.emptyDescription
        }
        actionLabel={
          hasSearch || !showCreateButton ? undefined : copy.firstAction
        }
        onAction={hasSearch || !showCreateButton ? undefined : onCreateDocument}
        isLoading={isCreating}
      />
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <Suspense
          key={doc.documentId}
          fallback={<Skeleton className="h-16 w-full" />}
        >
          <DocumentItem {...doc} basePath={basePath} />
        </Suspense>
      ))}
    </div>
  );
}

export function DocumentList({
  documentType,
  title,
  description,
  basePath,
  projectId,
  dataset,
  showCreateButton = true,
}: DocumentListProps) {
  const router = useRouter();
  const [isCreating, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const apply = useApplyDocumentActions();
  const copy = getDocumentCopy(documentType);

  const handleCreateDocument = () => {
    startTransition(async () => {
      const newDocHandle = createDocumentHandle({
        documentId: crypto.randomUUID(),
        documentType,
      });

      await apply(createDocument(newDocHandle));
      router.push(`${basePath}/${newDocHandle.documentId}`);
    });
  };

  return (
    <div className="space-y-6" dir="rtl">
      <ListPageHeader
        title={title}
        description={description}
        actionLabel={showCreateButton ? copy.newAction : undefined}
        onAction={showCreateButton ? handleCreateDocument : undefined}
        isLoading={isCreating}
      />

      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder={copy.searchPlaceholder}
      />

      <Suspense fallback={<DocumentListFallback />}>
        <DocumentListContent
          documentType={documentType}
          basePath={basePath}
          projectId={projectId}
          dataset={dataset}
          onCreateDocument={handleCreateDocument}
          isCreating={isCreating}
          searchQuery={searchQuery}
          showCreateButton={showCreateButton}
        />
      </Suspense>
    </div>
  );
}
