"use client";

import {
  type DocumentHandle,
  useDocument,
  useEditDocument,
} from "@sanity/sdk-react";
import { Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface NumberInputProps extends DocumentHandle {
  path: string;
  label: string;
  placeholder?: string;
  min?: number;
  step?: number;
}

function NumberInputFallback({ label }: { label: string }) {
  return (
    <div className="space-y-2" dir="rtl">
      <Label>{label}</Label>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

function NumberInputField({
  path,
  label,
  placeholder,
  min,
  step,
  ...handle
}: NumberInputProps) {
  const { data: value } = useDocument<number | null>({ ...handle, path });
  const editValue = useEditDocument<number | null>({ ...handle, path });

  return (
    <div className="space-y-2" dir="rtl">
      <Label htmlFor={path}>{label}</Label>
      <Input
        id={path}
        type="number"
        value={value ?? ""}
        onChange={(e) => {
          const nextValue = e.currentTarget.value;
          editValue(nextValue === "" ? null : Number(nextValue));
        }}
        placeholder={placeholder}
        min={min}
        step={step}
      />
    </div>
  );
}

export function NumberInput(props: NumberInputProps) {
  return (
    <Suspense fallback={<NumberInputFallback label={props.label} />}>
      <NumberInputField {...props} />
    </Suspense>
  );
}
