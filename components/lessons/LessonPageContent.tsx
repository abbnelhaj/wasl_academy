"use client";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Lock,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { GatedFallback } from "@/components/courses/GatedFallback";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { toggleLessonCompletion } from "@/lib/actions/lessons";
import { normalizeCourseAccess } from "@/lib/constans";
import { cn } from "@/lib/utils";
import type { LESSON_BY_SLUG_QUERY_RESULT } from "@/sanity.types";
import { LessonCompleteButton } from "./LessonCompleteButton";
import { LessonContent } from "./LessonContent";
import { LessonSidebar } from "./LessonSidebar";
import { MuxVideoPlayer } from "./MuxVideoPlayer";

type Lesson = NonNullable<LESSON_BY_SLUG_QUERY_RESULT>;
type Course = NonNullable<Lesson["courses"][number]>;
type Module = NonNullable<NonNullable<Course["modules"]>[number]>;
type SidebarLesson = NonNullable<NonNullable<Module["lessons"]>[number]>;

interface LessonPageContentProps {
  lesson: Lesson;
  userId: string | null;
}

function getPrimaryCourse(lesson: Lesson) {
  return lesson.courses?.filter(Boolean)[0] ?? null;
}

function getCourseLessons(course: Course | null) {
  return (
    course?.modules?.flatMap(
      (module) => module?.lessons?.filter(Boolean) ?? [],
    ) ?? []
  );
}

function getLessonHref(lesson: Pick<SidebarLesson, "slug">) {
  return lesson.slug?.current ? `/lessons/${lesson.slug.current}` : null;
}

function getCourseHref(course: Course | null) {
  return course?.slug?.current
    ? `/courses/${course.slug.current}`
    : "/dashboard/courses";
}

function canOpenLesson(course: Course | null, lesson: Lesson | SidebarLesson) {
  const isPaidCourse = normalizeCourseAccess(course?.accessType) === "paid";
  return !isPaidCourse || Boolean(lesson.isFreePreview);
}

function getPreviewLessonCount(course: Course | null) {
  return getCourseLessons(course).filter((lesson) => lesson.isFreePreview)
    .length;
}

function getCompletedLessonIds(course: Course | null, userId: string | null) {
  if (!userId) {
    return [];
  }

  return getCourseLessons(course)
    .filter((lesson) => lesson.completedBy?.includes(userId))
    .map((lesson) => lesson._id);
}

function LessonVideo({
  isLocked,
  onEnded,
  playbackId,
  title,
}: {
  isLocked: boolean;
  onEnded?: () => void;
  playbackId?: string | null;
  title?: string | null;
}) {
  if (isLocked) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-md border bg-card shadow-sm">
        <div className="px-6 text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Lock className="size-8" />
          </span>
          <h2 className="mt-5 text-xl font-bold text-foreground">
            هذا الدرس ضمن المحتوى المدفوع
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
            الدروس المدفوعة ستفتح بعد ربط السلة وخيارات الدفع الخاصة بمنصة وصل.
          </p>
        </div>
      </div>
    );
  }

  if (!playbackId) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-md border bg-card shadow-sm">
        <div className="px-6 text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-md bg-primary/10 text-primary">
            <PlayCircle className="size-8" />
          </span>
          <h2 className="mt-5 text-xl font-bold text-foreground">
            لم يتم رفع فيديو لهذا الدرس بعد
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
            أضف الفيديو من Sanity Studio وسيظهر هنا.
          </p>
        </div>
      </div>
    );
  }

  return (
    <MuxVideoPlayer
      onEnded={onEnded}
      playbackId={playbackId}
      title={title ?? undefined}
    />
  );
}

