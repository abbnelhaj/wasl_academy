"use client";

import {
  BookOpen,
  ExternalLink,
  Layers,
  LayoutDashboard,
  Menu,
  PlayCircle,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { studioBaseUrl } from "@/components/admin/lib/studio-url";
import { Logo } from "@/components/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import AdminLogOutButton from "./AdminLogOutButton";

const NAV_ITEMS = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, exact: true },
  { href: "/admin/courses", label: "الكورسات", icon: BookOpen },
  { href: "/admin/modules", label: "الوحدات", icon: Layers },
  { href: "/admin/lessons", label: "الدروس", icon: PlayCircle },
  { href: "/admin/categories", label: "التصنيفات", icon: Tag },
];

function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <header
      className="sticky top-0 z-50 border-b bg-card/90 text-foreground backdrop-blur-xl"
      dir="rtl"
    >
      <div className="flex h-14 items-center px-4 lg:px-6">
        <Link
          href="/admin"
          aria-label="لوحة إدارة وصل"
          className="flex items-center gap-3 font-semibold lg:me-8"
        >
          <span className="flex h-10 items-center">
            <Logo />
          </span>
          <span className="hidden border-s ps-3 text-sm font-medium text-muted-foreground sm:inline">
            لوحة الإدارة
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "border border-primary/20 bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href={studioBaseUrl}
            target="_blank"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" />
            فتح الاستوديو
          </Link>
          <AdminLogOutButton />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">فتح القائمة</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56" dir="rtl">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);
              return (
                <DropdownMenuItem
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2",
                    active ? "bg-primary/10 text-primary" : "text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => window.open(studioBaseUrl, "_blank", "noreferrer")}
              className="flex cursor-pointer items-center gap-2 text-foreground"
            >
              <ExternalLink className="h-4 w-4" />
              فتح الاستوديو
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="p-2">
              <AdminLogOutButton />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default AdminHeader;
