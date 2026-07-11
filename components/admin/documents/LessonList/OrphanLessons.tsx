"use client";

import type { DocumentHandle } from "@sanity/sdk-react";
import { Play } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { LessonItem } from "./LessonItem";

interface OrphanLessonsProps {
  documents: DocumentHandle[];
}

export function OrphanLessons({ documents }: OrphanLessonsProps) {
  return (
    <div
      className="overflow-hidden rounded-md border bg-card shadow-sm"
      dir="rtl"
    >
      <div className="border-b bg-muted/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="rounded-md border border-primary/20 bg-primary/10 p-2 text-primary">
            <Play className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-medium text-foreground">كل الدروس</h3>
            <p className="text-xs text-muted-foreground">
              إجمالي {documents.length} درس
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-1.5 p-4" dir="rtl">
        {documents.map((doc) => (
          <Suspense
            key={doc.documentId}
            fallback={<Skeleton className="h-12 w-full bg-muted" />}
          >
            <LessonItem {...doc} />
          </Suspense>
        ))}
      </div>
    </div>
  );
}
