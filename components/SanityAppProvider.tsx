"use client";

import { SanityApp } from "@sanity/sdk-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { dataset, projectId } from "@/sanity/env";

function SanityAppProvider({ children }: { children: React.ReactNode }) {
  return (
    <SanityApp
      config={[
        {
          projectId,
          dataset,
        },
      ]}
      fallback={
        <LoadingSpinner
          text="Loading Sanity session..."
          isFullScreen
          size="lg"
        />
      }
    >
      {children}
    </SanityApp>
  );
}

export default SanityAppProvider;
