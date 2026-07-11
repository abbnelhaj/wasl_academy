"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function DocumentListSkeleton() {
  return (
    <div className="space-y-2" dir="rtl">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}

export function DocumentCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-md border bg-card shadow-sm"
      dir="rtl"
    >
      <Skeleton className="h-36 w-full" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export function DocumentGridSkeleton({ count = 4 }: { count?: number }) {
  const skeletonKeys = Array.from(
    { length: count },
    (_, index) => `document-card-skeleton-${index + 1}`,
  );

  return (
    <div
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      dir="rtl"
    >
      {skeletonKeys.map((key) => (
        <DocumentCardSkeleton key={key} />
      ))}
    </div>
  );
}

export function HierarchicalListSkeleton() {
  return (
    <div className="space-y-4" dir="rtl">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <div className="space-y-2 ps-4">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ModuleListSkeleton() {
  return (
    <div className="space-y-4" dir="rtl">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <div className="space-y-2 ps-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
