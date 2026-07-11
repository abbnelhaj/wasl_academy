"use client";

import { useLogOut } from "@sanity/sdk-react";
import { LogOut } from "lucide-react";

function AdminLogOutButton() {
  const logout = useLogOut();

  const handleLogout = () => {
    logout();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
    >
      <LogOut className="h-4 w-4" />
      تسجيل الخروج
    </button>
  );
}

export default AdminLogOutButton;
