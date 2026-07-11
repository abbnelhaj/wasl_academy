"use client";

import { type DocumentHandle, useDocumentProjection } from "@sanity/sdk-react";
import { BookOpen } from "lucide-react";
import { Suspense } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { ModuleItem } from "./ModuleItem";
import type { CourseModulesData } from "./types";

export function CourseWithModules({
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
      modules[]{ _ref }
    }`,
  });

  const course = data as CourseModulesData | undefined;
  const moduleRefs = course?.modules ?? [];

  if (moduleRefs.length === 0) return null;

  return (
    <AccordionItem
      value={documentId}
      className="overflow-hidden rounded-md border bg-card shadow-sm"
      dir="rtl"
    >
      <AccordionTrigger className="relative px-4 py-3 pe-12 text-right transition-colors hover:bg-muted/50 hover:no-underline data-[state=open]:bg-muted/40 [&_[data-slot=accordion-trigger-icon]]:absolute [&_[data-slot=accordion-trigger-icon]]:left-4 [&_[data-slot=accordion-trigger-icon]]:top-1/2 [&_[data-slot=accordion-trigger-icon]]:ml-0 [&_[data-slot=accordion-trigger-icon]]:-translate-y-1/2">
        <div className="flex min-w-0 flex-1 items-center gap-3 text-start">
          <div className="rounded-md border border-primary/20 bg-primary/10 p-2 text-primary">
            <BookOpen className="h-4 w-4" />
          </div>
          <div className="min-w-0 text-start">
            <h3 className="truncate font-medium text-foreground">
              {course?.title || "كورس بدون عنوان"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {moduleRefs.length} وحدة
            </p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <div className="space-y-3 pt-3" dir="rtl">
          {moduleRefs.map((ref, index) =>
            ref._ref ? (
              <Suspense
                key={ref._ref}
                fallback={<Skeleton className="h-16 w-full" />}
              >
                <div className="pt-0.5">
                  <ModuleItem
                    documentId={ref._ref}
                    documentType="module"
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
