"use client";

import { type DocumentHandle, useDocumentProjection } from "@sanity/sdk-react";
import { Layers } from "lucide-react";
import { Suspense } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { LessonItem } from "./LessonItem";
import type { ModuleLessonsData } from "./types";

export function ModuleWithLessons({
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
      lessons[]{ _ref }
    }`,
  });

  const module = data as ModuleLessonsData | undefined;
  const lessonRefs = module?.lessons ?? [];

  if (lessonRefs.length === 0) return null;

  return (
    <AccordionItem
      value={documentId}
      className="ms-2 border-s-2 border-border ps-4"
      dir="rtl"
    >
      <AccordionTrigger className="relative py-2 pe-8 text-right transition-colors hover:text-primary hover:no-underline data-[state=open]:text-primary [&_[data-slot=accordion-trigger-icon]]:absolute [&_[data-slot=accordion-trigger-icon]]:left-0 [&_[data-slot=accordion-trigger-icon]]:top-1/2 [&_[data-slot=accordion-trigger-icon]]:ml-0 [&_[data-slot=accordion-trigger-icon]]:-translate-y-1/2">
        <div className="flex min-w-0 flex-1 items-center gap-2 text-start">
          <Layers className="h-4 w-4 text-primary" />
          <span className="truncate text-sm font-medium text-foreground">
            {module?.title || "وحدة بدون عنوان"}
          </span>
          <span className="shrink-0 text-xs text-muted-foreground">
            ({lessonRefs.length} درس)
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-2">
        <div className="space-y-1.5 pt-1" dir="rtl">
          {lessonRefs.map((ref, index) =>
            ref._ref ? (
              <Suspense
                key={ref._ref}
                fallback={<Skeleton className="h-12 w-full bg-muted" />}
              >
                <div className="py-0.5">
                  <LessonItem
                    documentId={ref._ref}
                    documentType="lesson"
                    projectId={projectId}
                    dataset={dataset}
                    index={index}
                  />
                </div>
              </Suspense>
            ) : null,
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
