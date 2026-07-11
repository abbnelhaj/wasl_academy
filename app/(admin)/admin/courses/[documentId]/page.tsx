import { CourseEditor } from "@/components/admin/editors/CourseEditor";
import { dataset, projectId } from "@/sanity/env";

interface AdminCourseEditorPageProps {
  params: Promise<{
    documentId: string;
  }>;
}

export default async function AdminCourseEditorPage({
  params,
}: AdminCourseEditorPageProps) {
  const { documentId } = await params;

  return (
    <CourseEditor
      documentId={documentId}
      projectId={projectId}
      dataset={dataset}
    />
  );
}
