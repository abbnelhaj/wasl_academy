import { currentUser } from "@clerk/nextjs/server";
import {
  BookOpen,
  CircleDollarSign,
  GraduationCap,
  LibraryBig,
} from "lucide-react";
import { redirect } from "next/navigation";
import type { CourseListCourse } from "@/components/courses";
import { CourseList } from "@/components/courses";
import { sanityFetch } from "@/sanity/lib/live";
import { DASHBOARD_COURSES_QUERY } from "@/sanity/lib/queries";

function getFirstName(user: Awaited<ReturnType<typeof currentUser>>) {
  return user?.firstName ?? user?.username ?? "صديق وصل";
}

function getCourseStats(courses: CourseListCourse[]) {
  return {
    all: courses.length,
    free: courses.filter((course) => course.accessType !== "paid").length,
    paid: courses.filter((course) => course.accessType === "paid").length,
    lessons: courses.reduce(
      (total, course) => total + (course.lessonCount ?? 0),
      0,
    ),
  };
}

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const { data } = await sanityFetch({
    query: DASHBOARD_COURSES_QUERY,
  });

  const courses = data ?? [];
  const firstName = getFirstName(user);
  const stats = getCourseStats(courses);

  return (
    <main className="min-h-screen bg-background px-6 pb-16 pt-32 text-foreground lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <section className="mb-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm font-medium text-primary shadow-sm">
            <GraduationCap className="size-4" />
            <span>لوحة التعلم</span>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_0.38fr] lg:items-end">
            <div>
              <h1 className="text-balance text-3xl font-bold leading-tight tracking-normal md:text-5xl">
                أهلًا {firstName}، اختر المسار المناسب لمرحلة متجرك
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                هنا تجد كورسات Wasl Academy: المجانية للبدء بسرعة، والمدفوعة
                للخطوات الأعمق. نظام الشراء والسلة سيضاف لاحقًا حسب خطتنا بعد
                التتوريال.
              </p>
            </div>

            <div className="rounded-md border bg-card p-5 shadow-sm">
              <p className="text-sm font-semibold text-foreground">
                المرحلة الحالية
              </p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                نعرض الكورسات ونجهز منطق مجاني/مدفوع، بدون اشتراكات أو صفحة
                أسعار.
              </p>
            </div>
          </div>
        </section>

        <section
          aria-label="إحصائيات الكورسات"
          className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div className="rounded-md border bg-card p-5 shadow-sm">
            <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <LibraryBig className="size-5" />
            </div>
            <p className="text-2xl font-bold">{stats.all}</p>
            <p className="mt-1 text-sm text-muted-foreground">كل الكورسات</p>
          </div>

          <div className="rounded-md border bg-card p-5 shadow-sm">
            <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <BookOpen className="size-5" />
            </div>
            <p className="text-2xl font-bold">{stats.free}</p>
            <p className="mt-1 text-sm text-muted-foreground">كورسات مجانية</p>
          </div>

          <div className="rounded-md border bg-card p-5 shadow-sm">
            <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <CircleDollarSign className="size-5" />
            </div>
            <p className="text-2xl font-bold">{stats.paid}</p>
            <p className="mt-1 text-sm text-muted-foreground">كورسات مدفوعة</p>
          </div>

          <div className="rounded-md border bg-card p-5 shadow-sm">
            <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <GraduationCap className="size-5" />
            </div>
            <p className="text-2xl font-bold">{stats.lessons}</p>
            <p className="mt-1 text-sm text-muted-foreground">دروس عملية</p>
          </div>
        </section>

        <section>
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">المسارات</p>
              <h2 className="mt-2 text-2xl font-bold">كل كورسات الأكاديمية</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-muted-foreground">
              الفلاتر هنا مبنية على منطقنا: مجاني أو مدفوع، بدون باقات اشتراك.
            </p>
          </div>

          <CourseList
            courses={courses}
            emptyMessage="لا توجد كورسات متاحة حاليًا. أضف كورسات من Sanity Studio."
            showFilters
            showSearch
          />
        </section>
      </div>
    </main>
  );
}
