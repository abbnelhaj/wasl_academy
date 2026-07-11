import type { DocumentHandle } from "@sanity/sdk-react";

export interface ModuleListProps {
  projectId: string;
  dataset: string;
}

export interface ModuleData {
  title?: string | null;
  description?: string | null;
  lessonCount?: number | null;
  courseTitle?: string | null;
  courseId?: string | null;
}

export interface CourseModulesData {
  title?: string | null;
  modules?: Array<{
    _ref?: string | null;
  }>;
}

export type ModuleItemProps = DocumentHandle & { index?: number };
