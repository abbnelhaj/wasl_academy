import { ModuleEditor } from "@/components/admin/editors/ModuleEditor";
import { dataset, projectId } from "@/sanity/env";

interface AdminModuleEditorPageProps {
  params: Promise<{
    documentId: string;
  }>;
}

export default async function AdminModuleEditorPage({
  params,
}: AdminModuleEditorPageProps) {
  const { documentId } = await params;

  return (
    <ModuleEditor
      documentId={documentId}
      projectId={projectId}
      dataset={dataset}
    />
  );
}
