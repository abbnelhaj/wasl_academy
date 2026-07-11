import { currentUser } from "@clerk/nextjs/server";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  LibraryBig,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CourseCard } from "@/components/courses";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { sanityFetch } from "@/sanity/lib/live";
import { DASHBOARD_COURSES_QUERY } from "@/sanity/lib/queries";

type Course = NonNullable<
  Awaited<ReturnType<typeof getCourses>>["data"]
>[number];

type CourseProgress = {
  completedLessons: number;
  isCompleted: boolean;
  totalLessons: number;
};

async function getCourses(userId: string) {
  return sanityFetch({
    query: DASHBOARD_COURSES_QUERY,
    params: { userId },
  });
}

function getCourseProgress(course: Course, userId: string): CourseProgress {
  const lessons =
    course.modules?.flatMap(
      (module) => module?.lessons?.filter(Boolean) ?? [],
    ) ?? [];
  const totalLessons = course.lessonCount ?? lessons.length;
  const completedLessons = lessons.filter((lesson) =>
    lesson.completedBy?.includes(userId),
  ).length;

  return {
    completedLessons,
    isCompleted: totalLessons > 0 && completedLessons === totalLessons,
    totalLessons,
  };
}

function getDashboardStats(
  courses: Course[],
  progressByCourseId: Map<string, CourseProgress>,
) {
  return courses.reduce(
    (stats, course) => {
      const progress = progressByCourseId.get(course._id);

      return {
        completedCourses:
          stats.completedCourses + (progress?.isCompleted ? 1 : 0),
        completedLessons:
          stats.completedLessons + (progress?.completedLessons ?? 0),
        inProgressCourses:
          stats.inProgressCourses + (progress?.isCompleted ? 0 : 1),
        startedCourses: stats.startedCourses + 1,
      };
    },
    {
      completedCourses: 0,
      completedLessons: 0,
      inProgressCourses: 0,
      startedCourses: 0,
    },
  );
}

export default async function MyCoursesPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const { data } = await getCourses(user.id);
  const courses = data ?? [];
  const progressByCourseId = new Map(
    courses.map((course) => [course._id, getCourseProgress(course, user.id)]),
  );
  const startedCourses = courses.filter(
    (course) => (progressByCourseId.get(course._id)?.completedLessons ?? 0) > 0,
  );
  const stats = getDashboardStats(startedCourses, progressByCourseId);

  return (
    <main className="min-h-screen bg-background px-6 pb-16 pt-32 text-foreground lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <section className="mb-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm font-medium text-primary shadow-sm">
            <BookOpen className="size-4" />
            <span>كورساتي</span>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_0.38fr] lg:items-end">
            <div>
              <h1 className="text-balance text-3xl font-bold leading-tight tracking-normal md:text-5xl">
                واصل تعلمك من المكان الذي توقفت عنده
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                تظهر هنا الكورسات التي بدأت فيها فقط. تقدمك مبني على الدروس التي
                أنهيتها داخل كل كورس، وليس على زر اكتمال للكورس كامل.
              </p>
            </div>

            <div className="rounded-md border bg-card p-5 shadow-sm">
              <p className="text-sm font-semibold text-foreground">
                حالة الوصول الحالية
              </p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                لا يوجد نظام اشتراكات أو tiers. كل كورس سيكون مجانيًا أو مدفوعًا
                بشكل منفرد حسب خطة Wasl Academy.
              </p>
            </div>
          </div>
        </section>

        <section
          aria-label="ملخص تقدمك"
          className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div className="rounded-md border bg-card p-5 shadow-sm">
            <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <LibraryBig className="size-5" />
            </div>
            <p className="text-2xl font-bold">{stats.startedCourses}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              كورسات بدأت فيها
            </p>
          </div>

          <div className="rounded-md border bg-card p-5 shadow-sm">
            <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <PlayCircle className="size-5" />
            </div>
            <p className="text-2xl font-bold">{stats.inProgressCourses}</p>
            <p className="mt-1 text-sm text-muted-foreground">قيد التعلم</p>
          </div>

          <div className="rounded-md border bg-card p-5 shadow-sm">
            <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <GraduationCap className="size-5" />
            </div>
            <p className="text-2xl font-bold">{stats.completedLessons}</p>
            <p className="mt-1 text-sm text-muted-foreground">دروس مكتملة</p>
          </div>

          <div className="rounded-md border bg-card p-5 shadow-sm">
            <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <CheckCircle2 className="size-5" />
            </div>
            <p className="text-2xl font-bold">{stats.completedCourses}</p>
            <p className="mt-1 text-sm text-muted-foreground">كورسات مكتملة</p>
          </div>
        </section>

        <section>
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">المسارات</p>
              <h2 className="mt-2 text-2xl font-bold">
                الكورسات التي بدأت فيها
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-muted-foreground">
              اضغط على أي كورس لعرض الوحدات والدروس. التقدم يتحدث من حالة اكتمال
              الدروس، وليس من زر اكتمال الكورس.
            </p>
          </div>

          {startedCourses.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {startedCourses.map((course) => {
                const progress = progressByCourseId.get(course._id);

                return (
                  <CourseCard
                    key={course._id}
                    accessType={course.accessType}
                    completedLessonCount={progress?.completedLessons ?? 0}
                    currency={course.currency}
                    description={course.description ?? course.subtitle}
                    featured={course.featured}
                    isCompleted={progress?.isCompleted ?? false}
                    lessonCount={
                      progress?.totalLessons ?? course.lessonCount ?? 0
                    }
                    level={course.level}
                    moduleCount={course.moduleCount}
                    price={course.price}
                    showProgress
                    slug={course.slug}
                    thumbnail={course.thumbnail}
                    title={course.title}
                  />
                );
              })}
            </div>
          ) : (
            <div className="rounded-md border bg-card px-6 py-14 text-center shadow-sm">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-md bg-primary/10 text-primary">
                <BookOpen className="size-6" />
              </div>
              <h3 className="text-xl font-bold">لم تبدأ أي كورس بعد</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
                ابدأ درسًا من الكتالوج وسيظهر الكورس هنا بعد حفظ أول درس مكتمل.
              </p>
              <Link
                className={cn(buttonVariants(), "mt-5 gap-2")}
                href="/dashboard"
              >
                تصفح الكورسات
                <ArrowLeft className="size-4" />
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
