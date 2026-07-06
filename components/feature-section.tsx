import {
  BarChart3Icon,
  MegaphoneIcon,
  PackageCheckIcon,
  StoreIcon,
} from "lucide-react";
import type React from "react";
import { cn } from "@/lib/utils";

type FeatureType = {
  title: string;
  icon: React.ReactNode;
  description: string;
};

const features: FeatureType[] = [
  {
    title: "إطلاق المتجر",
    icon: <StoreIcon />,
    description:
      "اختيار المنتج، ترتيب الصفحة، وتوضيح العرض حتى يفهم العميل لماذا يشتري منك.",
  },
  {
    title: "تسويق ومبيعات",
    icon: <MegaphoneIcon />,
    description:
      "تعلم الإعلانات، المحتوى، والعروض بطريقة عملية مرتبطة بالمبيعات لا بالمشاهدات فقط.",
  },
  {
    title: "تشغيل وشحن",
    icon: <PackageCheckIcon />,
    description:
      "نظام بسيط لإدارة الطلبات، متابعة الشحن، وتقليل الأخطاء بعد تأكيد الشراء.",
  },
  {
    title: "أرقام وربحية",
    icon: <BarChart3Icon />,
    description:
      "اقرأ تكلفة الطلب، هامش الربح، ومتوسط السلة حتى تعرف أين تكسب وأين تخسر.",
  },
];

export function FeatureSection() {
  return (
    <section id="features" className="bg-background py-20 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold text-primary">
              ماذا ستتعلم؟
            </p>
            <h2 className="max-w-3xl text-balance text-3xl font-bold leading-tight tracking-normal text-foreground md:text-5xl">
              مهارات عملية يحتاجها صاحب المتجر كل يوم
            </h2>
          </div>

          <p className="text-pretty text-base leading-8 text-muted-foreground md:text-lg">
            لا نريد صفحة مليئة بالكلام التسويقي. الهدف أن يدخل التاجر، يختار
            مساره، ويخرج بخطوة قابلة للتطبيق في متجره.
          </p>
        </div>

        <div className="mt-12 grid border-t md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard feature={feature} index={index} key={feature.title} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  index,
  className,
  ...props
}: React.ComponentProps<"article"> & {
  feature: FeatureType;
  index: number;
}) {
  return (
    <article
      className={cn(
        "group border-b bg-card p-6 transition duration-200 hover:bg-primary/5 md:border-x lg:border-l-0",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="flex size-11 items-center justify-center rounded-md border bg-background text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
          <span className="[&_svg]:size-5 [&_svg]:stroke-[1.8]">
            {feature.icon}
          </span>
        </span>
        <span className="text-sm font-semibold text-primary/70">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <h3 className="mt-7 text-xl font-semibold text-foreground">
        {feature.title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        {feature.description}
      </p>
    </article>
  );
}
