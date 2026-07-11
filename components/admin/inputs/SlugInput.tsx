"use client";

import {
  type DocumentHandle,
  useDocument,
  useEditDocument,
} from "@sanity/sdk-react";
import { RefreshCw } from "lucide-react";
import { Suspense, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface SlugValue {
  _type: "slug";
  current: string;
}

const ARABIC_SLUG_REPLACEMENTS: Record<string, string> = {
  ء: "",
  آ: "a",
  أ: "a",
  إ: "i",
  ا: "a",
  ب: "b",
  ت: "t",
  ث: "th",
  ج: "j",
  ح: "h",
  خ: "kh",
  د: "d",
  ذ: "dh",
  ر: "r",
  ز: "z",
  س: "s",
  ش: "sh",
  ص: "s",
  ض: "d",
  ط: "t",
  ظ: "z",
  ع: "a",
  غ: "gh",
  ف: "f",
  ق: "q",
  ك: "k",
  ل: "l",
  م: "m",
  ن: "n",
  ه: "h",
  ة: "h",
  و: "w",
  ي: "y",
  ى: "a",
  ئ: "y",
  ؤ: "w",
  پ: "p",
  چ: "ch",
  ژ: "zh",
  گ: "g",
  "٠": "0",
  "١": "1",
  "٢": "2",
  "٣": "3",
  "٤": "4",
  "٥": "5",
  "٦": "6",
  "٧": "7",
  "٨": "8",
  "٩": "9",
};

interface SlugInputProps extends DocumentHandle {
  path: string;
  label: string;
  sourceField?: string;
  placeholder?: string;
}

function transliterateArabic(text: string): string {
  return text.replace(
    /[\u0600-\u06ff]/g,
    (letter) => ARABIC_SLUG_REPLACEMENTS[letter] ?? "",
  );
}

function slugify(text: string): string {
  return transliterateArabic(text)
    .normalize("NFKD")
    .toLowerCase()
    .trim()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function getFallbackSlug(documentType: string, documentId: string): string {
  const stableId = documentId
    .replace(/^drafts\./, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 8)
    .toLowerCase();

  return slugify(`${documentType}-${stableId || "new"}`);
}

function getGeneratedSlug(
  sourceValue: string | undefined,
  documentType: string,
  documentId: string,
) {
  const sourceSlug = slugify(sourceValue ?? "");

  return sourceSlug || getFallbackSlug(documentType, documentId);
}

function SlugInputFallback({ label }: { label: string }) {
  return (
    <div className="space-y-2" dir="rtl">
      <Label>{label}</Label>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

function SlugInputField({
  path,
  label,
  sourceField = "title",
  placeholder = "course-slug",
  ...handle
}: SlugInputProps) {
  const { data: slugValue } = useDocument<SlugValue>({ ...handle, path });
  const { data: sourceValue } = useDocument<string>({
    ...handle,
    path: sourceField,
  });
  const editSlug = useEditDocument<SlugValue>({ ...handle, path });

  const currentSlug = slugValue?.current ?? "";
  const lastAutoSlugRef = useRef<string | null>(null);
  const generatedSlug = getGeneratedSlug(
    sourceValue,
    handle.documentType,
    handle.documentId,
  );

  useEffect(() => {
    const hasSourceValue = Boolean(sourceValue?.trim());
    const shouldAutoGenerate =
      hasSourceValue &&
      (!currentSlug || currentSlug === lastAutoSlugRef.current);

    if (!shouldAutoGenerate || currentSlug === generatedSlug) {
      return;
    }

    lastAutoSlugRef.current = generatedSlug;
    editSlug({
      _type: "slug",
      current: generatedSlug,
    });
  }, [currentSlug, editSlug, generatedSlug, sourceValue]);

  const handleChange = (value: string) => {
    lastAutoSlugRef.current = null;
    editSlug({
      _type: "slug",
      current: slugify(value),
    });
  };

  const generateFromSource = () => {
    lastAutoSlugRef.current = generatedSlug;
    editSlug({
      _type: "slug",
      current: generatedSlug,
    });
  };

  return (
    <div className="space-y-2" dir="rtl">
      <Label htmlFor={path}>{label}</Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute start-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            /
          </span>
          <Input
            id={path}
            type="text"
            value={currentSlug}
            onChange={(e) => handleChange(e.currentTarget.value)}
            placeholder={placeholder}
            className="ps-6"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={generateFromSource}
          title="توليد من العنوان"
          aria-label="توليد الرابط من العنوان"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        يتولد تلقائيًا من العنوان بحروف إنجليزية وأرقام وشرطات، ويمكنك تعديله عند
        الحاجة.
      </p>
    </div>
  );
}

export function SlugInput(props: SlugInputProps) {
  return (
    <Suspense fallback={<SlugInputFallback label={props.label} />}>
      <SlugInputField {...props} />
    </Suspense>
  );
}
