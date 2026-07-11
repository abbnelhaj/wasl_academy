"use client";

import {
  type DocumentHandle,
  useDocument,
  useEditDocument,
} from "@sanity/sdk-react";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { Suspense, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { uploadImage } from "@/lib/actions/images";
import { urlFor } from "@/sanity/lib/image";
import type { Course } from "@/sanity.types";

interface ImageInputProps extends DocumentHandle {
  path: string;
  label: string;
}

type ImageFieldValue = Course["thumbnail"];

function ImageInputFallback({ label }: { label: string }) {
  return (
    <div className="space-y-2" dir="rtl">
      <Label>{label}</Label>
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

function ImageInputField({ path, label, ...handle }: ImageInputProps) {
  const { data: imageData } = useDocument<ImageFieldValue>({
    ...handle,
    path,
  });
  const editImage = useEditDocument<ImageFieldValue | null>({
    ...handle,
    path,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const image = imageData as ImageFieldValue | null;
  const hasImage = image?.asset?._ref;

  async function handleUpload(file: File) {
    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadImage(formData);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.assetId) {
        editImage({
          _type: "image",
          asset: {
            _type: "reference",
            _ref: result.assetId,
          },
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر رفع الصورة");
    } finally {
      setIsUploading(false);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
    e.target.value = "";
  }

  function handleRemove() {
    editImage(null);
    setError(null);
  }

  function handleClick() {
    fileInputRef.current?.click();
  }

  const imageUrl = hasImage ? urlFor(image).width(400).height(225).url() : null;

  return (
    <div className="space-y-2" dir="rtl">
      <Label>{label}</Label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      <div
        className={`relative overflow-hidden rounded-md border bg-card ${
          isUploading ? "pointer-events-none opacity-60" : ""
        }`}
      >
        {hasImage && imageUrl ? (
          <div className="group relative">
            <Image
              width={400}
              height={225}
              src={imageUrl}
              alt="معاينة صورة الغلاف"
              className="aspect-video h-auto w-full object-cover"
            />

            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/75 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleClick}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 me-1" />
                استبدال
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                disabled={isUploading}
              >
                <X className="h-4 w-4 me-1" />
                إزالة
              </Button>
            </div>

            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={handleClick}
            disabled={isUploading}
            aria-label={`رفع ${label}`}
            className="flex w-full cursor-pointer flex-col items-center justify-center py-8 text-muted-foreground transition-colors hover:text-foreground"
          >
            {isUploading ? (
              <>
                <Loader2 className="mb-2 h-10 w-10 animate-spin text-primary" />
                <p className="text-sm">جاري الرفع...</p>
              </>
            ) : (
              <>
                <ImageIcon className="mb-2 h-10 w-10" />
                <p className="text-sm font-medium">اضغط لرفع صورة</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  JPEG أو PNG أو GIF أو WebP بحد أقصى 10MB
                </p>
              </>
            )}
          </button>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function ImageInput(props: ImageInputProps) {
  return (
    <Suspense fallback={<ImageInputFallback label={props.label} />}>
      <ImageInputField {...props} />
    </Suspense>
  );
}
