import { DocumentList } from "@/components/admin/documents/DocumentList";
import { dataset, projectId } from "@/sanity/env";

export default function AdminCategoriesPage() {
  return (
    <DocumentList
      documentType="category"
      title="التصنيفات"
      description="إدارة تصنيفات كورسات وصل"
      basePath="/admin/categories"
      projectId={projectId}
      dataset={dataset}
    />
  );
}
