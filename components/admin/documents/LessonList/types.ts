import type { DocumentHandle } from "@sanity/sdk-react";

export interface LessonListProps {
  projectId: string;
  dataset: string;
}

export interface LessonData {
  title?: string | null;
  shortDescription?: string | null;
  slug?: { current?: string | null } | null;
  hasVideo?: boolean | null;
  hasContent?: boolean | null;
}

export interface ModuleLessonsData {
  title?: string | null;
  lessons?: Array<{
    _ref?: string | null;
  }>;
}

export interface CourseModulesData {
  title?: string | null;
  modules?: Array<{
    _ref?: string | null;
  }>;
}

export type LessonItemProps = DocumentHandle & { index?: number };
