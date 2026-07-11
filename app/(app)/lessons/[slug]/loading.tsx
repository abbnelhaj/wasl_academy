import { Skeleton } from "@/components/ui/skeleton";

const lessonSkeletonModules = ["intro", "middle", "final"];

function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="w-full shrink-0 lg:w-80">
            <div className="rounded-md border bg-card p-5 shadow-sm">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="mt-5 h-7 w-52" />
              <Skeleton className="mt-3 h-4 w-full" />

              <div className="mt-6 space-y-5 border-t pt-5">
                {lessonSkeletonModules.map((moduleKey) => (
                  <div className="space-y-3" key={moduleKey}>
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-40" />
                    <div className="space-y-2">
                      <Skeleton className="h-9 w-full rounded-md" />
                      <Skeleton className="h-9 w-full rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="min-w-0 flex-1 space-y-6">
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-7 w-24 rounded-md" />
              <Skeleton className="h-7 w-20 rounded-md" />
            </div>

            <div className="space-y-4">
              <Skeleton className="h-12 w-full max-w-2xl" />
              <Skeleton className="h-5 w-full max-w-3xl" />
              <Skeleton className="h-5 w-2/3 max-w-2xl" />
            </div>

            <Skeleton className="aspect-video w-full rounded-md" />

            <div className="rounded-md border bg-card p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-2">
                <Skeleton className="size-5 rounded-md" />
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Loading;
