import { AdminDashboard } from "@/components/admin/dashboard/AdminDashboard";
import { dataset, projectId } from "@/sanity/env";

export default function AdminPage() {
  return <AdminDashboard projectId={projectId} dataset={dataset} />;
}
