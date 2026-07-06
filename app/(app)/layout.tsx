import { ClerkProvider } from "@clerk/nextjs";
import type React from "react";
import { HeroHeader } from "../../components/header";

function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <HeroHeader />
      {children}
    </ClerkProvider>
  );
}

export default AppLayout;
