"use client";

import { CheckCircle2, Circle, Lock, PlayCircle } from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { normalizeCourseAccess } from "@/lib/constans";
import { cn } from "@/lib/utils";
import type { LESSON_BY_SLUG_QUERY_RESULT } from "@/sanity.types";

type Lesson = NonNullable<LESSON_BY_SLUG_QUERY_RESULT>;
type Course = NonNullable<Lesson["courses"][number]>;
type Module = NonNullable<NonNullable<Course["modules"]>[number]>;

interface LessonSidebarProps {
  course: Course;
  currentLessonId: string;
  completedLessonIds?: string[];
}

function canOpenLesson(
  course: Course,
  lesson: NonNullable<Module["lessons"]>[number],
) {
  const isPaidCourse = normalizeCourseAccess(course.accessType) === "paid";
  return !isPaidCourse || Boolean(lesson.isFreePreview);
}

export function LessonSidebar({
  completedLessonIds = [],
  course,
  currentLessonId,
}: LessonSidebarProps) {
  const modules = course.modules?.filter(Boolean) ?? [];

  if (modules.length === 0) {
    return null;
  }

  const currentModuleId = modules.find((module) =>
    module.lessons?.some((lesson) => lesson._id === currentLessonId),
  )?._id;

  return (
    <aside className="w-full shrink-0 lg:w-80">
      <div className="sticky top-28 overflow-hidden rounded-md border bg-card shadow-sm">
        <div className="border-b p-4">
          <Link
            className="text-sm font-medium text-primary hover:text-primary/80"
            href={
              course.slug?.current
                ? `/courses/${course.slug.current}`
                : "/dashboard/courses"
            }
          >
            العودة للكورس
          </Link>
          <h3 className="mt-2 line-clamp-2 font-bold text-foreground">
            {course.title ?? "الكورس"}
          </h3>
        </div>

        <div className="max-h-[62vh] overflow-y-auto">
          <Accordion
            className="w-full"
            defaultValue={currentModuleId ? [currentModuleId] : []}
            multiple
          >
            {modules.map((module, moduleIndex) => {
              const lessons = module.lessons?.filter(Boolean) ?? [];
              const completedCount = lessons.filter((lesson) =>
                completedLessonIds.includes(lesson._id),
              ).length;

              return (
                <AccordionItem
                  className="border-b last:border-b-0"
                  key={module._id}
                  value={module._id}
                >
                  <AccordionTrigger className="px-4 py-3 text-right hover:bg-muted/60 hover:no-underline">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm font-bold text-primary">
                        {moduleIndex + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-primary">
                          الوحدة {moduleIndex + 1}
                        </p>
                        <p className="mt-0.5 truncate text-sm font-bold text-foreground">
                          {module.title ?? "وحدة بدون عنوان"}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {completedCount}/{lessons.length} دروس مكتملة
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-4 pb-4 pt-1">
                    <div className="space-y-1 border-r pr-3">
                      {lessons.map((lesson) => {
                        const isActive = lesson._id === currentLessonId;
                        const isCompleted = completedLessonIds.includes(
                          lesson._id,
                        );
                        const isOpen = canOpenLesson(course, lesson);
                        const lessonHref = lesson.slug?.current
                          ? `/lessons/${lesson.slug.current}`
                          : null;
                        const canNavigate = Boolean(lessonHref && isOpen);
                        const itemClassName = cn(
                          "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          !canNavigate &&
                            !isActive &&
                            "cursor-not-allowed opacity-70 hover:bg-transparent hover:text-muted-foreground",
                        );
                        const itemContent = (
                          <>
                            {isCompleted ? (
                              <CheckCircle2 className="size-4 shrink-0" />
                            ) : isOpen ? (
                              <PlayCircle className="size-4 shrink-0" />
                            ) : (
                              <Lock className="size-4 shrink-0" />
                            )}
                            <span className="truncate">
                              {lesson.title ?? "درس بدون عنوان"}
                            </span>
                            {!isCompleted && !isActive && isOpen ? (
                              <Circle className="ms-auto size-3 shrink-0 opacity-40" />
                            ) : null}
                          </>
                        );

                        return canNavigate && lessonHref ? (
                          <Link
                            aria-current={isActive ? "page" : undefined}
                            className={itemClassName}
                            href={lessonHref}
                            key={lesson._id}
                          >
                            {itemContent}
                          </Link>
                        ) : (
                          <div
                            aria-current={isActive ? "page" : undefined}
                            aria-disabled={!isOpen}
                            className={itemClassName}
                            key={lesson._id}
                          >
                            {itemContent}
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </aside>
  );
}
