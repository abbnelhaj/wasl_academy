"use client";

import type { DocumentHandle } from "@sanity/sdk-react";
import { useDocument, useEditDocument } from "@sanity/sdk-react";
import { Suspense } from "react";
import { DocumentActions } from "@/components/admin/documents/DocumentActions";
import { OpenInStudio } from "@/components/admin/documents/OpenInStudio";
import { ImageInput } from "@/components/admin/inputs/ImageInput";
import { ModuleAccordionInput } from "@/components/admin/inputs/ModuleAccordionInput";
import { NumberInput } from "@/components/admin/inputs/NumberInput";
import { ReferenceInput } from "@/components/admin/inputs/ReferenceInput";
import { SelectInput } from "@/components/admin/inputs/SelectInput";
import { SlugInput } from "@/components/admin/inputs/SlugInput";
import { SwitchInput } from "@/components/admin/inputs/SwitchInput";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { COURSE_ACCESS_OPTIONS, COURSE_LEVEL_OPTIONS } from "@/lib/constans";

interface CourseEditorProps {
  documentId: string;
  projectId: string;
  dataset: string;
}

function CourseEditorFallback() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-2/3" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-[400px] w-full" />
    </div>
  );
}

function CourseEditorContent({
  documentId,
  projectId,
  dataset,
}: CourseEditorProps) {
  const handle: DocumentHandle = {
    documentId,
    documentType: "course",
    projectId,
    dataset,
  };

  const { data: title } = useDocument<string>({ ...handle, path: "title" });
  const { data: description } = useDocument<string>({
    ...handle,
    path: "description",
  });
  const { data: subtitle } = useDocument<string>({
    ...handle,
    path: "subtitle",
  });
  const { data: accessType } = useDocument<string>({
    ...handle,
    path: "accessType",
  });
  const editTitle = useEditDocument<string>({ ...handle, path: "title" });
  const editDescription = useEditDocument<string>({
    ...handle,
    path: "description",
  });
  const editSubtitle = useEditDocument<string>({ ...handle, path: "subtitle" });
  const isPaidCourse = accessType === "paid";

  return (
    <div dir="rtl">
      <div className="mb-3 flex items-center justify-end">
        <OpenInStudio handle={handle} />
      </div>

      <div className="mb-6 rounded-md border bg-card p-6 shadow-sm">
        <Input
          value={title ?? ""}
          onChange={(e) => editTitle(e.currentTarget.value)}
          placeholder="كورس بدون عنوان"
          className="h-auto border-none bg-transparent py-1 text-2xl font-semibold text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
        />

        <Input
          value={subtitle ?? ""}
          onChange={(e) => editSubtitle(e.currentTarget.value)}
          placeholder="اكتب سطرًا تعريفيًا قصيرًا للكورس..."
          className="mt-2 h-auto border-none bg-transparent py-1 text-base text-primary shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
        />

        <Textarea
          value={description ?? ""}
          onChange={(e) => editDescription(e.currentTarget.value)}
          placeholder="اكتب وصفًا مختصرًا للكورس ومخرجاته..."
          className="mt-2 resize-none border-none bg-transparent text-muted-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
          rows={2}
        />

        <div className="mt-4 flex items-center justify-end border-t pt-4">
          <DocumentActions {...handle} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="rounded-md border bg-card p-6 shadow-sm">
          <ModuleAccordionInput
            documentId={documentId}
            documentType="course"
            projectId={projectId}
            dataset={dataset}
            path="modules"
            label="الوحدات"
          />
        </div>

        <div className="h-fit space-y-5 rounded-md border bg-card p-6 shadow-sm">
          <ImageInput {...handle} path="thumbnail" label="صورة الغلاف" />
          <ReferenceInput
            {...handle}
            path="category"
            label="التصنيف"
            referenceType="category"
            placeholder="اختر التصنيف"
          />
          <SelectInput
            {...handle}
            path="accessType"
            label="نوع الوصول"
            options={COURSE_ACCESS_OPTIONS}
          />
          {isPaidCourse ? (
            <>
              <NumberInput
                {...handle}
                path="price"
                label="سعر الكورس"
                min={0}
                step={1}
              />
              <SelectInput
                {...handle}
                path="currency"
                label="عملة السعر"
                options={[
                  { value: "SAR", label: "ريال سعودي" },
                  { value: "USD", label: "دولار أمريكي" },
                ]}
              />
            </>
          ) : null}
          <SelectInput
            {...handle}
            path="level"
            label="المستوى"
            options={COURSE_LEVEL_OPTIONS}
          />
          <SwitchInput
            {...handle}
            path="featured"
            label="مميز"
            description="إظهاره ضمن كورسات وصل المميزة"
          />
          <SlugInput
            {...handle}
            path="slug"
            label="رابط الكورس"
            sourceField="title"
          />
        </div>
      </div>
    </div>
  );
}

export function CourseEditor(props: CourseEditorProps) {
  return (
    <Suspense fallback={<CourseEditorFallback />}>
      <CourseEditorContent {...props} />
    </Suspense>
  );
}
