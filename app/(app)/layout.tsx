import { ClerkProvider } from "@clerk/nextjs";
import type React from "react";
import { HeroHeader } from "../../components/header";
import { TutorWidget } from "./tutor";

function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <HeroHeader />
      {children}
      <TutorWidget />
    </ClerkProvider>
  );
}

export default AppLayout;
