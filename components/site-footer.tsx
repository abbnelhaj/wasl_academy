import Link from "next/link";
import { Logo } from "@/components/logo";

const footerLinks = [
  { label: "المزايا", href: "#features" },
  { label: "الكورسات", href: "#courses" },
  { label: "آراء التجار", href: "#testimonials" },
  { label: "لوحة التاجر", href: "/dashboard" },
];

export function SiteFooter() {
  return (
    <footer className="bg-background">
      <div className="mx-auto w-full max-w-6xl px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-8 border-b pb-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link
              href="/"
              aria-label="Wasl Academy"
              className="inline-flex items-center"
            >
              <Logo />
            </Link>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              أكاديمية عملية تساعد التجار وأصحاب المتاجر على تحسين البيع،
              التشغيل، وقراءة الأرقام بوضوح.
            </p>
          </div>

          <nav aria-label="روابط الفوتر">
            <ul className="grid gap-3 text-sm sm:grid-cols-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Wasl Academy. جميع الحقوق محفوظة.</p>
          <p>تعلم التجارة الإلكترونية بخطوات أوضح.</p>
        </div>
      </div>
    </footer>
  );
}
