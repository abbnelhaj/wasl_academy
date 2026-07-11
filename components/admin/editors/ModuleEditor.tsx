"use client";

import type { DocumentHandle } from "@sanity/sdk-react";
import { useDocument, useEditDocument } from "@sanity/sdk-react";
import { Suspense } from "react";
import { DocumentActions } from "@/components/admin/documents/DocumentActions";
import { OpenInStudio } from "@/components/admin/documents/OpenInStudio";
import { ReferenceArrayInput } from "@/components/admin/inputs/ReferenceArrayInput";
import { SlugInput } from "@/components/admin/inputs/SlugInput";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

interface ModuleEditorProps {
  documentId: string;
  projectId: string;
  dataset: string;
}

function ModuleEditorFallback() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-2/3" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-[300px] w-full" />
    </div>
  );
}

function ModuleEditorContent({
  documentId,
  projectId,
  dataset,
}: ModuleEditorProps) {
  const handle: DocumentHandle = {
    documentId,
    documentType: "module",
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
    <div dir="rtl">
      <div className="mb-3 flex items-center justify-end">
        <OpenInStudio handle={handle} />
      </div>

      <div className="mb-6 rounded-md border bg-card p-6 shadow-sm">
        <Input
          value={title ?? ""}
          onChange={(e) => editTitle(e.currentTarget.value)}
          placeholder="وحدة بدون عنوان"
          className="h-auto border-none bg-transparent py-1 text-2xl font-semibold text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
        />

        <Textarea
          value={description ?? ""}
          onChange={(e) => editDescription(e.currentTarget.value)}
          placeholder="اكتب وصفًا مختصرًا للوحدة وما تجمعه من دروس..."
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
            label="رابط الوحدة"
            sourceField="title"
            placeholder="module-slug"
          />
        </div>
      </div>

      <div className="rounded-md border bg-card p-6 shadow-sm">
        <ReferenceArrayInput
          documentId={documentId}
          documentType="module"
          projectId={projectId}
          dataset={dataset}
          path="lessons"
          label="الدروس"
          referenceType="lesson"
        />
      </div>
    </div>
  );
}

export function ModuleEditor(props: ModuleEditorProps) {
  return (
    <Suspense fallback={<ModuleEditorFallback />}>
      <ModuleEditorContent {...props} />
    </Suspense>
  );
}
