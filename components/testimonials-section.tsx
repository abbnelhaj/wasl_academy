import { QuoteIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Testimonial = {
  quote: string;
  name: string;
  business: string;
  result: string;
  initials: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "فهمت لأول مرة كيف أحسب تكلفة الطلب. قبل كنت أفرح بالمبيعات، لكن ما أعرف الربح الحقيقي.",
    name: "مازن الحربي",
    business: "متجر عطور ومنتجات عناية",
    result: "صار يتابع الربحية أسبوعياً",
    initials: "م",
  },
  {
    quote:
      "عدلت صفحة المنتج بعد الدرس: صور أوضح، وصف أقصر، وأسئلة متكررة. الاستفسارات قلت والطلبات صارت أوضح.",
    name: "ريم العبدلي",
    business: "متجر ملابس نسائية",
    result: "تحسن وضوح صفحة المنتج",
    initials: "ر",
  },
  {
    quote:
      "أكثر شيء فادني ترتيب الشحن والمتابعة. صار عندي خطوات ثابتة بدل ما كل طلب يمشي بطريقة مختلفة.",
    name: "فهد الزهراني",
    business: "متجر أدوات منزلية",
    result: "تشغيل الطلبات أصبح أهدأ",
    initials: "ف",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-background py-20 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold text-primary">آراء التجار</p>
          <h2 className="text-balance text-3xl font-bold leading-tight tracking-normal text-foreground md:text-5xl">
            محتوى يساعدك تفهم متجرك لا تحفظ معلومات
          </h2>
          <p className="mt-5 text-pretty text-base leading-8 text-muted-foreground">
            نركز على المشاكل اليومية لصاحب المتجر: الإعلان، صفحة المنتج،
            الطلبات، والربح الحقيقي.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
  className,
  ...props
}: React.ComponentProps<"figure"> & {
  testimonial: Testimonial;
}) {
  const { quote, name, business, result, initials } = testimonial;

  return (
    <figure
      className={cn(
        "flex min-h-[300px] flex-col justify-between rounded-md border bg-card p-6 shadow-sm",
        className,
      )}
      {...props}
    >
      <div>
        <div className="flex size-10 items-center justify-center rounded-md border bg-primary/10 text-primary">
          <QuoteIcon aria-hidden="true" className="size-5 stroke-[1.8]" />
        </div>
        <blockquote className="mt-6">
          <p className="text-base leading-8 text-muted-foreground">{quote}</p>
        </blockquote>
      </div>

      <figcaption className="mt-8 border-t pt-5">
        <div className="flex items-center gap-3">
          <Avatar className="size-11">
            <AvatarFallback className="bg-primary/10 font-semibold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <cite className="font-semibold text-foreground not-italic">
              {name}
            </cite>
            <p className="mt-1 text-sm text-muted-foreground">{business}</p>
          </div>
        </div>
        <div className="mt-5 rounded-md border bg-primary/5 px-3 py-2 text-xs font-medium text-primary">
          {result}
        </div>
      </figcaption>
    </figure>
  );
}
