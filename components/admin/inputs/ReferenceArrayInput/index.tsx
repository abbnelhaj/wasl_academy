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
import { AvailableDocumentOption } from "./AvailableDocumentOption";
import { SortableReferenceItem } from "./SortableReferenceItem";
import type { ReferenceArrayInputProps, SanityReference } from "./types";

const REFERENCE_TYPE_LABELS: Record<string, string> = {
  course: "كورس",
  module: "وحدة",
  lesson: "درس",
  category: "تصنيف",
};

function getReferenceTypeLabel(referenceType: string) {
  return REFERENCE_TYPE_LABELS[referenceType] ?? "عنصر";
}

function ReferenceArrayInputFallback({ label }: { label: string }) {
  return (
    <div className="space-y-2">
      <Label className="text-foreground">{label}</Label>
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

function ReferenceArrayInputField({
  path,
  label,
  referenceType,
  projectId,
  dataset,
  ...handle
}: ReferenceArrayInputProps) {
  const [selectedToAdd, setSelectedToAdd] = useState<string>("");
  const referenceLabel = getReferenceTypeLabel(referenceType);

  const { data: currentRefs } = useDocument<SanityReference[] | null>({
    ...handle,
    projectId,
    dataset,
    path,
  });
  const editRefs = useEditDocument<SanityReference[] | null>({
    ...handle,
    projectId,
    dataset,
    path,
  });

  const { data: availableDocuments } = useDocuments({
    documentType: referenceType,
    projectId,
    dataset,
  });

  const refs = (currentRefs as SanityReference[]) ?? [];
  const currentRefIds = new Set(refs.map((r) => r._ref));

  const availableToAdd = availableDocuments?.filter(
    (doc) => !currentRefIds.has(doc.documentId),
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = refs.findIndex(
        (r) => r._key === active.id || r._ref === active.id,
      );
      const newIndex = refs.findIndex(
        (r) => r._key === over.id || r._ref === over.id,
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const newRefs = arrayMove(refs, oldIndex, newIndex);
        editRefs(newRefs as SanityReference[]);
      }
    }
  };

  const handleAdd = () => {
    if (!selectedToAdd) return;

    const newRef: SanityReference = {
      _type: "reference",
      _ref: selectedToAdd,
      _key: crypto.randomUUID(),
    };

    editRefs([...refs, newRef] as SanityReference[]);
    setSelectedToAdd("");
  };

  const handleRemove = (refId: string) => {
    editRefs(refs.filter((r) => r._ref !== refId) as SanityReference[]);
  };

  const sortableIds = refs.map((r) => r._key ?? r._ref);

  return (
    <div className="space-y-3" dir="rtl">
      <Label className="text-foreground">{label}</Label>

      {refs.length > 0 ? (
        <div className="rounded-md border bg-muted/30 p-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortableIds}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {refs.map((ref) => {
                  const id = ref._key ?? ref._ref;
                  return (
                    <Suspense
                      key={id}
                      fallback={
                        <div className="flex items-center gap-2 rounded-md border bg-card p-3">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <Skeleton className="h-4 w-32 flex-1" />
                          <Skeleton className="h-6 w-6" />
                        </div>
                      }
                    >
                      <SortableReferenceItem
                        id={id}
                        documentId={ref._ref}
                        documentType={referenceType}
                        projectId={projectId}
                        dataset={dataset}
                        onRemove={() => handleRemove(ref._ref)}
                      />
                    </Suspense>
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      ) : (
        <p className="py-2 text-sm text-muted-foreground">
          لم تتم إضافة أي {referenceLabel} بعد
        </p>
      )}

      {availableToAdd && availableToAdd.length > 0 && (
        <div className="flex gap-2">
          <Select
            value={selectedToAdd}
            onValueChange={(value) => setSelectedToAdd(value ?? "")}
          >
            <SelectTrigger className="flex-1 border-input bg-card text-foreground">
              <SelectValue placeholder={`أضف ${referenceLabel}...`} />
            </SelectTrigger>
            <SelectContent className="border bg-popover text-popover-foreground">
              {availableToAdd.map((doc) => (
                <SelectItem
                  key={doc.documentId}
                  value={doc.documentId}
                  className="focus:bg-accent focus:text-accent-foreground"
                >
                  <Suspense fallback={doc.documentId}>
                    <AvailableDocumentOption {...doc} />
                  </Suspense>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleAdd}
            disabled={!selectedToAdd}
            size="icon"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            aria-label={`إضافة ${referenceLabel}`}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export function ReferenceArrayInput(props: ReferenceArrayInputProps) {
  return (
    <Suspense fallback={<ReferenceArrayInputFallback label={props.label} />}>
      <ReferenceArrayInputField {...props} />
    </Suspense>
  );
}

export type { ReferenceArrayInputProps } from "./types";
