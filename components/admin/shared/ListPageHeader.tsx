"use client";

import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ListPageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  isLoading?: boolean;
}

export function ListPageHeader({
  title,
  description,
  actionLabel,
  onAction,
  isLoading = false,
}: ListPageHeaderProps) {
  return (
    <div
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      dir="rtl"
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm leading-7 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {actionLabel && onAction && (
        <Button
          type="button"
          onClick={onAction}
          disabled={isLoading}
          size="lg"
          className="px-4"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {isLoading ? "جاري الإنشاء..." : actionLabel}
        </Button>
      )}
    </div>
  );
}
