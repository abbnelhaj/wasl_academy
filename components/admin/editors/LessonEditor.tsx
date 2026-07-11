"use client";

import type { DocumentHandle } from "@sanity/sdk-react";
import { useDocument, useEditDocument } from "@sanity/sdk-react";
import { Suspense } from "react";
import { DocumentActions } from "@/components/admin/documents/DocumentActions";
import { OpenInStudio } from "@/components/admin/documents/OpenInStudio";
import { MuxVideoInput } from "@/components/admin/inputs/MuxVideoInput";
import { NumberInput } from "@/components/admin/inputs/NumberInput";
import { PortableTextInput } from "@/components/admin/inputs/PortableTextInput";
import { SlugInput } from "@/components/admin/inputs/SlugInput";
import { SwitchInput } from "@/components/admin/inputs/SwitchInput";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

interface LessonEditorProps {
  documentId: string;
  projectId: string;
  dataset: string;
}

function LessonEditorFallback() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-2/3" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-16 w-full" />
    </div>
  );
}

function LessonEditorContent({
  documentId,
  projectId,
  dataset,
}: LessonEditorProps) {
  const handle: DocumentHandle = {
    documentId,
    documentType: "lesson",
    projectId,
    dataset,
  };

  const { data: title } = useDocument<string>({ ...handle, path: "title" });
  const { data: shortDescription } = useDocument<string>({
    ...handle,
    path: "shortDescription",
  });

  const editTitle = useEditDocument<string>({ ...handle, path: "title" });
  const editShortDescription = useEditDocument<string>({
    ...handle,
    path: "shortDescription",
  });

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex flex-wrap items-center justify-end gap-3">
        <DocumentActions {...handle} />
        <div className="h-6 w-px bg-border" />
        <OpenInStudio handle={handle} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <div className="rounded-md border bg-card p-6 shadow-sm">
            <Input
              value={title ?? ""}
              onChange={(e) => editTitle(e.currentTarget.value)}
              placeholder="درس بدون عنوان"
              className="h-auto border-none bg-transparent py-1 text-2xl font-semibold text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
            />
            <Textarea
              value={shortDescription ?? ""}
              onChange={(e) => editShortDescription(e.currentTarget.value)}
              placeholder="اكتب وصفًا قصيرًا للدرس..."
              className="mt-3 resize-none border-none bg-transparent text-muted-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
              rows={3}
            />
          </div>

          <div className="space-y-5 rounded-md border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">
              الإعدادات
            </h3>
            <SlugInput
              {...handle}
              path="slug"
              label="رابط الدرس"
              sourceField="title"
            />
            <NumberInput
              {...handle}
              path="durationMinutes"
              label="مدة الدرس بالدقائق"
              min={0}
              step={1}
            />
            <SwitchInput
              {...handle}
              path="isFreePreview"
              label="معاينة مجانية"
              description="متاح كمعاينة داخل الكورس المدفوع"
            />
          </div>

          <div className="rounded-md border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">
              محتوى الدرس
            </h3>
            <PortableTextInput {...handle} path="content" label="المحتوى" />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-md border bg-card p-6 shadow-sm lg:sticky lg:top-6">
            <MuxVideoInput {...handle} path="video" label="فيديو الدرس" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function LessonEditor(props: LessonEditorProps) {
  return (
    <Suspense fallback={<LessonEditorFallback />}>
      <LessonEditorContent {...props} />
    </Suspense>
  );
}
