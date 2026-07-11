"use client";

import {
  type DocumentHandle,
  useDocument,
  useEditDocument,
} from "@sanity/sdk-react";
import { Suspense } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface SelectOption {
  readonly value: string;
  readonly label: string;
}

interface SelectInputProps extends DocumentHandle {
  path: string;
  label: string;
  options: readonly SelectOption[];
  placeholder?: string;
}

function SelectInputFallback({ label }: { label: string }) {
  return (
    <div className="space-y-2" dir="rtl">
      <Label>{label}</Label>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

function SelectInputField({
  path,
  label,
  options,
  placeholder,
  ...handle
}: SelectInputProps) {
  const { data: value } = useDocument({ ...handle, path });
  const editValue = useEditDocument({ ...handle, path });

  if (options.length <= 4) {
    return (
      <div className="space-y-3" dir="rtl">
        <Label>{label}</Label>
        <RadioGroup
          value={(value as string) ?? ""}
          onValueChange={(newValue) => editValue(newValue)}
          className="flex flex-wrap gap-4"
        >
          {options.map((option) => (
            <div key={option.value} className="flex items-center gap-2">
              <RadioGroupItem
                value={option.value}
                id={`${path}-${option.value}`}
              />
              <Label
                htmlFor={`${path}-${option.value}`}
                className="cursor-pointer font-normal"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  }

  return (
    <div className="space-y-2" dir="rtl">
      <Label htmlFor={path}>{label}</Label>
      <Select
        value={(value as string) ?? ""}
        onValueChange={(newValue) => editValue(newValue)}
      >
        <SelectTrigger id={path} className="w-full">
          <SelectValue placeholder={placeholder ?? "اختر خيارًا"} />
        </SelectTrigger>
        <SelectContent dir="rtl">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function SelectInput(props: SelectInputProps) {
  return (
    <Suspense fallback={<SelectInputFallback label={props.label} />}>
      <SelectInputField {...props} />
    </Suspense>
  );
}
