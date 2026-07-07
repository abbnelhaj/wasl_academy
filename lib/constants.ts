export const COURSE_ACCESS_OPTIONS = [
  { value: "free", label: "مجاني" },
  { value: "paid", label: "مدفوع" },
] as const;

export type CourseAccess = (typeof COURSE_ACCESS_OPTIONS)[number]["value"];

export const COURSE_LEVEL_OPTIONS = [
  { value: "beginner", label: "مبتدئ" },
  { value: "intermediate", label: "متوسط" },
  { value: "advanced", label: "متقدم" },
] as const;

export type CourseLevel = (typeof COURSE_LEVEL_OPTIONS)[number]["value"];

export const COURSE_ACCESS_STYLES: Record<
  CourseAccess,
  {
    badge: string;
    label: string;
  }
> = {
  free: {
    badge: "border-primary/20 bg-primary/10 text-primary",
    label: "مجاني",
  },
  paid: {
    badge: "border-primary bg-primary text-primary-foreground",
    label: "مدفوع",
  },
};

export const COURSE_LEVEL_STYLES: Record<
  CourseLevel,
  {
    badge: string;
    label: string;
  }
> = {
  beginner: {
    badge: "border-primary/15 bg-primary/5 text-primary",
    label: "مبتدئ",
  },
  intermediate: {
    badge: "border-blue-500/20 bg-blue-500/10 text-blue-600",
    label: "متوسط",
  },
  advanced: {
    badge: "border-foreground/10 bg-foreground/5 text-foreground",
    label: "متقدم",
  },
};

export const COURSE_STATE_STYLES = {
  completed: {
    badge: "border-primary bg-primary text-primary-foreground",
    label: "مكتمل",
  },
  featured: {
    badge: "border-primary/20 bg-primary/10 text-primary",
    label: "مميز",
  },
  locked: {
    label: "سجل الدخول للمتابعة",
  },
} as const;

export function normalizeCourseAccess(
  accessType: string | null | undefined,
): CourseAccess {
  return accessType === "paid" ? "paid" : "free";
}

export function normalizeCourseLevel(
  level: string | null | undefined,
): CourseLevel {
  if (level === "intermediate" || level === "advanced") {
    return level;
  }

  return "beginner";
}

export function getCourseAccessLabel({
  accessType,
  currency,
  price,
}: {
  accessType: string | null | undefined;
  currency?: string | null;
  price?: number | null;
}) {
  const normalizedAccess = normalizeCourseAccess(accessType);

  if (normalizedAccess === "paid" && price && currency) {
    return `${price} ${currency}`;
  }

  return COURSE_ACCESS_STYLES[normalizedAccess].label;
}
