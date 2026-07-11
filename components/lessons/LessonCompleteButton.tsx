"use client";

import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toggleLessonCompletion } from "@/lib/actions";

interface LessonCompleteButtonProps {
  lessonId: string;
  lessonSlug: string;
  isCompleted: boolean;
  courseSlug?: string | null;
  onCompletedChange?: (isCompleted: boolean) => void;
}

export function LessonCompleteButton({
  courseSlug,
  isCompleted,
  lessonId,
  lessonSlug,
  onCompletedChange,
}: LessonCompleteButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    setError(null);

    startTransition(async () => {
      const result = await toggleLessonCompletion(
        lessonId,
        lessonSlug,
        !isCompleted,
        courseSlug,
      );

      if (result.success) {
        onCompletedChange?.(result.isCompleted);
        return;
      }

      setError(result.error ?? "تعذر حفظ حالة الدرس الآن. جرّب مرة أخرى.");
    });
  };

  return (
    <div className="space-y-2">
      <Button
        className={
          isCompleted
            ? "border-primary/20 bg-primary/10 text-primary hover:bg-primary/15"
            : "bg-primary text-primary-foreground hover:bg-primary/80"
        }
        disabled={isPending}
        onClick={handleToggle}
        variant={isCompleted ? "outline" : "default"}
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : isCompleted ? (
          <CheckCircle2 className="size-4" />
        ) : (
          <Circle className="size-4" />
        )}
        {isCompleted ? "تم إنهاء الدرس" : "علّم الدرس كمكتمل"}
      </Button>

      {error ? (
        <p className="max-w-xs text-sm text-destructive">{error}</p>
      ) : null}
    </div>
  );
}
