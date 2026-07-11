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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDocument, useDocuments, useEditDocument } from "@sanity/sdk-react";
import { GripVertical, Plus } from "lucide-react";
import { Suspense, useState } from "react";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ModuleAccordionItemContent } from "./ModuleAccordionItemContent";
import { ModuleOptionLabel } from "./OptionLabels";
import type { ModuleAccordionInputProps, SanityReference } from "./types";

function ModuleAccordionInputFallback({ label }: { label: string }) {
  return (
    <div className="space-y-2">
      <Label className="text-foreground">{label}</Label>
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

function ModuleAccordionInputField({
  path,
  label,
  projectId,
  dataset,
  ...handle
}: ModuleAccordionInputProps) {
  const [selectedModuleToAdd, setSelectedModuleToAdd] = useState<string>("");
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);

  const { data: currentModules } = useDocument<SanityReference[] | null>({
    ...handle,
    projectId,
    dataset,
    path,
  });
  const editModules = useEditDocument<SanityReference[] | null>({
    ...handle,
    projectId,
    dataset,
    path,
  });

  const { data: availableModules } = useDocuments({
    documentType: "module",
    projectId,
    dataset,
  });

  const modules = (currentModules as SanityReference[]) ?? [];
  const currentModuleIds = new Set(modules.map((m) => m._ref));

  const availableToAdd = availableModules?.filter(
    (doc) => !currentModuleIds.has(doc.documentId),
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleModuleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = modules.findIndex(
        (m) => m._key === active.id || m._ref === active.id,
      );
      const newIndex = modules.findIndex(
        (m) => m._key === over.id || m._ref === over.id,
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const newModules = arrayMove(modules, oldIndex, newIndex);
        editModules(newModules as SanityReference[]);
      }
    }
  };

  const handleAddModule = () => {
    if (!selectedModuleToAdd) return;

    const newModule: SanityReference = {
      _type: "reference",
      _ref: selectedModuleToAdd,
      _key: crypto.randomUUID(),
    };

    editModules([...modules, newModule] as SanityReference[]);
    setSelectedModuleToAdd("");
    setOpenAccordions((prev) => [...prev, newModule._key ?? newModule._ref]);
  };

  const handleRemoveModule = (moduleRef: string) => {
    editModules(
      modules.filter((m) => m._ref !== moduleRef) as SanityReference[],
    );
  };

  const moduleSortableIds = modules.map((m) => m._key ?? m._ref);

  return (
    <div className="space-y-3" dir="rtl">
      <Label className="text-foreground">{label}</Label>

      {modules.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleModuleDragEnd}
        >
          <SortableContext
            items={moduleSortableIds}
            strategy={verticalListSortingStrategy}
          >
            <Accordion
              multiple
              value={openAccordions}
              onValueChange={(value) => setOpenAccordions(value)}
            >
              {modules.map((module) => {
                const moduleId = module._key ?? module._ref;
                return (
                  <Suspense
                    key={moduleId}
                    fallback={
                      <div className="mb-2 flex items-center gap-2 rounded-md border bg-muted/40 p-3">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <Skeleton className="h-4 w-32 flex-1" />
                      </div>
                    }
                  >
                    <ModuleAccordionItemContent
                      id={moduleId}
                      moduleId={module._ref}
                      projectId={projectId}
                      dataset={dataset}
                      onRemoveModule={() => handleRemoveModule(module._ref)}
                    />
                  </Suspense>
                );
              })}
            </Accordion>
          </SortableContext>
        </DndContext>
      ) : (
        <p className="py-2 text-sm text-muted-foreground">
          لم تتم إضافة وحدات لهذا الكورس بعد
        </p>
      )}

      {availableToAdd && availableToAdd.length > 0 && (
        <div className="flex gap-2">
          <Select
            value={selectedModuleToAdd}
            onValueChange={(value) => setSelectedModuleToAdd(value ?? "")}
          >
            <SelectTrigger className="flex-1 border-input bg-card text-foreground">
              <SelectValue placeholder="أضف وحدة للكورس..." />
            </SelectTrigger>
            <SelectContent className="border bg-popover text-popover-foreground">
              {availableToAdd.map((doc) => (
                <SelectItem
                  key={doc.documentId}
                  value={doc.documentId}
                  className="focus:bg-accent focus:text-accent-foreground"
                >
                  <Suspense fallback={doc.documentId}>
                    <ModuleOptionLabel {...doc} />
                  </Suspense>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleAddModule}
            disabled={!selectedModuleToAdd}
            size="icon"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            aria-label="إضافة الوحدة إلى الكورس"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export function ModuleAccordionInput(props: ModuleAccordionInputProps) {
  return (
    <Suspense fallback={<ModuleAccordionInputFallback label={props.label} />}>
      <ModuleAccordionInputField {...props} />
    </Suspense>
  );
}

export type { ModuleAccordionInputProps } from "./types";
