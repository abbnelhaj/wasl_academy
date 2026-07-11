import { Lock, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface GatedFallbackProps {
  previewLessonCount?: number | null;
}

export function GatedFallback({ previewLessonCount = 0 }: GatedFallbackProps) {
  return (
    <div className="relative overflow-hidden rounded-md border bg-card p-6 shadow-sm md:p-8">
      <div className="absolute inset-y-0 right-0 w-1 bg-primary" />

      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Lock className="size-6" />
          </span>

          <div>
            <p className="text-sm font-semibold text-primary">كورس مدفوع</p>
            <h3 className="mt-1 text-xl font-bold text-foreground">
              بقية المحتوى تفتح بعد الشراء
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
              هذا ليس نظام اشتراكات. سنربط لاحقًا السلة وخيارات الدفع الخاصة
              بمنصة وصل. حاليًا يمكنك مشاهدة دروس المعاينة المتاحة.
            </p>
            {previewLessonCount ? (
              <p className="mt-2 text-sm font-medium text-foreground">
                دروس المعاينة المتاحة: {previewLessonCount}
              </p>
            ) : null}
          </div>
        </div>

        <Link
          className={cn(buttonVariants(), "w-full gap-2 md:w-auto")}
          href="/dashboard/courses"
        >
          <ShoppingCart className="size-4" />
          تصفح الكورسات
        </Link>
      </div>
    </div>
  );
}
