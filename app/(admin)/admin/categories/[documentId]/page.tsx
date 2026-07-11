import { CategoryEditor } from "@/components/admin/editors/CategoryEditor";
import { dataset, projectId } from "@/sanity/env";

interface AdminCategoryEditorPageProps {
  params: Promise<{
    documentId: string;
  }>;
}

export default async function AdminCategoryEditorPage({
  params,
}: AdminCategoryEditorPageProps) {
  const { documentId } = await params;

  return (
    <CategoryEditor
      documentId={documentId}
      projectId={projectId}
      dataset={dataset}
    />
  );
}
