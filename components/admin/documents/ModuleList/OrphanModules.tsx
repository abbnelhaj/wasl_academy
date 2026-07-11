"use client";

import type { DocumentHandle } from "@sanity/sdk-react";
import { Layers } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ModuleItem } from "./ModuleItem";

interface OrphanModulesProps {
  documents: DocumentHandle[];
}

export function OrphanModules({ documents }: OrphanModulesProps) {
  return (
    <div
      className="overflow-hidden rounded-md border bg-card shadow-sm"
      dir="rtl"
    >
      <div className="border-b bg-muted/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="rounded-md border border-primary/20 bg-primary/10 p-2 text-primary">
            <Layers className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-medium text-foreground">كل الوحدات</h3>
            <p className="text-xs text-muted-foreground">
              إجمالي {documents.length} وحدة جاهزة للربط بكورس
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-2 p-4">
        {documents.map((doc) => (
          <Suspense
            key={doc.documentId}
            fallback={<Skeleton className="h-16 w-full" />}
          >
            <ModuleItem {...doc} />
          </Suspense>
        ))}
      </div>
    </div>
  );
}
