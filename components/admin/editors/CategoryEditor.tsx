"use client";

import type { DocumentHandle } from "@sanity/sdk-react";
import { useDocument, useEditDocument } from "@sanity/sdk-react";
import { Suspense } from "react";
import { DocumentActions } from "@/components/admin/documents/DocumentActions";
import { OpenInStudio } from "@/components/admin/documents/OpenInStudio";
import { SlugInput } from "@/components/admin/inputs/SlugInput";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

interface CategoryEditorProps {
  documentId: string;
  projectId: string;
  dataset: string;
}

function CategoryEditorFallback() {
  return (
    <div className="max-w-2xl space-y-6">
      <Skeleton className="h-12 w-2/3" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

function CategoryEditorContent({
  documentId,
  projectId,
  dataset,
}: CategoryEditorProps) {
  const handle: DocumentHandle = {
    documentId,
    documentType: "category",
    projectId,
    dataset,
  };

  const { data: title } = useDocument<string>({ ...handle, path: "title" });
  const { data: description } = useDocument<string>({
    ...handle,
    path: "description",
  });
  const editTitle = useEditDocument<string>({ ...handle, path: "title" });
  const editDescription = useEditDocument<string>({
    ...handle,
    path: "description",
  });

  return (
    <div className="max-w-2xl" dir="rtl">
      <div className="mb-3 flex items-center justify-end">
        <OpenInStudio handle={handle} />
      </div>

      <div className="rounded-md border bg-card p-6 shadow-sm">
        <Input
          value={title ?? ""}
          onChange={(e) => editTitle(e.currentTarget.value)}
          placeholder="تصنيف بدون عنوان"
          className="h-auto border-none bg-transparent py-1 text-2xl font-semibold text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
        />

        <Textarea
          value={description ?? ""}
          onChange={(e) => editDescription(e.currentTarget.value)}
          placeholder="اكتب وصفًا مختصرًا لتصنيف كورسات وصل..."
          className="mt-2 resize-none border-none bg-transparent text-muted-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
          rows={2}
        />

        <div className="mt-4 flex items-center justify-end border-t pt-4">
          <DocumentActions {...handle} />
        </div>

        <div className="mt-6 border-t pt-6">
          <SlugInput
            {...handle}
            path="slug"
            label="رابط التصنيف"
            sourceField="title"
            placeholder="category-slug"
          />
        </div>
      </div>
    </div>
  );
}

export function CategoryEditor(props: CategoryEditorProps) {
  return (
    <Suspense fallback={<CategoryEditorFallback />}>
      <CategoryEditorContent {...props} />
    </Suspense>
  );
}
