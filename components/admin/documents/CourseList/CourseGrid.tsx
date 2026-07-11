"use client";

import { useDocuments } from "@sanity/sdk-react";
import { BookOpen } from "lucide-react";
import { Suspense } from "react";
import { EmptyState } from "@/components/admin/shared";
import { DocumentCardSkeleton } from "@/components/admin/shared/DocumentSkeleton";
import { AdminCourseItem } from "./AdminCourseItem";

interface CourseGridProps {
  projectId: string;
  dataset: string;
  onCreateCourse: () => void;
  isCreating: boolean;
  searchQuery: string;
}

export function CourseGrid({
  projectId,
  dataset,
  onCreateCourse,
  isCreating,
  searchQuery,
}: CourseGridProps) {
  const normalizedSearch = searchQuery.trim();
  const hasSearch = normalizedSearch.length > 0;
  const { data: courses } = useDocuments({
    documentType: "course",
    projectId,
    dataset,
    search: normalizedSearch || undefined,
  });

  if (!courses || courses.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        message={hasSearch ? "لا توجد كورسات مطابقة" : "لا توجد كورسات بعد"}
        description={
          hasSearch
            ? "جرّب كلمة بحث مختلفة أو راجع عنوان الكورس ووصفه."
            : "ابدأ بإضافة كورس مجاني أو مدفوع منفردًا مع وحداته ودروسه."
        }
        actionLabel={hasSearch ? undefined : "أنشئ أول كورس"}
        onAction={hasSearch ? undefined : onCreateCourse}
        isLoading={isCreating}
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {courses.map((course) => (
        <Suspense key={course.documentId} fallback={<DocumentCardSkeleton />}>
          <AdminCourseItem {...course} />
        </Suspense>
      ))}
    </div>
  );
}
