"use client";

import { useQuery } from "@sanity/sdk-react";
import { defineQuery } from "groq";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { dataset, projectId } from "@/sanity/env";

const COURSE_QUERY = defineQuery(
  `*[_type == "course" && _id match "*" + $baseId][0]{ title }`,
);

const MODULE_QUERY = defineQuery(`{
  "module": *[_type == "module" && _id match "*" + $baseId][0]{ title },
  "course": *[_type == "course" && $baseId in modules[]._ref][0]{ _id, title }
}`);

const LESSON_QUERY = defineQuery(`{
  "lesson": *[_type == "lesson" && _id match "*" + $baseId][0]{ title },
  "module": *[_type == "module" && $baseId in lessons[]._ref][0]{ _id, title },
  "course": *[_type == "course" && count(modules[@._ref in *[_type == "module" && $baseId in lessons[]._ref]._id]) > 0][0]{ _id, title }
}`);

const CATEGORY_QUERY = defineQuery(
  `*[_type == "category" && _id match "*" + $baseId][0]{ title }`,
);

const NULL_QUERY = defineQuery(`null`);

const SECTION_LABELS: Record<string, string> = {
  courses: "الكورسات",
  modules: "الوحدات",
  lessons: "الدروس",
  categories: "التصنيفات",
};

function AdminBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const documentType = segments[1];
  const documentId = segments[2];

  const baseId = documentId?.replace(/^drafts\./, "") || "";

  const query =
    documentId && documentType === "courses"
      ? COURSE_QUERY
      : documentId && documentType === "modules"
        ? MODULE_QUERY
        : documentId && documentType === "lessons"
          ? LESSON_QUERY
          : documentId && documentType === "categories"
            ? CATEGORY_QUERY
            : NULL_QUERY;

  const { data } = useQuery({
    query,
    params: { baseId },
    projectId,
    dataset,
  });

  if (segments.length <= 1) return null;

  const items: { href: string; label: string }[] = [
    { href: "/admin", label: "إدارة وصل" },
  ];

  if (documentType === "courses") {
    items.push({ href: "/admin/courses", label: SECTION_LABELS.courses });
    if (documentId) {
      const title = (data as { title?: string } | null)?.title || "...";
      items.push({ href: pathname, label: title });
    }
  } else if (documentType === "modules") {
    const result = data as {
      module?: { title?: string };
      course?: { _id?: string; title?: string };
    } | null;

    if (result?.course?._id) {
      items.push({ href: "/admin/courses", label: SECTION_LABELS.courses });
      items.push({
        href: `/admin/courses/${result.course._id}`,
        label: result.course.title || "...",
      });
    } else {
      items.push({ href: "/admin/modules", label: SECTION_LABELS.modules });
    }

    if (documentId) {
      items.push({ href: pathname, label: result?.module?.title || "..." });
    }
  } else if (documentType === "lessons") {
    const result = data as {
      lesson?: { title?: string };
      module?: { _id?: string; title?: string };
      course?: { _id?: string; title?: string };
    } | null;

    if (result?.course?._id) {
      items.push({ href: "/admin/courses", label: SECTION_LABELS.courses });
      items.push({
        href: `/admin/courses/${result.course._id}`,
        label: result.course.title || "...",
      });
    }

    if (result?.module?._id) {
      items.push({
        href: `/admin/modules/${result.module._id}`,
        label: result.module.title || "...",
      });
    } else if (!result?.course?._id) {
      items.push({ href: "/admin/lessons", label: SECTION_LABELS.lessons });
    }

    if (documentId) {
      items.push({ href: pathname, label: result?.lesson?.title || "..." });
    }
  } else if (documentType === "categories") {
    items.push({ href: "/admin/categories", label: SECTION_LABELS.categories });
    if (documentId) {
      const title = (data as { title?: string } | null)?.title || "...";
      items.push({ href: pathname, label: title });
    }
  } else {
    if (documentType && SECTION_LABELS[documentType]) {
      items.push({
        href: `/admin/${documentType}`,
        label: SECTION_LABELS[documentType],
      });
    }
  }

  return (
    <Breadcrumb aria-label="مسار لوحة إدارة وصل">
      <BreadcrumbList className="text-muted-foreground" dir="rtl">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <span
              key={`${item.href}-${item.label}`}
              className="flex items-center gap-2"
            >
              {index > 0 && (
                <BreadcrumbSeparator className="text-muted-foreground [&>svg]:rotate-180" />
              )}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="max-w-[180px] truncate text-foreground">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={item.href}
                    className="max-w-[120px] truncate hover:text-foreground"
                  >
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default AdminBreadcrumb;