export function LessonPageContent({ lesson, userId }: LessonPageContentProps) {
  const course = getPrimaryCourse(lesson);
  const isOpen = canOpenLesson(course, lesson);
  const [isLessonCompleted, setIsLessonCompleted] = useState(
    Boolean(userId && lesson.completedBy?.includes(userId)),
  );
  const [autoCompleteError, setAutoCompleteError] = useState<string | null>(
    null,
  );
  const [isAutoCompleting, startAutoComplete] = useTransition();
  const courseLessons = getCourseLessons(course);
  const currentIndex = courseLessons.findIndex(
    (item) => item._id === lesson._id,
  );
  const previousLesson =
    currentIndex > 0 ? courseLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < courseLessons.length - 1
      ? courseLessons[currentIndex + 1]
      : null;
  const previousLessonHref = previousLesson
    ? getLessonHref(previousLesson)
    : null;
  const nextLessonHref = nextLesson ? getLessonHref(nextLesson) : null;
  const canOpenPreviousLesson = previousLesson
    ? canOpenLesson(course, previousLesson)
    : false;
  const canOpenNextLesson = nextLesson
    ? canOpenLesson(course, nextLesson)
    : false;
  const completedLessonIds = getCompletedLessonIds(course, userId);
  const visibleCompletedLessonIds = isLessonCompleted
    ? Array.from(new Set([...completedLessonIds, lesson._id]))
    : completedLessonIds.filter((completedId) => completedId !== lesson._id);
  const isPaidCourse = normalizeCourseAccess(course?.accessType) === "paid";
  const accessLabel = isOpen
    ? lesson.isFreePreview && isPaidCourse
      ? "معاينة مجانية"
      : "متاح"
    : "يفتح بعد الشراء";
  const lessonSlug = lesson.slug?.current ?? lesson._id;
  const courseSlug = course?.slug?.current;

  const handleVideoEnded = () => {
    if (!userId || !isOpen || isLessonCompleted || isAutoCompleting) {
      return;
    }

    setAutoCompleteError(null);

    startAutoComplete(async () => {
      const result = await toggleLessonCompletion(
        lesson._id,
        lessonSlug,
        true,
        courseSlug,
      );

      if (result.success) {
        setIsLessonCompleted(true);
        return;
      }

      setAutoCompleteError(
        result.error ?? "تعذر حفظ اكتمال الدرس تلقائياً. جرّب الزر اليدوي.",
      );
    });
  };

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {course ? (
        <LessonSidebar
          completedLessonIds={visibleCompletedLessonIds}
          course={course}
          currentLessonId={lesson._id}
        />
      ) : null}

      <main className="min-w-0 flex-1 space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            className={cn(
              "h-7 rounded-md px-3 text-xs font-semibold",
              isOpen
                ? "border-primary/20 bg-primary/10 text-primary"
                : "border-border bg-muted text-muted-foreground",
            )}
            variant="outline"
          >
            {isOpen ? (
              <CheckCircle2 className="size-3.5" />
            ) : (
              <Lock className="size-3.5" />
            )}
            {accessLabel}
          </Badge>

          {lesson.durationMinutes ? (
            <Badge className="h-7 rounded-md px-3" variant="outline">
              <Clock3 className="size-3.5" />
              {lesson.durationMinutes} دقيقة
            </Badge>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-balance text-3xl font-bold leading-tight text-foreground md:text-5xl">
              {lesson.title ?? "درس بدون عنوان"}
            </h1>
            {lesson.shortDescription ? (
              <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">
                {lesson.shortDescription}
              </p>
            ) : null}
          </div>

          {userId && isOpen ? (
            <LessonCompleteButton
              courseSlug={courseSlug}
              isCompleted={isLessonCompleted}
              lessonId={lesson._id}
              lessonSlug={lessonSlug}
              onCompletedChange={setIsLessonCompleted}
            />
          ) : null}
        </div>

        <LessonVideo
          isLocked={!isOpen}
          onEnded={handleVideoEnded}
          playbackId={lesson.video?.asset?.playbackId}
          title={lesson.title}
        />
        {isAutoCompleting ? (
          <p className="text-sm text-muted-foreground">
            نحفظ اكتمال الدرس الآن...
          </p>
        ) : autoCompleteError ? (
          <p className="text-sm text-destructive">{autoCompleteError}</p>
        ) : null}

        {!isOpen ? (
          <GatedFallback previewLessonCount={getPreviewLessonCount(course)} />
        ) : (
          <section className="rounded-md border bg-card p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center gap-2">
              <BookOpen className="size-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">
                ملاحظات الدرس
              </h2>
            </div>
            <LessonContent content={lesson.content} />
          </section>
        )}

        <div className="grid gap-3 border-t pt-6 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <div className="flex sm:justify-start">
            {previousLessonHref && canOpenPreviousLesson ? (
              <Link
                className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
                href={previousLessonHref}
              >
                <ArrowRight className="size-4" />
                الدرس السابق
              </Link>
            ) : previousLesson ? (
              <span
                aria-disabled
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "cursor-not-allowed gap-2 opacity-65",
                )}
              >
                <Lock className="size-4" />
                الدرس السابق مقفل
              </span>
            ) : null}
          </div>

          <div className="flex sm:justify-center">
            <Link
              className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
              href={getCourseHref(course)}
            >
              العودة للكورس
              <ArrowLeft className="size-4" />
            </Link>
          </div>

          <div className="flex sm:justify-end">
            {nextLessonHref && canOpenNextLesson ? (
              <Link
                className={cn(buttonVariants(), "gap-2")}
                href={nextLessonHref}
              >
                الدرس التالي
                <ArrowLeft className="size-4" />
              </Link>
            ) : nextLesson ? (
              <span
                aria-disabled
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "cursor-not-allowed gap-2 opacity-65",
                )}
              >
                الدرس التالي مقفل
                <Lock className="size-4" />
              </span>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
