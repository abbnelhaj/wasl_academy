"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { DASHBOARD_COURSES_QUERY_RESULT } from "@/sanity.types";
import { CourseCard } from "./CourseCard";

export type CourseListCourse = DASHBOARD_COURSES_QUERY_RESULT[number];

type CourseFilter = "all" | "free" | "paid";

type CourseListProps = {
  courses?: CourseListCourse[] | null;
  emptyMessage?: string;
  showFilters?: boolean;
  showSearch?: boolean;
};

const filters: Array<{
  value: CourseFilter;
  label: string;
}> = [
  { value: "all", label: "كل الكورسات" },
  { value: "free", label: "مجانية" },
  { value: "paid", label: "مدفوعة" },
];

function getSearchableCourseText(course: CourseListCourse) {
  return [
    course.title,
    course.subtitle,
    course.description,
    course.category?.title,
    course.accessType === "paid" ? "مدفوع paid" : "مجاني free",
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function CourseList({
  courses,
  emptyMessage = "لا توجد كورسات متاحة حاليًا.",
  showFilters = true,
  showSearch = true,
}: CourseListProps) {
  const [activeFilter, setActiveFilter] = useState<CourseFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const safeCourses = courses ?? [];

  const filteredCourses = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return safeCourses.filter((course) => {
      const matchesFilter =
        activeFilter === "all" || course.accessType === activeFilter;

      if (!matchesFilter) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return getSearchableCourseText(course).includes(normalizedSearch);
    });
  }, [activeFilter, safeCourses, searchQuery]);

  return (
    <div className="space-y-6">
      {(showFilters || showSearch) && (
        <div className="flex flex-col gap-4 rounded-md border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          {showFilters && (
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  type="button"
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={cn(
                    "h-9 rounded-md border px-3 text-sm font-medium transition-colors",
                    activeFilter === filter.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}

          {showSearch && (
            <label
              htmlFor="course-search"
              className="relative block w-full md:max-w-xs"
            >
              <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="course-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="ابحث عن كورس"
                className="h-10 pr-9"
              />
            </label>
          )}
        </div>
      )}

      {filteredCourses.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course._id}
              accessType={course.accessType}
              currency={course.currency}
              description={course.description ?? course.subtitle}
              featured={course.featured}
              lessonCount={course.lessonCount}
              level={course.level}
              moduleCount={course.moduleCount}
              price={course.price}
              slug={course.slug}
              thumbnail={course.thumbnail}
              title={course.title}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-md border bg-card px-6 py-14 text-center shadow-sm">
          <p className="font-medium text-foreground">{emptyMessage}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            جرّب تغيير الفلتر أو البحث بكلمة مختلفة.
          </p>
        </div>
      )}
    </div>
  );
}
