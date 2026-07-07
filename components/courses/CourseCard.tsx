"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Layers, Lock, Play } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  COURSE_ACCESS_STYLES,
  COURSE_LEVEL_STYLES,
  COURSE_STATE_STYLES,
  getCourseAccessLabel,
  normalizeCourseAccess,
  normalizeCourseLevel,
} from "@/lib/constants";
import type { DASHBOARD_COURSES_QUERY_RESULT } from "@/sanity.types";

type SanityCourse = DASHBOARD_COURSES_QUERY_RESULT[number];

export interface CourseCardProps
  extends Pick<
    SanityCourse,
    | "accessType"
    | "currency"
    | "description"
    | "featured"
    | "lessonCount"
    | "level"
    | "moduleCount"
    | "price"
    | "slug"
    | "thumbnail"
    | "title"
  > {
  href?: string;
  completedLessonCount?: number | null;
  isCompleted?: boolean;
  isLocked?: boolean;
  showProgress?: boolean;
}

export function CourseCard({
  slug,
  href,
  title,
  description,
  accessType,
  featured = false,
  level,
  thumbnail,
  moduleCount,
  lessonCount,
  price,
  currency,
  completedLessonCount = 0,
  isCompleted = false,
  isLocked = false,
  showProgress = false,
}: CourseCardProps) {
  const displayAccess = normalizeCourseAccess(accessType);
  const displayLevel = normalizeCourseLevel(level);
  const accessStyles = COURSE_ACCESS_STYLES[displayAccess];
  const levelStyles = COURSE_LEVEL_STYLES[displayLevel];
  const accessLabel = getCourseAccessLabel({ accessType, currency, price });
  const totalLessons = lessonCount ?? 0;
  const completed = completedLessonCount ?? 0;
  const progressPercent =
    totalLessons > 0 ? (completed / totalLessons) * 100 : 0;

  const linkHref = href ?? `/courses/${slug?.current ?? ""}`;

  return (
    <Link href={linkHref} className="group block">
      <article className="relative overflow-hidden rounded-md border bg-card shadow-sm transition duration-200 hover:-translate-y-1 hover:border-primary/45 hover:shadow-md">
        <div className="relative flex h-40 items-center justify-center overflow-hidden border-b bg-primary/10">
          {thumbnail?.asset?.url ? (
            <Image
              src={thumbnail.asset.url}
              alt={title ?? "صورة الكورس"}
              fill
              className="object-cover"
            />
          ) : (
            <span className="flex size-14 items-center justify-center rounded-md border bg-card text-primary shadow-sm">
              <Play className="size-6" />
            </span>
          )}
          {thumbnail?.asset?.url ? (
            <div className="absolute inset-0 bg-background/10" />
          ) : null}

          {isCompleted ? (
            <div
              className={`absolute right-3 top-3 flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold ${COURSE_STATE_STYLES.completed.badge}`}
            >
              <CheckCircle2 className="size-3.5" />
              {COURSE_STATE_STYLES.completed.label}
            </div>
          ) : (
            <div
              className={`absolute right-3 top-3 rounded-md border px-2.5 py-1 text-xs font-semibold ${accessStyles.badge}`}
            >
              {accessLabel}
            </div>
          )}

          {featured ? (
            <div
              className={`absolute left-3 top-3 rounded-md border px-2.5 py-1 text-xs font-semibold ${COURSE_STATE_STYLES.featured.badge}`}
            >
              {COURSE_STATE_STYLES.featured.label}
            </div>
          ) : null}

          {isLocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/85 backdrop-blur-[2px]">
              <div className="flex flex-col items-center gap-2">
                <div className="flex size-12 items-center justify-center rounded-md border bg-card text-primary shadow-sm">
                  <Lock className="size-5" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {COURSE_STATE_STYLES.locked.label}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="mb-2 line-clamp-2 text-lg font-bold text-foreground transition-colors group-hover:text-primary">
            {title ?? "كورس جديد"}
          </h3>

          {description && (
            <p className="mb-4 line-clamp-2 text-sm leading-7 text-muted-foreground">
              {description}
            </p>
          )}

          <span
            className={`mb-4 inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold ${levelStyles.badge}`}
          >
            {levelStyles.label}
          </span>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Layers className="size-4 text-primary" />
              {moduleCount ?? 0} وحدات
            </span>
            <span className="flex items-center gap-1.5">
              <Play className="size-4 text-primary" />
              {lessonCount ?? 0} دروس
            </span>
          </div>

          {showProgress && totalLessons > 0 && (
            <div className="mt-4 border-t pt-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {completed}/{totalLessons} دروس
                </span>
                <span className="font-medium text-primary">
                  {Math.round(progressPercent)}%
                </span>
              </div>
              <Progress
                value={progressPercent}
                className="h-2 bg-muted [&>div]:bg-primary"
              />
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
