"use client";

import { useDocumentProjection } from "@sanity/sdk-react";
import { BookOpen, ChevronLeft, Layers } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { ModuleData, ModuleItemProps } from "./types";

export function ModuleItem({
  documentId,
  documentType,
  projectId,
  dataset,
  index,
}: ModuleItemProps) {
  const { data } = useDocumentProjection({
    documentId,
    documentType,
    projectId,
    dataset,
    projection: `{
      title,
      description,
      "lessonCount": count(lessons)
    }`,
  });

  const module = data as ModuleData | undefined;
  const lessonCount = module?.lessonCount ?? 0;

  return (
    <Link href={`/admin/modules/${documentId}`} className="block">
      <div className="group cursor-pointer rounded-md border bg-card p-4 transition-colors hover:border-primary/35 hover:bg-muted/50">
        <div
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          dir="rtl"
        >
          <div className="flex min-w-0 flex-1 items-start gap-3">
            {index !== undefined && (
              <span className="mt-1 w-6 shrink-0 text-center text-xs font-medium text-muted-foreground">
                {index + 1}.
              </span>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-center gap-2">
                <Layers className="h-4 w-4 shrink-0 text-primary" />
                <h3 className="truncate font-medium text-foreground">
                  {module?.title || "وحدة بدون عنوان"}
                </h3>
              </div>
              {module?.description && (
                <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                  {module.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center justify-end gap-3 sm:justify-start">
            <Badge
              variant="secondary"
              className="border-primary/20 bg-primary/10 text-primary"
            >
              <BookOpen className="h-3 w-3 me-1" />
              {lessonCount} درس
            </Badge>
            <ChevronLeft className="h-5 w-5 text-muted-foreground transition-all group-hover:-translate-x-1 group-hover:text-foreground" />
          </div>
        </div>
      </div>
    </Link>
  );
}
