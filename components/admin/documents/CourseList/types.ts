export interface CourseListProps {
  projectId: string;
  dataset: string;
}

export interface CourseData {
  title?: string;
  description?: string;
  accessType?: "free" | "paid" | null;
  currency?: "SAR" | "USD" | null;
  featured?: boolean | null;
  level?: "beginner" | "intermediate" | "advanced" | null;
  price?: number | null;
  thumbnail?: {
    url?: string;
  } | null;
  moduleCount?: number | null;
  lessonCount?: number | null;
}
