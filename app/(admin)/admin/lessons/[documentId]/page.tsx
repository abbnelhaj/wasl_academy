import { LessonEditor } from "@/components/admin/editors/LessonEditor";
import { dataset, projectId } from "@/sanity/env";

interface AdminLessonEditorPageProps {
  params: Promise<{
    documentId: string;
  }>;
}

export default async function AdminLessonEditorPage({
  params,
}: AdminLessonEditorPageProps) {
  const { documentId } = await params;

  return (
    <LessonEditor
      documentId={documentId}
      projectId={projectId}
      dataset={dataset}
    />
  );
}
