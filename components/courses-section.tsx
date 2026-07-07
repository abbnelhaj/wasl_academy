import {
  ArrowLeftIcon,
  MegaphoneIcon,
  PackageCheckIcon,
  StoreIcon,
} from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FEATURED_COURSES_QUERY_RESULT } from "@/sanity.types";

type CoursesSectionProps = {
  courses?: FeaturedCourse[] | null;
  isSignedIn?: boolean;
};

export type FeaturedCourse = FEATURED_COURSES_QUERY_RESULT[number];

const fallbackCourses = [
  {
    title: "أساسيات إطلاق المتجر",
    label: "مجاني",
    description:
      "ابدأ من اختيار المنتج وترتيب الصفحة الأولى وتجهيز أساسيات البيع.",
    icon: StoreIcon,
    lessons: "12 درس",
  },
  {
    title: "إعلانات المتاجر المربحة",
    label: "مدفوع",
    description:
      "تعلم كيف تقرأ الإعلان من زاوية تكلفة الطلب والربح لا من زاوية الوصول فقط.",
    icon: MegaphoneIcon,
    lessons: "18 درس",
  },
  {
    title: "تشغيل الطلبات والشحن",
    label: "مدفوع",
    description:
      "خطوات عملية لتقليل أخطاء التجهيز والشحن وتحسين تجربة العميل بعد الشراء.",
    icon: PackageCheckIcon,
    lessons: "10 دروس",
  },
];

function getCourseLabel(course: FeaturedCourse) {
  if (course.accessType !== "paid") {
    return "مجاني";
  }

  if (course.price && course.currency) {
    return `${course.price} ${course.currency}`;
  }

  return "مدفوع";
}

function getLessonLabel(course: FeaturedCourse) {
  const lessonCount = course.lessonCount ?? 0;
  const moduleCount = course.moduleCount ?? 0;

  if (lessonCount > 0) {
    return `${lessonCount} ${lessonCount === 1 ? "درس" : "دروس"}`;
  }

  return `${moduleCount} ${moduleCount === 1 ? "وحدة" : "وحدات"}`;
}

function isFeaturedCourse(course: (typeof fallbackCourses)[number] | FeaturedCourse) {
  return "_id" in course;
}

export function CoursesSection({
  courses,
  isSignedIn = false,
}: CoursesSectionProps) {
  const href = "/dashboard/courses";
  const ctaLabel = isSignedIn ? "اذهب إلى كورساتي" : "تسجيل ثم عرض الكورسات";
  const visibleCourses =
    courses && courses.length > 0 ? courses.slice(0, 3) : fallbackCourses;
  const icons = [StoreIcon, MegaphoneIcon, PackageCheckIcon];

  return (
    <section id="courses" className="border-y bg-card py-20 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold text-primary">
              مسارات مقترحة
            </p>
            <h2 className="text-balance text-3xl font-bold leading-tight tracking-normal text-foreground md:text-5xl">
              ابدأ بالكورس المناسب لمرحلة متجرك
            </h2>
          </div>

          <Link
            href={href}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 px-5",
            )}
          >
            {ctaLabel}
          </Link>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {visibleCourses.map((course, index) => {
            const isSanityCourse = isFeaturedCourse(course);
            const Icon = isSanityCourse
              ? icons[index % icons.length]
              : course.icon;
            const title = course.title || "كورس جديد";
            const label = isSanityCourse ? getCourseLabel(course) : course.label;
            const description = isSanityCourse
              ? course.description ||
                course.subtitle ||
                "مسار عملي من Wasl Academy لمساعدة التاجر على تطوير متجره خطوة بخطوة."
              : course.description;
            const lessons = isSanityCourse
              ? getLessonLabel(course)
              : course.lessons;

            return (
              <article
                className="rounded-md border bg-background p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-primary/45 hover:shadow-md"
                key={"_id" in course ? course._id : title}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex size-12 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <span className="rounded-md border bg-card px-3 py-1 text-sm font-medium text-primary">
                    {label}
                  </span>
                </div>

                <h3 className="mt-7 text-xl font-semibold text-foreground">
                  {title}
                </h3>
                <p className="mt-3 min-h-20 text-sm leading-7 text-muted-foreground">
                  {description}
                </p>

                <div className="mt-6 flex items-center justify-between border-t pt-5">
                  <span className="text-sm text-muted-foreground">
                    {lessons}
                  </span>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
                  >
                    تفاصيل المسار
                    <ArrowLeftIcon className="size-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
