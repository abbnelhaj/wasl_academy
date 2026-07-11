"use client";

import { useDocuments } from "@sanity/sdk-react";
import { FileText, Link2, Video } from "lucide-react";
import { Suspense } from "react";
import { EmptyState } from "@/components/admin/shared";
import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseWithModulesAndLessons } from "./CourseWithModulesAndLessons";
import { LessonItem } from "./LessonItem";
import { OrphanLessons } from "./OrphanLessons";

interface LessonListContentProps {
  projectId: string;
  dataset: string;
  onCreateLesson: () => void;
  isCreating: boolean;
  searchQuery: string;
}

export function LessonListContent({
  projectId,
  dataset,
  onCreateLesson,
  isCreating,
  searchQuery,
}: LessonListContentProps) {
  const normalizedSearch = searchQuery.trim();
  const hasSearch = normalizedSearch.length > 0;

  const { data: lessons } = useDocuments({
    documentType: "lesson",
    projectId,
    dataset,
    search: normalizedSearch || undefined,
  });

  const { data: courses } = useDocuments({
    documentType: "course",
    projectId,
    dataset,
  });

  if (!lessons || lessons.length === 0) {
    return (
      <EmptyState
        icon={Video}
        message={hasSearch ? "لا توجد دروس مطابقة" : "لا توجد دروس بعد"}
        description={
          hasSearch
            ? "جرّب كلمة بحث مختلفة أو راجع عنوان الدرس ووصفه."
            : "ابدأ بإضافة درس واربطه لاحقًا بوحدة داخل أحد كورسات وصل."
        }
        actionLabel={hasSearch ? undefined : "أنشئ أول درس"}
        onAction={hasSearch ? undefined : onCreateLesson}
        isLoading={isCreating}
      />
    );
  }

  if (hasSearch) {
    return (
      <div className="space-y-1.5" dir="rtl">
        {lessons.map((doc) => (
          <Suspense
            key={doc.documentId}
            fallback={<Skeleton className="h-12 w-full bg-muted" />}
          >
            <div className="pb-1">
              <LessonItem {...doc} />
            </div>
          </Suspense>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex flex-wrap items-center gap-4 border-b pb-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Badge
            variant="secondary"
            className="border-primary/20 bg-primary/10 px-1.5 py-0 text-xs text-primary"
          >
            <Video className="h-3 w-3" />
          </Badge>
          فيديو
        </span>
        <span className="flex items-center gap-1.5">
          <Badge
            variant="secondary"
            className="border-border bg-muted px-1.5 py-0 text-xs text-muted-foreground"
          >
            <FileText className="h-3 w-3" />
          </Badge>
          محتوى
        </span>
        <span className="flex items-center gap-1.5">
          <Badge
            variant="secondary"
            className="border-border bg-accent px-1.5 py-0 text-xs text-accent-foreground"
          >
            <Link2 className="h-3 w-3" />
          </Badge>
          الرابط
        </span>
      </div>

      {courses && courses.length > 0 && (
        <Accordion
          multiple
          defaultValue={courses.map((c) => c.documentId)}
          className="space-y-3"
          dir="rtl"
        >
          {courses.map((course) => (
            <Suspense
              key={course.documentId}
              fallback={<Skeleton className="h-24 w-full bg-muted" />}
            >
              <CourseWithModulesAndLessons {...course} />
            </Suspense>
          ))}
        </Accordion>
      )}

      {(!courses || courses.length === 0) && (
        <OrphanLessons documents={lessons} />
      )}
    </div>
  );
}
