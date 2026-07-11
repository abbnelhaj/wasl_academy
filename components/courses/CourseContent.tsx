import { ModuleAccordion } from "@/components/ModuleAccordion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { normalizeCourseAccess } from "@/lib/constans";
import type { COURSE_WITH_MODULES_QUERY_RESULT } from "@/sanity.types";
import { CourseHero } from "./CourseHero";
import { GatedFallback } from "./GatedFallback";

type Course = NonNullable<COURSE_WITH_MODULES_QUERY_RESULT>;

type CourseContentProps = {
  course: Course;
  userId: string | null;
};

function getTotalLessons(course: Course) {
  if (course.lessonCount != null) {
    return course.lessonCount;
  }

  return (
    course.modules?.reduce(
      (total, module) => total + (module?.lessons?.filter(Boolean).length ?? 0),
      0,
    ) ?? 0
  );
}

function getPreviewLessons(course: Course) {
  return (
    course.modules?.reduce(
      (total, module) =>
        total +
        (module?.lessons?.filter((lesson) => lesson?.isFreePreview).length ??
          0),
      0,
    ) ?? 0
  );
}

function getCompletedLessons(course: Course, userId: string | null) {
  if (!userId) {
    return 0;
  }

  return (
    course.modules?.reduce(
      (total, module) =>
        total +
        (module?.lessons?.filter((lesson) =>
          lesson?.completedBy?.includes(userId),
        ).length ?? 0),
      0,
    ) ?? 0
  );
}

function CourseProgressSummary({
  completedLessons,
  totalLessons,
}: {
  completedLessons: number;
  totalLessons: number;
}) {
  const progressPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const isCompleted = totalLessons > 0 && completedLessons === totalLessons;

  return (
    <div className="mb-6 rounded-md border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-3">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-md bg-primary/10 text-base font-bold text-primary">
            {progressPercent}%
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-foreground">تقدمك في الكورس</p>
              {isCompleted ? (
                <Badge className="h-7 rounded-md bg-primary text-primary-foreground">
                  مكتمل
                </Badge>
              ) : null}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {completedLessons} من {totalLessons} دروس
            </p>
          </div>
        </div>

        <p className="max-w-md text-sm leading-7 text-muted-foreground">
          يتحدث التقدم عند إنهاء الدرس أو الضغط على زر “درسته” داخل صفحة الدرس.
        </p>
      </div>

      <Progress
        className="mt-4 h-2 bg-muted [&>div]:bg-primary"
        value={progressPercent}
      />
    </div>
  );
}

export function CourseContent({ course, userId }: CourseContentProps) {
  const isPaidCourse = normalizeCourseAccess(course.accessType) === "paid";
  const totalLessons = getTotalLessons(course);
  const previewLessons = getPreviewLessons(course);
  const completedLessons = getCompletedLessons(course, userId);
  const isCourseCompleted =
    totalLessons > 0 && completedLessons === totalLessons;

  return (
    <>
      <CourseHero course={course} />

      <section id="course-content" className="pb-16">
        <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_0.36fr]">
          <div>
            <p className="text-sm font-semibold text-primary">محتوى الكورس</p>
            <h2 className="mt-2 text-2xl font-bold text-foreground">
              الوحدات والدروس
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              هنا نعرض هيكل الكورس من Sanity. الكورسات المجانية مفتوحة، أما
              المدفوعة فنعرض دروس المعاينة فقط إلى أن نربط السلة والدفع.
            </p>
          </div>

          <div className="rounded-md border bg-card p-5 shadow-sm">
            <p className="text-sm font-semibold text-foreground">حالة الوصول</p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {isPaidCourse
                ? `${previewLessons} دروس معاينة متاحة الآن. بقية الدروس ستفتح بعد تفعيل الشراء.`
                : "هذا الكورس مجاني ويمكنك متابعة كل الدروس مباشرة."}
            </p>
            {isCourseCompleted ? (
              <Badge className="mt-4 h-7 rounded-md bg-primary text-primary-foreground">
                مكتمل
              </Badge>
            ) : null}
          </div>
        </div>

        {userId ? (
          <CourseProgressSummary
            completedLessons={completedLessons}
            totalLessons={totalLessons}
          />
        ) : null}

        {isPaidCourse ? (
          <div className="mb-6">
            <GatedFallback previewLessonCount={previewLessons} />
          </div>
        ) : null}

        <ModuleAccordion
          modules={course.modules}
          accessType={course.accessType}
          userId={userId}
        />
      </section>
    </>
  );
}
