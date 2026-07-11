"use client";

import { useQuery } from "@sanity/sdk-react";
import {
  BookOpen,
  ChevronLeft,
  Layers,
  LayoutDashboard,
  PlayCircle,
  ShoppingBag,
  Tag,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import { Suspense } from "react";
import { Logo } from "@/components/logo";
import { Skeleton } from "@/components/ui/skeleton";

const ADMIN_STATS_QUERY = defineQuery(`{
  "courseCount": count(*[_type == "course"]),
  "freeCourseCount": count(*[_type == "course" && accessType != "paid"]),
  "paidCourseCount": count(*[_type == "course" && accessType == "paid"]),
  "moduleCount": count(*[_type == "module"]),
  "lessonCount": count(*[_type == "lesson"]),
  "previewLessonCount": count(*[_type == "lesson" && isFreePreview == true]),
  "categoryCount": count(*[_type == "category"])
}`);

interface AdminDashboardProps {
  projectId: string;
  dataset: string;
}

type AdminStats = {
  courseCount: number;
  freeCourseCount: number;
  paidCourseCount: number;
  moduleCount: number;
  lessonCount: number;
  previewLessonCount: number;
  categoryCount: number;
};

const MANAGEMENT_LINKS = [
  {
    href: "/admin/courses",
    title: "الكورسات",
    description: "إدارة كورسات مجانية أو مدفوعة منفردة بدون اشتراكات.",
    icon: BookOpen,
    statKey: "courseCount",
  },
  {
    href: "/admin/modules",
    title: "الوحدات",
    description: "تنظيم الدروس داخل مسارات تعليمية قابلة للبيع منفردًا.",
    icon: Layers,
    statKey: "moduleCount",
  },
  {
    href: "/admin/lessons",
    title: "الدروس",
    description: "تحرير المحتوى والفيديو وتحديد دروس المعاينة المجانية.",
    icon: PlayCircle,
    statKey: "lessonCount",
  },
  {
    href: "/admin/categories",
    title: "التصنيفات",
    description: "تنظيم اكتشاف الكورسات حسب احتياج التاجر والمهارة.",
    icon: Tag,
    statKey: "categoryCount",
  },
] as const;

const PLATFORM_NOTES = [
  {
    title: "بيع منفرد",
    description: "الكورس إما مجاني أو مدفوع منفردًا، بدون tiers أو اشتراكات.",
    icon: ShoppingBag,
  },
  {
    title: "معاينات واضحة",
    description:
      "الدروس المجانية والمعاينات تفتح الآن، وباقي المدفوع ينتظر الدفع.",
    icon: PlayCircle,
  },
  {
    title: "الدفع لاحقًا",
    description:
      "السلة، المحفظة، T-Link والدفع عند الاستلام مؤجلة لمرحلة الدفع.",
    icon: WalletCards,
  },
] as const;

function AdminDashboardFallback() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 w-full" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {MANAGEMENT_LINKS.map((item) => (
          <Skeleton key={item.href} className="h-40 w-full" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {PLATFORM_NOTES.map((item) => (
          <Skeleton key={item.title} className="h-28 w-full" />
        ))}
      </div>
    </div>
  );
}

function AdminDashboardContent({ projectId, dataset }: AdminDashboardProps) {
  const { data } = useQuery<AdminStats>({
    query: ADMIN_STATS_QUERY,
    projectId,
    dataset,
  });

  const stats = data ?? {
    courseCount: 0,
    freeCourseCount: 0,
    paidCourseCount: 0,
    moduleCount: 0,
    lessonCount: 0,
    previewLessonCount: 0,
    categoryCount: 0,
  };

  return (
    <div className="space-y-6">
      <section className="rounded-md border bg-card p-6 text-card-foreground shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-[132px] items-center justify-center rounded-md border bg-primary-foreground px-3 shadow-sm">
              <Logo />
            </span>
            <div>
              <h1 className="text-2xl font-semibold tracking-normal text-foreground">
                لوحة إدارة وصل
              </h1>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                إدارة محتوى Wasl Academy للكورسات المجانية والمدفوعة منفردة.
              </p>
            </div>
          </div>
          <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
            <LayoutDashboard className="size-5" />
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {MANAGEMENT_LINKS.map((item) => {
          const Icon = item.icon;
          const count = stats[item.statKey];

          return (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-md border bg-card p-5 text-card-foreground shadow-sm transition-colors hover:border-primary/40 hover:bg-accent/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" />
                </div>
                <ChevronLeft className="mt-2 size-4 text-muted-foreground transition-transform group-hover:-translate-x-0.5 group-hover:text-primary" />
              </div>
              <div className="mt-5">
                <div className="text-3xl font-semibold text-foreground">
                  {count}
                </div>
                <h2 className="mt-2 text-base font-medium text-foreground">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-md border bg-card p-5 text-card-foreground shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">
            توزيع الكورسات
          </p>
          <div className="mt-4 flex items-center gap-3">
            <span className="rounded-md border bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
              {stats.freeCourseCount} مجاني
            </span>
            <span className="rounded-md border bg-muted px-3 py-2 text-sm font-semibold text-muted-foreground">
              {stats.paidCourseCount} مدفوع
            </span>
          </div>
        </div>

        <div className="rounded-md border bg-card p-5 text-card-foreground shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">
            دروس المعاينة
          </p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-foreground">
              {stats.previewLessonCount}
            </span>
            <span className="text-sm text-muted-foreground">
              درس مفتوح للمعاينة
            </span>
          </div>
        </div>

        <div className="rounded-md border bg-card p-5 text-card-foreground shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">
            قاعدة الوصول الحالية
          </p>
          <p className="mt-4 text-sm leading-7 text-foreground">
            الكورسات المجانية مفتوحة، والمدفوعة تعرض دروس المعاينة فقط إلى حين
            ربط الدفع.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {PLATFORM_NOTES.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-md border bg-card p-5 text-card-foreground shadow-sm"
            >
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

export function AdminDashboard(props: AdminDashboardProps) {
  return (
    <Suspense fallback={<AdminDashboardFallback />}>
      <AdminDashboardContent {...props} />
    </Suspense>
  );
}
