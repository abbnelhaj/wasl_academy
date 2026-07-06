"use client";

import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import {
  BookOpen,
  LayoutDashboard,
  type LucideIcon,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const loggedOutLinks = [
  { label: "المزايا", href: "#features" },
  { label: "الكورسات", href: "#courses" },
  { label: "آراء الطلاب", href: "#testimonials" },
];

type NavigationLink = {
  href: string;
  label: string;
  icon?: LucideIcon;
};

const loggedInLinks: NavigationLink[] = [
  { href: "/dashboard", label: "لوحتي", icon: LayoutDashboard },
  { href: "/dashboard/courses", label: "كورساتي", icon: BookOpen },
];

export const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { isLoaded, isSignedIn } = useAuth();
  const pathname = usePathname();
  const navigationLinks: NavigationLink[] = isSignedIn
    ? loggedInLinks
    : loggedOutLinks;

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      <nav
        data-state={menuState ? "active" : undefined}
        className="fixed inset-x-0 top-0 z-20 w-full px-2"
      >
        <div
          className={cn(
            "mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12",
            isScrolled &&
              "max-w-4xl rounded-2xl border bg-background/50 backdrop-blur-lg lg:px-5",
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full items-center justify-between lg:w-auto">
              <Link
                href={isSignedIn ? "/dashboard" : "/"}
                aria-label="الصفحة الرئيسية"
                className="flex items-center gap-2"
              >
                <Logo />
              </Link>

              <button
                type="button"
                onClick={() => setMenuState((current) => !current)}
                aria-label={menuState ? "إغلاق القائمة" : "فتح القائمة"}
                aria-expanded={menuState}
                className="relative z-20 -m-2.5 -me-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="m-auto size-6 duration-200 in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0" />
                <X className="absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200 in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100" />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {navigationLinks.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-2 text-muted-foreground duration-150 hover:text-accent-foreground",
                          isActive && "text-primary",
                        )}
                      >
                        {Icon ? <Icon className="size-4" /> : null}
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border bg-background p-6 shadow-2xl shadow-zinc-300/20 in-data-[state=active]:block md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none lg:in-data-[state=active]:flex dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {navigationLinks.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-2 text-muted-foreground duration-150 hover:text-accent-foreground",
                            isActive && "text-primary",
                          )}
                          onClick={() => setMenuState(false)}
                        >
                          {Icon ? <Icon className="size-4" /> : null}
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="flex w-full flex-col items-stretch space-y-3 sm:flex-row sm:items-center sm:gap-3 sm:space-y-0 md:w-fit">
                {!isLoaded ? null : isSignedIn ? (
                  <>
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "size-8",
                        },
                      }}
                    />

                    <SignOutButton>
                      <button
                        type="button"
                        className={cn(
                          buttonVariants({
                            variant: "outline",
                            size: "sm",
                          }),
                          "w-full sm:w-auto",
                        )}
                        onClick={() => setMenuState(false)}
                      >
                        <span>تسجيل الخروج</span>
                      </button>
                    </SignOutButton>
                  </>
                ) : (
                  <>
                    <SignInButton mode="modal">
                      <button
                        type="button"
                        className={cn(
                          buttonVariants({
                            variant: "outline",
                            size: "sm",
                          }),
                          "w-full sm:w-auto",
                          isScrolled && "lg:hidden",
                        )}
                        onClick={() => setMenuState(false)}
                      >
                        <span>تسجيل الدخول</span>
                      </button>
                    </SignInButton>

                    <SignUpButton mode="modal">
                      <button
                        type="button"
                        className={cn(
                          buttonVariants({
                            variant: "default",
                            size: "sm",
                          }),
                          "w-full sm:w-auto",
                          isScrolled && "lg:hidden",
                        )}
                        onClick={() => setMenuState(false)}
                      >
                        <span>إنشاء حساب</span>
                      </button>
                    </SignUpButton>

                    <SignUpButton mode="modal">
                      <button
                        type="button"
                        className={cn(
                          buttonVariants({
                            variant: "default",
                            size: "sm",
                          }),
                          isScrolled ? "lg:inline-flex" : "hidden",
                        )}
                        onClick={() => setMenuState(false)}
                      >
                        <span>ابدأ الآن</span>
                      </button>
                    </SignUpButton>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
