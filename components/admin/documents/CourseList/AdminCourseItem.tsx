"use client";

import { type DocumentHandle, useDocumentProjection } from "@sanity/sdk-react";
import { CourseCard } from "@/components/courses";
import type { CourseData } from "./types";

export function AdminCourseItem({
  documentId,
  documentType,
  projectId,
  dataset,
}: DocumentHandle) {
  const { data } = useDocumentProjection({
    documentId,
    documentType,
    projectId,
    dataset,
    projection: `{
      title,
      description,
      accessType,
      price,
      currency,
      featured,
      level,
      "thumbnail": thumbnail.asset->{ url },
      "moduleCount": count(modules),
      "lessonCount": count(modules[]->lessons[])
    }`,
  });

  const course = data as CourseData | undefined;

  return (
    <CourseCard
      href={`/admin/courses/${documentId}`}
      slug={null}
      accessType={course?.accessType ?? null}
      currency={course?.currency ?? null}
      title={course?.title ?? null}
      description={course?.description ?? null}
      featured={course?.featured ?? null}
      level={course?.level ?? null}
      price={course?.price ?? null}
      thumbnail={
        course?.thumbnail?.url
          ? { asset: { _id: "", url: course.thumbnail.url } }
          : null
      }
      moduleCount={course?.moduleCount ?? null}
      lessonCount={course?.lessonCount ?? null}
    />
  );
}
