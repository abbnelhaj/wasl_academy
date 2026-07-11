import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Layers,
  Tag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  COURSE_ACCESS_STYLES,
  COURSE_LEVEL_STYLES,
  getCourseAccessLabel,
  normalizeCourseAccess,
  normalizeCourseLevel,
} from "@/lib/constans";
import { cn } from "@/lib/utils";
import type { COURSE_WITH_MODULES_QUERY_RESULT } from "@/sanity.types";

type Course = NonNullable<COURSE_WITH_MODULES_QUERY_RESULT>;

type CourseHeroProps = {
  course: Course;
};

function formatDuration(totalMinutes: number) {
  if (totalMinutes <= 0) {
    return "مدة الدروس غير محددة";
  }

  if (totalMinutes < 60) {
    return `${totalMinutes} دقيقة`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return minutes > 0 ? `${hours} ساعة و ${minutes} دقيقة` : `${hours} ساعة`;
}

export function CourseHero({ course }: CourseHeroProps) {
  const accessType = normalizeCourseAccess(course.accessType);
  const level = normalizeCourseLevel(course.level);
  const accessStyles = COURSE_ACCESS_STYLES[accessType];
  const levelStyles = COURSE_LEVEL_STYLES[level];
  const accessLabel = getCourseAccessLabel({
    accessType: course.accessType,
    currency: course.currency,
    price: course.price,
  });
  const totalMinutes =
    course.modules?.reduce(
      (moduleTotal, module) =>
        moduleTotal +
        (module?.lessons?.reduce(
          (lessonTotal, lesson) => lessonTotal + (lesson?.durationMinutes ?? 0),
          0,
        ) ?? 0),
      0,
    ) ?? 0;

  return (
    <section className="pb-10 pt-32">
      <div className="mb-8">
        <Link
          href="/dashboard/courses"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowRight className="size-4" />
          العودة إلى كل الكورسات
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-stretch">
        <div className="flex flex-col justify-center">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex rounded-md border px-3 py-1 text-sm font-semibold",
                accessStyles.badge,
              )}
            >
              {accessLabel}
            </span>

            <span
              className={cn(
                "inline-flex rounded-md border px-3 py-1 text-sm font-semibold",
                levelStyles.badge,
              )}
            >
              {levelStyles.label}
            </span>

            {course.featured ? (
              <Badge
                variant="outline"
                className="h-7 rounded-md border-primary/20 bg-primary/5 px-3 text-primary"
              >
                <CheckCircle2 className="size-3.5" />
                مميز
              </Badge>
            ) : null}
          </div>

          <h1 className="text-balance text-3xl font-bold leading-tight tracking-normal text-foreground md:text-5xl">
            {course.title ?? "كورس جديد"}
          </h1>

          {(course.subtitle || course.description) && (
            <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
              {course.subtitle ?? course.description}
            </p>
          )}

          {course.description && course.subtitle ? (
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
              {course.description}
            </p>
          ) : null}

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-md border bg-card p-4 shadow-sm">
              <Layers className="mb-3 size-5 text-primary" />
              <p className="text-xl font-bold">{course.moduleCount ?? 0}</p>
              <p className="mt-1 text-sm text-muted-foreground">وحدات</p>
            </div>

            <div className="rounded-md border bg-card p-4 shadow-sm">
              <BookOpen className="mb-3 size-5 text-primary" />
              <p className="text-xl font-bold">{course.lessonCount ?? 0}</p>
              <p className="mt-1 text-sm text-muted-foreground">دروس</p>
            </div>

            <div className="rounded-md border bg-card p-4 shadow-sm">
              <Clock3 className="mb-3 size-5 text-primary" />
              <p className="text-xl font-bold">
                {formatDuration(totalMinutes)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">مدة تقريبية</p>
            </div>

            <div className="rounded-md border bg-card p-4 shadow-sm">
              <Tag className="mb-3 size-5 text-primary" />
              <p className="line-clamp-1 text-xl font-bold">
                {course.category?.title ?? "عام"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">التصنيف</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#course-content"
              className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}
            >
              عرض محتوى الكورس
            </Link>
            {accessType === "paid" ? (
              <span className="inline-flex h-11 items-center justify-center rounded-md border bg-card px-5 text-sm font-medium text-muted-foreground">
                الشراء والسلة سيتم تفعيلهما لاحقًا
              </span>
            ) : null}
          </div>
        </div>

        <div className="relative min-h-72 overflow-hidden rounded-md border bg-card shadow-sm lg:min-h-full">
          {course.thumbnail?.asset?.url ? (
            <Image
              src={course.thumbnail.asset.url}
              alt={course.title ?? "صورة الكورس"}
              fill
              priority
              className="object-cover"
            />
          ) : (
            <div className="flex h-full min-h-72 items-center justify-center bg-primary/10 text-primary">
              <BookOpen className="size-20" />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-background/85 p-5 backdrop-blur-sm">
            <p className="text-sm font-semibold text-foreground">
              {accessType === "paid"
                ? "كورس مدفوع ضمن خطة الدفع القادمة"
                : "كورس مجاني متاح للتعلم الآن"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              المحتوى منظم حسب وحدات ودروس من Sanity Studio.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
