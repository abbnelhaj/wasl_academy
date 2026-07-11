"use client";

import { CheckCircle2, Clock3, Lock, PlayCircle, Video } from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { normalizeCourseAccess } from "@/lib/constans";
import { cn } from "@/lib/utils";
import type { COURSE_WITH_MODULES_QUERY_RESULT } from "@/sanity.types";

type Course = NonNullable<COURSE_WITH_MODULES_QUERY_RESULT>;
type Module = NonNullable<NonNullable<Course["modules"]>[number]>;
type Lesson = NonNullable<NonNullable<Module["lessons"]>[number]>;

type PortableTextBlock = {
  _type?: string | null;
  children?: Array<{
    text?: string | null;
  } | null> | null;
};

export interface ModuleAccordionProps {
  modules: Course["modules"];
  accessType?: Course["accessType"] | undefined;
  userId?: string | null;
}

function getLessonNotes(content: Lesson["content"]) {
  if (!content) {
    return [];
  }

  return content
    .map((block: PortableTextBlock) => {
      if (block?._type !== "block") {
        return null;
      }

      const text = block.children
        ?.map((child) => child?.text)
        .filter(Boolean)
        .join("");

      return text?.trim() || null;
    })
    .filter(Boolean);
}

function getLessonAccess({
  courseAccessType,
  lesson,
}: {
  courseAccessType: Course["accessType"];
  lesson: Lesson;
}) {
  const isPaidCourse = normalizeCourseAccess(courseAccessType) === "paid";

  if (!isPaidCourse) {
    return {
      isOpen: true,
      label: "متاح",
      icon: CheckCircle2,
      className: "border-primary/20 bg-primary/10 text-primary",
    };
  }

  if (lesson.isFreePreview) {
    return {
      isOpen: true,
      label: "معاينة مجانية",
      icon: PlayCircle,
      className: "border-primary/20 bg-primary/10 text-primary",
    };
  }

  return {
    isOpen: false,
    label: "يفتح بعد الشراء",
    icon: Lock,
    className: "border-border bg-muted text-muted-foreground",
  };
}

export function ModuleAccordion({
  modules,
  accessType,
  userId,
}: ModuleAccordionProps) {
  const safeModules = modules?.filter(Boolean) ?? [];

  if (safeModules.length === 0) {
    return (
      <div className="rounded-md border bg-card px-6 py-14 text-center shadow-sm">
        <p className="font-medium text-foreground">
          لا توجد وحدات لهذا الكورس حاليًا.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          أضف الموديولات والدروس من Sanity Studio.
        </p>
      </div>
    );
  }

  const courseAccessType = accessType ?? "free";

  return (
    <Accordion multiple className="space-y-4">
      {safeModules.map((module, moduleIndex) => {
        const lessons = module.lessons?.filter(Boolean) ?? [];

        return (
          <AccordionItem
            key={module._id}
            value={module._id}
            className="overflow-hidden rounded-md border bg-card shadow-sm data-[open]:border-primary/30"
          >
            <AccordionTrigger className="px-5 py-4 text-right hover:bg-muted/60 hover:no-underline">
              <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm font-bold text-primary">
                    {moduleIndex + 1}
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-primary">
                      الوحدة {moduleIndex + 1}
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-foreground">
                      {module.title ?? "وحدة بدون عنوان"}
                    </h3>
                    {module.description ? (
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        {module.description}
                      </p>
                    ) : null}
                  </div>
                </div>

                <span className="me-8 inline-flex h-8 w-fit items-center justify-center rounded-md border bg-background px-3 text-sm font-medium text-muted-foreground sm:me-0">
                  {lessons.length} دروس
                </span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="border-t px-5 pb-5 pt-0">
              {lessons.length > 0 ? (
                <div className="divide-y">
                  {lessons.map((lesson, lessonIndex) => {
                    const access = getLessonAccess({
                      courseAccessType,
                      lesson,
                    });
                    const isCompleted = Boolean(
                      userId && lesson.completedBy?.includes(userId),
                    );
                    const AccessIcon = isCompleted ? CheckCircle2 : access.icon;
                    const notes = access.isOpen
                      ? getLessonNotes(lesson.content)
                      : [];
                    const lessonHref = lesson.slug?.current
                      ? `/lessons/${lesson.slug.current}`
                      : null;
                    const canNavigate = Boolean(lessonHref && access.isOpen);
                    const lessonCard = (
                      <article
                        key={lesson._id}
                        className={cn(
                          "py-5 transition-colors",
                          canNavigate && "hover:bg-muted/30",
                          !access.isOpen && "opacity-75",
                        )}
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="flex gap-4">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                              {isCompleted ? (
                                <CheckCircle2 className="size-5" />
                              ) : access.isOpen ? (
                                <PlayCircle className="size-5" />
                              ) : (
                                <Lock className="size-5" />
                              )}
                            </span>

                            <div>
                              <p className="text-sm font-semibold text-primary">
                                الدرس {lessonIndex + 1}
                              </p>
                              <h4 className="mt-1 text-lg font-bold text-foreground">
                                {lesson.title ?? "درس بدون عنوان"}
                              </h4>
                              {lesson.shortDescription ? (
                                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                                  {lesson.shortDescription}
                                </p>
                              ) : null}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 md:justify-end">
                            <span
                              className={cn(
                                "inline-flex h-7 items-center gap-1.5 rounded-md border px-2.5 text-xs font-semibold",
                                isCompleted
                                  ? "border-primary/20 bg-primary/10 text-primary"
                                  : access.className,
                              )}
                            >
                              <AccessIcon className="size-3.5" />
                              {isCompleted ? "مكتمل" : access.label}
                            </span>

                            {lesson.durationMinutes ? (
                              <span className="inline-flex h-7 items-center gap-1.5 rounded-md border bg-background px-2.5 text-xs font-medium text-muted-foreground">
                                <Clock3 className="size-3.5" />
                                {lesson.durationMinutes} دقيقة
                              </span>
                            ) : null}

                            {lesson.video?.asset?.playbackId ? (
                              <span className="inline-flex h-7 items-center gap-1.5 rounded-md border bg-background px-2.5 text-xs font-medium text-muted-foreground">
                                <Video className="size-3.5" />
                                فيديو
                              </span>
                            ) : null}
                          </div>
                        </div>

                        {access.isOpen && notes.length > 0 ? (
                          <div className="mt-4 rounded-md border bg-background p-4">
                            {notes.map((note) => (
                              <p
                                className="text-sm leading-7 text-muted-foreground"
                                key={note}
                              >
                                {note}
                              </p>
                            ))}
                          </div>
                        ) : null}

                        {!access.isOpen ? (
                          <div className="mt-4 rounded-md border bg-muted/50 p-4 text-sm leading-7 text-muted-foreground">
                            هذا الدرس ضمن المحتوى المدفوع. سنفتحه بعد ربط السلة
                            وخيارات الدفع الخاصة بمنصتنا.
                          </div>
                        ) : null}
                      </article>
                    );

                    return canNavigate && lessonHref ? (
                      <Link
                        className="block"
                        href={lessonHref}
                        key={lesson._id}
                      >
                        {lessonCard}
                      </Link>
                    ) : (
                      <div aria-disabled={!access.isOpen} key={lesson._id}>
                        {lessonCard}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  لا توجد دروس داخل هذه الوحدة بعد.
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
