"use client";

import { useDocumentProjection } from "@sanity/sdk-react";
import { ChevronLeft, FileText, Link2, Play, Video } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { LessonData, LessonItemProps } from "./types";

export function LessonItem({
  documentId,
  documentType,
  projectId,
  dataset,
  index,
}: LessonItemProps) {
  const { data } = useDocumentProjection({
    documentId,
    documentType,
    projectId,
    dataset,
    projection: `{
      title,
      shortDescription,
      slug,
      "hasVideo": defined(video.asset),
      "hasContent": length(content) > 0
    }`,
  });

  const lesson = data as LessonData | undefined;
  const hasSlug = !!lesson?.slug?.current;
  const hasVideo = lesson?.hasVideo ?? false;
  const hasContent = lesson?.hasContent ?? false;

  return (
    <Link href={`/admin/lessons/${documentId}`} className="block">
      <div className="group cursor-pointer rounded-md border bg-card p-3 transition-colors hover:border-primary/35 hover:bg-muted/50">
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
                <Play className="h-3.5 w-3.5 shrink-0 text-primary" />
                <h4 className="truncate text-sm font-medium text-foreground">
                  {lesson?.title || "درس بدون عنوان"}
                </h4>
              </div>
              {lesson?.shortDescription && (
                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                  {lesson.shortDescription}
                </p>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center justify-end gap-2 sm:justify-start">
            {hasVideo && (
              <Badge
                variant="secondary"
                className="border-primary/20 bg-primary/10 px-1.5 py-0 text-xs text-primary"
              >
                <Video className="h-3 w-3" />
              </Badge>
            )}
            {hasContent && (
              <Badge
                variant="secondary"
                className="border-border bg-muted px-1.5 py-0 text-xs text-muted-foreground"
              >
                <FileText className="h-3 w-3" />
              </Badge>
            )}
            {hasSlug && (
              <Badge
                variant="secondary"
                className="border-border bg-accent px-1.5 py-0 text-xs text-accent-foreground"
              >
                <Link2 className="h-3 w-3" />
              </Badge>
            )}
            <ChevronLeft className="h-4 w-4 text-muted-foreground transition-all group-hover:-translate-x-0.5 group-hover:text-foreground" />
          </div>
        </div>
      </div>
    </Link>
  );
}
