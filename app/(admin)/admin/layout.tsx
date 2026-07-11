import { Suspense } from "react";
import AdminBreadcrumb from "@/components/admin/layout/AdminBreadcrumb";
import AdminHeader from "@/components/admin/layout/AdminHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Providers } from "@/components/Providers";

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="min-h-screen bg-background text-foreground" dir="rtl">
        <Suspense
          fallback={
            <LoadingSpinner
              text="جاري تحميل لوحة الإدارة..."
              isFullScreen
              size="lg"
            />
          }
        >
          <AdminHeader />
          <div className="relative z-10 px-6 py-4">
            <AdminBreadcrumb />
          </div>
          <main className="container relative z-10 mx-auto px-6 pb-8">
            {children}
          </main>
        </Suspense>
      </div>
    </Providers>
  );
}

export default AdminLayout;
