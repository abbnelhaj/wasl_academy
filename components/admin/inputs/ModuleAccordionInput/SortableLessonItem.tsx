"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDocumentProjection } from "@sanity/sdk-react";
import { ExternalLink, GripVertical, PlayCircle, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SortableLessonItemProps {
  id: string;
  documentId: string;
  projectId: string;
  dataset: string;
  onRemove: () => void;
}

export function SortableLessonItem({
  id,
  documentId,
  projectId,
  dataset,
  onRemove,
}: SortableLessonItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { data } = useDocumentProjection({
    documentId,
    documentType: "lesson",
    projectId,
    dataset,
    projection: "{ title }",
  });

  const title = (data as { title?: string })?.title || "درس بدون عنوان";
  const editUrl = `/admin/lessons/${documentId}`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 rounded-md border bg-card p-2.5 ${
        isDragging ? "z-50 opacity-50 shadow-lg" : ""
      }`}
      dir="rtl"
    >
      <button
        type="button"
        className="touch-none cursor-grab text-muted-foreground transition-colors hover:text-foreground active:cursor-grabbing"
        aria-label="سحب الدرس لتغيير ترتيبه"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      <PlayCircle className="h-3.5 w-3.5 text-primary" />
      <Link
        href={editUrl}
        className="flex flex-1 items-center gap-1.5 text-sm text-foreground transition-colors hover:text-primary hover:underline"
      >
        {title}
        <ExternalLink className="h-3 w-3 opacity-50" />
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 text-muted-foreground hover:bg-muted hover:text-foreground"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        aria-label="إزالة الدرس من الوحدة"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
