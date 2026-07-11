"use client";

import { useDocuments } from "@sanity/sdk-react";
import { Layers } from "lucide-react";
import { Suspense } from "react";
import { EmptyState } from "@/components/admin/shared";
import { Accordion } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseWithModules } from "./CourseWithModules";
import { ModuleItem } from "./ModuleItem";
import { OrphanModules } from "./OrphanModules";

interface ModuleListContentProps {
  projectId: string;
  dataset: string;
  onCreateModule: () => void;
  isCreating: boolean;
  searchQuery: string;
}

export function ModuleListContent({
  projectId,
  dataset,
  onCreateModule,
  isCreating,
  searchQuery,
}: ModuleListContentProps) {
  const normalizedSearch = searchQuery.trim();
  const hasSearch = normalizedSearch.length > 0;

  const { data: modules } = useDocuments({
    documentType: "module",
    projectId,
    dataset,
    search: normalizedSearch || undefined,
  });

  const { data: courses } = useDocuments({
    documentType: "course",
    projectId,
    dataset,
  });

  if (!modules || modules.length === 0) {
    return (
      <EmptyState
        icon={Layers}
        message={hasSearch ? "لا توجد وحدات مطابقة" : "لا توجد وحدات بعد"}
        description={
          hasSearch
            ? "جرّب كلمة بحث مختلفة أو راجع عنوان الوحدة ووصفها."
            : "ابدأ ببناء وحدة تجمع دروسًا مترابطة داخل كورس من كورسات وصل."
        }
        actionLabel={hasSearch ? undefined : "أنشئ أول وحدة"}
        onAction={hasSearch ? undefined : onCreateModule}
        isLoading={isCreating}
      />
    );
  }

  // If searching, show flat list
  if (hasSearch) {
    return (
      <div className="space-y-2" dir="rtl">
        {modules.map((doc) => (
          <Suspense
            key={doc.documentId}
            fallback={<Skeleton className="h-16 w-full" />}
          >
            <div className="pb-1">
              <ModuleItem {...doc} />
            </div>
          </Suspense>
        ))}
      </div>
    );
  }

  // Group by course when not searching
  return (
    <div className="space-y-4" dir="rtl">
      {courses && courses.length > 0 ? (
        <Accordion
          multiple
          defaultValue={courses.map((c) => c.documentId)}
          className="space-y-3"
        >
          {courses.map((course) => (
            <Suspense
              key={course.documentId}
              fallback={<Skeleton className="h-24 w-full" />}
            >
              <CourseWithModules {...course} />
            </Suspense>
          ))}
        </Accordion>
      ) : (
        <OrphanModules documents={modules} />
      )}
    </div>
  );
}
