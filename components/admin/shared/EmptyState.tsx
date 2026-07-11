"use client";

import { FilePlus2, Loader2, type LucideIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  emoji?: string;
  icon?: LucideIcon;
  message: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  isLoading?: boolean;
}

export function EmptyState({
  emoji,
  icon: Icon = FilePlus2,
  message,
  description,
  actionLabel,
  onAction,
  isLoading = false,
}: EmptyStateProps) {
  return (
    <div
      className="rounded-md border bg-card p-10 text-center shadow-sm"
      dir="rtl"
    >
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-md bg-primary/10 text-primary">
        {emoji ? (
          <span className="text-2xl">{emoji}</span>
        ) : (
          <Icon className="size-5" />
        )}
      </div>
      <h2 className="text-base font-semibold text-foreground">{message}</h2>
      {description ? (
        <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
          {description}
        </p>
      ) : null}
      {actionLabel && onAction && (
        <Button
          type="button"
          onClick={onAction}
          disabled={isLoading}
          size="lg"
          className="mt-5 px-4"
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
