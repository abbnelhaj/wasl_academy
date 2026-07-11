import { ModuleList } from "@/components/admin/documents/ModuleList";
import { dataset, projectId } from "@/sanity/env";

export default function AdminModulesPage() {
  return <ModuleList projectId={projectId} dataset={dataset} />;
}
