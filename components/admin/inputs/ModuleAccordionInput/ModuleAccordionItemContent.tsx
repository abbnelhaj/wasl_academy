"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  useDocument,
  useDocumentProjection,
  useDocuments,
  useEditDocument,
} from "@sanity/sdk-react";
import { ExternalLink, GripVertical, Layers, Plus, X } from "lucide-react";
import Link from "next/link";
import { Suspense, useState } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { LessonOptionLabel } from "./OptionLabels";
import { SortableLessonItem } from "./SortableLessonItem";
import type { SanityReference } from "./types";

interface ModuleAccordionItemContentProps {
  id: string;
  moduleId: string;
  projectId: string;
  dataset: string;
  onRemoveModule: () => void;
}

export function ModuleAccordionItemContent({
  id,
  moduleId,
  projectId,
  dataset,
  onRemoveModule,
}: ModuleAccordionItemContentProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const [selectedLessonToAdd, setSelectedLessonToAdd] = useState<string>("");

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { data: moduleData } = useDocumentProjection({
    documentId: moduleId,
    documentType: "module",
    projectId,
    dataset,
    projection: "{ title, lessons }",
  });

  const { data: currentLessons } = useDocument<SanityReference[] | null>({
    documentId: moduleId,
    documentType: "module",
    projectId,
    dataset,
    path: "lessons",
  });
  const editLessons = useEditDocument<SanityReference[] | null>({
    documentId: moduleId,
    documentType: "module",
    projectId,
    dataset,
    path: "lessons",
  });

  const { data: allLessons } = useDocuments({
    documentType: "lesson",
    projectId,
    dataset,
  });

  const title = (moduleData as { title?: string })?.title || "وحدة بدون عنوان";
  const lessons = (currentLessons as SanityReference[]) ?? [];
  const currentLessonIds = new Set(lessons.map((l) => l._ref));

  const availableLessons = allLessons?.filter(
    (doc) => !currentLessonIds.has(doc.documentId),
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleLessonDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = lessons.findIndex(
        (l) => l._key === active.id || l._ref === active.id,
      );
      const newIndex = lessons.findIndex(
        (l) => l._key === over.id || l._ref === over.id,
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const newLessons = arrayMove(lessons, oldIndex, newIndex);
        editLessons(newLessons as SanityReference[]);
      }
    }
  };

  const handleAddLesson = () => {
    if (!selectedLessonToAdd) return;

    const newLesson: SanityReference = {
      _type: "reference",
      _ref: selectedLessonToAdd,
      _key: crypto.randomUUID(),
    };

    editLessons([...lessons, newLesson] as SanityReference[]);
    setSelectedLessonToAdd("");
  };

  const handleRemoveLesson = (lessonRef: string) => {
    editLessons(
      lessons.filter((l) => l._ref !== lessonRef) as SanityReference[],
    );
  };

  const lessonSortableIds = lessons.map((l) => l._key ?? l._ref);
  const editUrl = `/admin/modules/${moduleId}`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? "z-50 opacity-50 shadow-lg" : ""}`}
      dir="rtl"
    >
      <AccordionItem
        value={id}
        className="mb-2 rounded-md border bg-muted/30 px-1"
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="touch-none cursor-grab ps-2 text-muted-foreground transition-colors hover:text-foreground active:cursor-grabbing"
            aria-label="سحب الوحدة لتغيير ترتيبها"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <AccordionTrigger className="flex-1 py-3 hover:no-underline">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <span className="text-foreground">{title}</span>
              <span className="text-xs text-muted-foreground">
                ({lessons.length} درس)
              </span>
            </div>
          </AccordionTrigger>
          <div className="flex items-center gap-1 pe-2">
            <Link
              href={editUrl}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={(e) => e.stopPropagation()}
              aria-label="فتح محرر الوحدة"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveModule();
              }}
              aria-label="إزالة الوحدة من الكورس"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <AccordionContent className="px-2 pb-3">
          {lessons.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleLessonDragEnd}
            >
              <SortableContext
                items={lessonSortableIds}
                strategy={verticalListSortingStrategy}
              >
                <div className="mb-3 space-y-1.5">
                  {lessons.map((lesson) => {
                    const lessonId = lesson._key ?? lesson._ref;
                    return (
                      <Suspense
                        key={lessonId}
                        fallback={
                          <div className="flex items-center gap-2 rounded-md border bg-card p-2.5">
                            <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                            <Skeleton className="h-4 w-32 flex-1" />
                          </div>
                        }
                      >
                        <SortableLessonItem
                          id={lessonId}
                          documentId={lesson._ref}
                          projectId={projectId}
                          dataset={dataset}
                          onRemove={() => handleRemoveLesson(lesson._ref)}
                        />
                      </Suspense>
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <p className="py-2 ps-1 text-xs text-muted-foreground">
              لا توجد دروس داخل هذه الوحدة
            </p>
          )}

          {availableLessons && availableLessons.length > 0 && (
            <div className="flex gap-2">
              <Select
                value={selectedLessonToAdd}
                onValueChange={(value) => setSelectedLessonToAdd(value ?? "")}
              >
                <SelectTrigger className="h-8 flex-1 border-input bg-card text-xs text-foreground">
                  <SelectValue placeholder="أضف درسًا للوحدة..." />
                </SelectTrigger>
                <SelectContent className="border bg-popover text-popover-foreground">
                  {availableLessons.map((doc) => (
                    <SelectItem
                      key={doc.documentId}
                      value={doc.documentId}
                      className="focus:bg-accent focus:text-accent-foreground"
                    >
                      <Suspense fallback={doc.documentId}>
                        <LessonOptionLabel {...doc} />
                      </Suspense>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleAddLesson}
                disabled={!selectedLessonToAdd}
                size="sm"
                className="h-8 w-8 bg-primary p-0 text-primary-foreground hover:bg-primary/90"
                aria-label="إضافة الدرس إلى الوحدة"
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </div>
  );
}
