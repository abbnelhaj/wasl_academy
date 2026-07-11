"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDocumentProjection } from "@sanity/sdk-react";
import { ExternalLink, GripVertical, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getUntitledDocumentLabel } from "./types";

const ADMIN_DOCUMENT_PATHS: Record<string, string> = {
  category: "categories",
  course: "courses",
  lesson: "lessons",
  module: "modules",
};

interface SortableReferenceItemProps {
  id: string;
  documentId: string;
  documentType: string;
  projectId: string;
  dataset: string;
  onRemove: () => void;
}

export function SortableReferenceItem({
  id,
  documentId,
  documentType,
  projectId,
  dataset,
  onRemove,
}: SortableReferenceItemProps) {
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
    documentType,
    projectId,
    dataset,
    projection: "{ title }",
  });

  const title =
    (data as { title?: string })?.title ||
    getUntitledDocumentLabel(documentType);
  const documentPath = ADMIN_DOCUMENT_PATHS[documentType] ?? `${documentType}s`;
  const editUrl = `/admin/${documentPath}/${documentId}`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 rounded-md border bg-card p-3 ${
        isDragging ? "opacity-50 shadow-lg" : ""
      }`}
      dir="rtl"
    >
      <button
        type="button"
        className="touch-none cursor-grab text-muted-foreground transition-colors hover:text-foreground active:cursor-grabbing"
        aria-label={`سحب ${title} لتغيير ترتيبه`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <Link
        href={editUrl}
        className="flex flex-1 items-center gap-2 text-sm text-foreground transition-colors hover:text-primary hover:underline"
      >
        {title}
        <ExternalLink className="h-3 w-3 opacity-50" />
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-muted-foreground hover:bg-muted hover:text-foreground"
        onClick={onRemove}
        aria-label={`إزالة ${title}`}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
