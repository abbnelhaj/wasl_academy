import {
  ArrowLeftIcon,
  BarChart3Icon,
  CheckCircle2Icon,
  PackageCheckIcon,
  PlayCircleIcon,
  StoreIcon,
} from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HeroSectionProps = {
  isSignedIn?: boolean;
};

const metrics = [
  { label: "مسارات للتجار", value: "12" },
  { label: "دروس عملية", value: "80+" },
  { label: "قوالب تشغيل", value: "18" },
];

const operatingSteps = [
  "رتب صفحة المنتج",
  "احسب ربح الطلب",
  "تابع الشحن والعميل",
];

export default function HeroSection({ isSignedIn = false }: HeroSectionProps) {
  const primaryHref = isSignedIn ? "/dashboard/courses" : "#courses";
  const primaryLabel = isSignedIn ? "اذهب إلى كورساتي" : "استعرض المسارات";

  return (
    <section className="border-b bg-background px-6 pb-16 pt-32 sm:px-10 sm:pt-36 lg:px-16">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1fr_0.92fr]">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm font-medium text-primary shadow-sm">
            <StoreIcon className="size-4" />
            <span>أكاديمية عملية للتجار وأصحاب المتاجر</span>
          </div>

          <h1 className="max-w-4xl text-balance text-4xl font-bold leading-tight tracking-normal text-foreground sm:text-6xl lg:text-7xl">
            Wasl Academy لتشغيل متجرك بقرارات أوضح
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-lg leading-9 text-muted-foreground">
            تعلم كيف تطلق المتجر، تسوق منتجاتك، تدير الطلبات، وتقرأ أرقامك
            اليومية بدون تعقيد. كورسات مختصرة ومباشرة للتاجر الذي يريد تطبيق
            اليوم قبل بكرة.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href={primaryHref}
              className={cn(buttonVariants({ size: "lg" }), "h-11 gap-2 px-5")}
            >
              {primaryLabel}
              <ArrowLeftIcon className="size-4" />
            </Link>
            <Link
              href="#features"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 px-5",
              )}
            >
              ماذا ستتعلم؟
            </Link>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
            {metrics.map((item) => (
              <div
                className="rounded-md border bg-card p-4 shadow-sm"
                key={item.label}
              >
                <p className="text-2xl font-bold text-primary">{item.value}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <p className="font-semibold text-foreground">لوحة التاجر</p>
              <p className="mt-1 text-sm text-muted-foreground">
                مسار هذا الأسبوع
              </p>
            </div>
            <span className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
              نشط
            </span>
          </div>

          <div className="mt-5 rounded-md border bg-background p-4">
            <div className="flex items-start gap-4">
              <span className="flex size-12 items-center justify-center rounded-md bg-primary/10 text-primary">
                <PlayCircleIcon className="size-6" />
              </span>
              <div>
                <p className="font-semibold text-foreground">
                  بناء صفحة منتج تبيع
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  درس عملي لتحسين الصور، الوصف، الأسئلة، والدعوة للشراء.
                </p>
              </div>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[72%] rounded-full bg-primary" />
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>تقدم المسار</span>
              <span>72%</span>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border bg-background p-4">
              <div className="flex items-center gap-2 text-primary">
                <BarChart3Icon className="size-4" />
                <p className="text-sm font-medium">قرار اليوم</p>
              </div>
              <p className="mt-3 text-xl font-bold text-foreground">
                راقب تكلفة الطلب
              </p>
            </div>
            <div className="rounded-md border bg-background p-4">
              <div className="flex items-center gap-2 text-primary">
                <PackageCheckIcon className="size-4" />
                <p className="text-sm font-medium">تشغيل</p>
              </div>
              <p className="mt-3 text-xl font-bold text-foreground">
                قلل أخطاء الشحن
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3 border-t pt-5">
            {operatingSteps.map((item) => (
              <div className="flex items-center gap-3" key={item}>
                <CheckCircle2Icon className="size-5 text-primary" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
