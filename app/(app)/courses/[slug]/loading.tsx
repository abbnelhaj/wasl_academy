import { Skeleton } from "@/components/ui/skeleton";

function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <div className="mb-8">
          <Skeleton className="h-5 w-36 rounded-md bg-muted" />
        </div>

        <div className="mb-8 grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Skeleton className="h-7 w-16 rounded-md bg-muted" />
              <Skeleton className="h-7 w-24 rounded-md bg-muted" />
            </div>

            <Skeleton className="h-12 w-full max-w-xl rounded-md bg-muted" />

            <div className="space-y-2">
              <Skeleton className="h-5 w-full max-w-2xl rounded-md bg-muted" />
              <Skeleton className="h-5 w-4/5 rounded-md bg-muted" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {["stat-1", "stat-2", "stat-3", "stat-4"].map((id) => (
                <div
                  className="rounded-md border bg-card p-4 shadow-sm"
                  key={id}
                >
                  <Skeleton className="mb-3 size-5 rounded-md bg-muted" />
                  <Skeleton className="h-7 w-14 rounded-md bg-muted" />
                  <Skeleton className="mt-2 h-4 w-20 rounded-md bg-muted" />
                </div>
              ))}
            </div>
          </div>

          <Skeleton className="min-h-72 rounded-md border bg-card shadow-sm" />
        </div>

        <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_0.36fr]">
          <div>
            <Skeleton className="h-4 w-24 rounded-md bg-muted" />
            <Skeleton className="mt-3 h-8 w-44 rounded-md bg-muted" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full max-w-lg rounded-md bg-muted" />
              <Skeleton className="h-4 w-3/4 rounded-md bg-muted" />
            </div>
          </div>

          <div className="rounded-md border bg-card p-5 shadow-sm">
            <Skeleton className="h-5 w-24 rounded-md bg-muted" />
            <Skeleton className="mt-4 h-4 w-full rounded-md bg-muted" />
            <Skeleton className="mt-2 h-4 w-4/5 rounded-md bg-muted" />
          </div>
        </div>

        <div className="space-y-4">
          {["module-1", "module-2", "module-3"].map((id) => (
            <div className="rounded-md border bg-card p-5 shadow-sm" key={id}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="size-10 rounded-md bg-muted" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-16 rounded-md bg-muted" />
                    <Skeleton className="h-5 w-48 rounded-md bg-muted" />
                    <Skeleton className="h-4 w-36 rounded-md bg-muted" />
                  </div>
                </div>
                <Skeleton className="h-9 w-20 rounded-md bg-muted" />
              </div>

              <div className="mt-5 border-t pt-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="size-10 rounded-md bg-muted" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-28 rounded-md bg-muted" />
                      <Skeleton className="h-4 w-52 rounded-md bg-muted" />
                    </div>
                  </div>
                  <Skeleton className="h-7 w-24 rounded-md bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Loading;
