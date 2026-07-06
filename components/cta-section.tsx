import { ArrowLeftIcon, CheckCircle2Icon, StoreIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CtaSectionProps = {
  isSignedIn?: boolean;
};

const points = [
  "ابدأ بمسار مجاني قبل الانتقال للكورسات المدفوعة",
  "تعلم خطوات قابلة للتطبيق داخل متجرك مباشرة",
  "تابع تقدمك من لوحة واحدة بدون تشتت",
];

export function CtaSection({ isSignedIn = false }: CtaSectionProps) {
  const href = "/dashboard/courses";
  const label = isSignedIn ? "اذهب إلى كورساتي" : "ابدأ التعلم الآن";

  return (
    <section className="border-y bg-primary py-16 text-primary-foreground sm:py-20">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 lg:grid-cols-[1fr_0.75fr] lg:items-center lg:px-8">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-2 text-sm font-medium">
            <StoreIcon className="size-4" />
            <span>جاهز ترتب متجرك بشكل أوضح؟</span>
          </div>

          <h2 className="max-w-3xl text-balance text-3xl font-bold leading-tight tracking-normal md:text-5xl">
            اختر أول مسار، وابدأ بخطوة عملية اليوم
          </h2>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-8 text-primary-foreground/80 md:text-lg">
            Wasl Academy مصممة للتاجر الذي يريد يعرف ماذا يفعل بعد كل درس: تحسين
            صفحة، قراءة إعلان، ترتيب طلبات، أو اتخاذ قرار مبني على رقم.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={href}
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
                "h-11 gap-2 bg-primary-foreground px-5 text-primary hover:bg-primary-foreground/90",
              )}
            >
              {label}
              <ArrowLeftIcon className="size-4" />
            </Link>
            <Link
              href="#courses"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 border-primary-foreground/30 bg-transparent px-5 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground",
              )}
            >
              شاهد المسارات
            </Link>
          </div>
        </div>

        <div className="rounded-md border border-primary-foreground/25 bg-primary-foreground/10 p-5">
          <p className="text-sm font-semibold">ما الذي تبدأ به؟</p>
          <ul className="mt-5 space-y-4">
            {points.map((point) => (
              <li className="flex gap-3 text-sm leading-7" key={point}>
                <CheckCircle2Icon className="mt-1 size-5 shrink-0" />
                <span className="text-primary-foreground/85">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
